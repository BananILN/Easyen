import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { fetchTestById, fetchQuestionsByTest, fetchAnswersByQuestion, submitTestResult, fetchProgress, saveProgress, saveUserAnswers, fetchUserAnswersByTest, deleteUserAnswersByTest } from "../http/TestApi";
import { fetchOneLesson } from "../http/LessonApi";
import Loader from "../components/Loader";
import { Button } from "antd";
import { UserContext } from "../context/UserContext";

const Test = () => {
  const { id: testId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [test, setTest] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(null);
  const [testNotFound, setTestNotFound] = useState(false);
  const [results, setResults] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [completedTests, setCompletedTests] = useState([]);

  useEffect(() => {
    const loadTestData = async () => {
      try {
        setLoading(true);
        setStartTime(new Date());

        const testData = await fetchTestById(testId);
        if (!testData) {
          setTestNotFound(true);
          return;
        }
        console.log('Test - testData:', testData);
        setTest(testData);

        if (!testData.LessonID || isNaN(testData.LessonID)) {
          throw new Error(`Неверный LessonID: ${testData.LessonID}`);
        }

        const lessonData = await fetchOneLesson(testData.LessonID);
        console.log("Test - Lesson data:", lessonData);
        if (!lessonData) {
          throw new Error("Урок не найден");
        }
        setLesson(lessonData);

        const questionsData = await fetchQuestionsByTest(testData.TestID);
        if (questionsData.length === 0) {
          throw new Error("Вопросы для теста не найдены");
        }
        const limitedQuestions = questionsData.slice(0, 15);
        setQuestions(limitedQuestions);

        const answersData = {};
        const initialSelectedAnswers = {};
        for (const question of limitedQuestions) {
          const questionAnswers = await fetchAnswersByQuestion(question.QuestionID);
          answersData[question.QuestionID] = questionAnswers;
          initialSelectedAnswers[question.QuestionID] = [];
        }
        setAnswers(answersData);
        setSelectedAnswers(initialSelectedAnswers);
      } catch (err) {
        console.error('Test - Ошибка загрузки данных:', err);
        setError(err.message || "Ошибка загрузки данных");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadTestData();
    } else {
      setLoading(false);
      setError("Пользователь не авторизован");
    }
  }, [testId, user]);

  const handleAnswerSelect = (questionId, answerId, isMultipleChoice) => {
    setSelectedAnswers((prev) => {
      const currentSelection = prev[questionId] || [];
      if (isMultipleChoice) {
        if (currentSelection.includes(answerId)) {
          return {
            ...prev,
            [questionId]: currentSelection.filter((id) => id !== answerId),
          };
        } else {
          return {
            ...prev,
            [questionId]: [...currentSelection, answerId],
          };
        }
      } else {
        return {
          ...prev,
          [questionId]: [answerId],
        };
      }
    });
  };

  const isAnswerSelected = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return false;
    const currentQuestionId = currentQuestion.QuestionID;
    const userAnswers = selectedAnswers[currentQuestionId] || [];
    return userAnswers.length > 0;
  };

  const handleNextQuestion = () => {
    if (!isAnswerSelected()) return;
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateScore();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = async () => {
    let correctAnswers = 0;
    const detailedResults = [];

    const userAnswersToSave = [];

    questions.forEach((question) => {
      const userAnswers = selectedAnswers[question.QuestionID] || [];
      const correctAnswerIds = answers[question.QuestionID]
        .filter((answer) => answer.IsCorrect)
        .map((answer) => answer.AnswerID);

      let isCorrect = false;
      if (question.IsMultipleChoice) {
        isCorrect =
          userAnswers.length === correctAnswerIds.length &&
          userAnswers.every((answerId) => correctAnswerIds.includes(answerId));
      } else {
        isCorrect = userAnswers[0] && correctAnswerIds.includes(userAnswers[0]);
      }

      if (isCorrect) correctAnswers++;

      const userAnswerTexts = userAnswers.map((answerId) =>
        answers[question.QuestionID].find((ans) => ans.AnswerID === answerId)?.AnswerText || "Не выбрано"
      );
      const correctAnswerTexts = correctAnswerIds.map((answerId) =>
        answers[question.QuestionID].find((ans) => ans.AnswerID === answerId)?.AnswerText
      );

      detailedResults.push({
        questionText: question.QuestionText,
        userAnswers: userAnswerTexts,
        correctAnswers: correctAnswerTexts,
        isCorrect,
      });

      userAnswers.forEach((answerId) => {
        userAnswersToSave.push({
          UserID: user.UserID,
          QuestionID: question.QuestionID,
          AnswerID: answerId,
          TestID: test.TestID,
        });
      });
    });

    const finalScore = Math.round((correctAnswers / questions.length) * 100);
    const endTime = new Date();
    const timeTaken = Math.round((endTime - startTime) / 1000);
    setScore(finalScore);
    setResults(detailedResults);

    const userId = user?.UserID;
    if (userId && test) {
      const existingUserAnswers = await fetchUserAnswersByTest(test.TestID, userId);
      if (existingUserAnswers.length > 0) {
        await deleteUserAnswersByTest(test.TestID, userId);
      }

      try {
        await Promise.all(
          userAnswersToSave.map((userAnswer) => saveUserAnswers(userAnswer))
        );
        console.log("Ответы пользователя успешно сохранены или обновлены");
      } catch (err) {
        console.error("Ошибка при сохранении ответов пользователя:", err);
      }

      await fetch(`${import.meta.env.VITE_API_URL}/api/testResult`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          TestID: test.TestID,
          UserID: userId,
          Score: finalScore,
          timeTaken,
        }),
      }).catch((err) => {
        console.error("Ошибка при отправке результата теста:", err);
      });

      await saveProgress(userId, test.LessonID, test.TestID, true);
    }
  };

  const handleNextTest = async () => {
    const userId = user?.UserID;
    if (!userId) {
      setError("Пользователь не авторизован");
      return;
    }

    try {
      const progressData = await fetchProgress(userId, test.LessonID);
      const savedCompletedTests = progressData
        .filter((progress) => progress.completed && progress.TestID)
        .map((progress) => progress.TestID);
      setCompletedTests(savedCompletedTests);

      const nextIndex = savedCompletedTests.length;
      console.log("handleNextTest - lesson.tests:", lesson?.tests);
      console.log("handleNextTest - savedCompletedTests:", savedCompletedTests);
      console.log("handleNextTest - test.LessonID:", test.LessonID);
      console.log("handleNextTest - Navigating to:", `/lesson/${test.LessonID}?currentLessonIndex=${nextIndex}`);

      if (!test.LessonID || isNaN(test.LessonID)) {
        throw new Error(`Неверный LessonID: ${test.LessonID}`);
      }

      if (!lesson || !lesson.tests) {
        console.warn("handleNextTest - Данные урока отсутствуют, загружаем заново");
        const lessonData = await fetchOneLesson(test.LessonID);
        setLesson(lessonData);
        if (!lessonData.tests) {
          console.error("handleNextTest - Тесты урока не найдены");
          navigate(`/lesson/${test.LessonID}/results`);
          return;
        }
      }

      navigate(`/lesson/${test.LessonID}?currentLessonIndex=${nextIndex}`, { replace: true });
    } catch (error) {
      console.error("handleNextTest - Ошибка:", error);
      setError("Не удалось перейти к следующей части урока");
    }
  };

  const handleReturnToLesson = async () => {
    const userId = user?.UserID;
    if (!userId) {
      setError("Пользователь не авторизован");
      return;
    }

    try {
      const progressData = await fetchProgress(userId, test.LessonID);
      const savedCompletedTests = progressData
        .filter((progress) => progress.completed && progress.TestID)
        .map((progress) => progress.TestID);
      setCompletedTests(savedCompletedTests);

      const allTests = lesson?.tests || [];
      const hasNextTest = savedCompletedTests.length < allTests.length;

      if (hasNextTest) {
        navigate(`/lesson/${test.LessonID}?currentLessonIndex=${savedCompletedTests.length}`);
      } else {
        navigate(`/lesson/${test.LessonID}/results`);
      }
    } catch (error) {
      console.error("handleReturnToLesson - Ошибка:", error);
      setError("Не удалось вернуться к уроку");
    }
  };

  useEffect(() => {
    const loadProgress = async () => {
      if (score !== null && user?.UserID && test) {
        try {
          const progressData = await fetchProgress(user.UserID, test.LessonID);
          const savedCompletedTests = progressData
            .filter((progress) => progress.completed && progress.TestID)
            .map((progress) => progress.TestID);
          setCompletedTests(savedCompletedTests);
        } catch (error) {
          console.error("loadProgress - Ошибка:", error);
          setError("Ошибка загрузки прогресса");
        }
      }
    };
    loadProgress();
  }, [score, user, test]);

  const progressPercentage = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  if (loading) {
    return <div className="loader"><Loader /></div>;
  }

  if (error) {
    return (
      <div className="error">
        Ошибка: {error}
        <Button type="primary" onClick={() => navigate(`/lesson/${test?.LessonID || ''}`)}>
          Вернуться к уроку
        </Button>
      </div>
    );
  }

  if (testNotFound) {
    return (
      <div className="test-page">
        <h1>Тест не найден</h1>
        <p>Для этого урока тест ещё не создан.</p>
        <Button type="primary" onClick={() => navigate(`/lesson/${test?.LessonID || ''}`)}>
          Вернуться к уроку
        </Button>
      </div>
    );
  }

  if (score !== null && lesson) {
    const userId = user?.UserID;
    if (!userId) return <div>Пользователь не авторизован</div>;

    return (
      <div className="test-page">
        <h1>Результат теста</h1>
        <p>Ваш результат: {score}%</p>
        <Button type="primary" onClick={handleNextTest}>
          Далее
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswers = currentQuestion ? answers[currentQuestion.QuestionID] || [] : [];

  return (
    <div className="test-page">
      <h1>{test?.title}</h1>
      <div className="question-container">
        <h2>Вопрос {currentQuestionIndex + 1} из {questions.length}</h2>
        <p className="question-text">{currentQuestion?.QuestionText}</p>
        <div className="answers-container">
          {currentAnswers.map((answer) => (
            <div
              key={answer.AnswerID}
              className={`answer-option ${
                selectedAnswers[currentQuestion.QuestionID]?.includes(answer.AnswerID)
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                handleAnswerSelect(
                  currentQuestion.QuestionID,
                  answer.AnswerID,
                  currentQuestion.IsMultipleChoice
                )
              }
            >
              <span>{answer.AnswerText}</span>
            </div>
          ))}
        </div>
      </div>

      {!isAnswerSelected() && (
        <p className="warning-message">Пожалуйста, выберите хотя бы один ответ, чтобы продолжить.</p>
      )}

      <div className="navigation-buttons">
        <Button disabled={currentQuestionIndex === 0} onClick={handlePreviousQuestion}>
          Назад
        </Button>
        <Button type="primary" onClick={handleNextQuestion} disabled={!isAnswerSelected()}>
          {currentQuestionIndex === questions.length - 1 ? "Завершить" : "Далее"}
        </Button>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
        <span className="progress-text">{Math.round(progressPercentage)}%</span>
      </div>
    </div>
  );
};

export default Test;