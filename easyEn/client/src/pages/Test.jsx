import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  fetchTestById,
  fetchQuestionsByTest,
  fetchAnswersByQuestion,
  submitTestResult,
  fetchProgress,
  saveProgress,
  saveUserAnswers,
  fetchUserAnswersByTest,
  deleteUserAnswersByTest,
} from "../http/TestApi";
import { fetchOneLesson } from "../http/LessonApi";
import LoaderNote from "../components/Loader";
import { Button, message } from "antd";
import { UserContext } from "../context/UserContext";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import humanOnglas from '../assets/humanOnglas.png';
import pAtoms from '../assets/pAtoms.png';
import human from '../assets/human.png';

const Test = () => {
  const { t } = useTranslation();
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
  const [feedback, setFeedback] = useState({});
  const [isLocked, setIsLocked] = useState({});
  const [showConfetti, setShowConfetti] = useState({});
  const [hasShaken, setHasShaken] = useState({});

  const answerRefs = useRef({});
  const isSaving = useRef(false);

   const backgroundStyle = {
  content: '',
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundImage: `url(${humanOnglas}), url(${pAtoms}), url(${human})`,
  backgroundSize: '30%, 40%, 35%',
  backgroundPosition: '10% 10%, 70% 70%, 30% 50%',
  backgroundRepeat: 'no-repeat',
  opacity: 0.2,
  backgroundBlendMode: 'overlay',
  zIndex: -1,
  animation: 'fadeBackground 15s infinite ease-in-out',
};

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
        setTest(testData);

        if (!testData.LessonID || isNaN(testData.LessonID)) {
          throw new Error(t("invalid_lesson_id", { id: testData.LessonID }));
        }

        const lessonData = await fetchOneLesson(testData.LessonID);
        setLesson(lessonData);

        const questionsData = await fetchQuestionsByTest(testData.TestID);
        console.log("Fetched questions for test ID", testId, ":", questionsData);
        if (questionsData.length === 0) {
          console.warn("No questions found for test ID:", testId);
          setError(t("no_questions_found"));
          return;
        }
        const limitedQuestions = questionsData.slice(0, 15);
        setQuestions(limitedQuestions);

        const answersData = {};
        const initialSelectedAnswers = {};
        const initialIsLocked = {};
        for (const question of limitedQuestions) {
          const questionAnswers = await fetchAnswersByQuestion(question.QuestionID);
          answersData[question.QuestionID] = questionAnswers;
          initialSelectedAnswers[question.QuestionID] = [];
          initialIsLocked[question.QuestionID] = false;
        }
        setAnswers(answersData);
        setSelectedAnswers(initialSelectedAnswers);
        setIsLocked(initialIsLocked);
      } catch (err) {
        console.error("Test - Error loading data:", err);
        setError(err.message || t("error_loading_data"));
      } finally {                                                                                                                                                                                                                                                                                    
        setLoading(false);
      }
    };

    if (user) {
      loadTestData();
    } else {
      setLoading(false);
      setError(t("user_not_authenticated"));
    }
  }, [testId, user, t]);

  const handleAnswerSelect = async (questionId, answerId) => {
    const currentQuestionId = questions[currentQuestionIndex]?.QuestionID;
    if (!currentQuestionId || isLocked[currentQuestionId]) return;

    setSelectedAnswers((prev) => {
      const newSelection = [answerId]; 

    
      const correctAnswerIds = answers[questionId].filter((a) => a.IsCorrect).map((a) => a.AnswerID);

      
      const isCorrect = correctAnswerIds.includes(answerId);

      
      setFeedback((prev) => ({
        ...prev,
        [questionId]: {
          isCorrect,
          correctAnswers: correctAnswerIds,
          userAnswers: newSelection,
        },
      }));

      
      if (!isCorrect) {
        if (!hasShaken[`${questionId}-${answerId}`]) {
          animateShake(questionId, answerId);
          setHasShaken((prev) => ({
            ...prev,
            [`${questionId}-${answerId}`]: true,
          }));
        }
      }

   
      if (isCorrect) {
        correctAnswerIds.forEach((correctId) => {
          if (!showConfetti[`${questionId}-${correctId}`]) {
            animateConfetti(questionId, correctId);
            setShowConfetti((prev) => ({
              ...prev,
              [`${questionId}-${correctId}`]: true,
            }));
          }
        });
      }

     
      setIsLocked((prev) => ({
        ...prev,
        [questionId]: true,
      }));

      saveAnswerToDB(questionId, newSelection);

      return {
        ...prev,
        [questionId]: newSelection,
      };
    });
  };

  const saveAnswerToDB = async (questionId, answerIds) => {
  const userId = user?.UserID;
  if (!userId || !test || isSaving.current) return;

  isSaving.current = true;
  try {
    const answersToSave = answerIds.map((answerId) => ({
      UserID: userId,
      QuestionID: questionId,
      AnswerID: answerId,
      TestID: test.TestID,
    }));

    
    const existingAnswers = await fetchUserAnswersByTest(test.TestID, userId);
    const existingForQuestion = existingAnswers.filter((a) => a.QuestionID === questionId);
    if (existingForQuestion.length > 0) {
      await deleteUserAnswersByTest(test.TestID, userId, questionId); 
    }

    await Promise.all(answersToSave.map((answer) => saveUserAnswers(answer)));
    message.success(t("answer_saved_success"));
  } catch (err) {
    console.error("Ошибка сохранения ответа:", err);
    message.error(t("error_saving_answer"));
  } finally {
    isSaving.current = false;
  }
};

  const animateShake = (questionId, answerId) => {
    const element = answerRefs.current[`${questionId}-${answerId}`];
    if (element) {
      element.classList.remove("horizontal-shaking");
      requestAnimationFrame(() => {
        element.style.animation = "none";
        element.offsetHeight;
        element.style.animation = "";
        element.classList.add("horizontal-shaking");
      });
    }
  };

  const animateConfetti = (questionId, answerId) => {
    const element = answerRefs.current[`${questionId}-${answerId}`];
    if (element) {
      element.classList.remove("bubbly-effect", "animate");
      void element.offsetWidth;
      element.classList.add("bubbly-effect", "animate");
    }
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
      setShowConfetti({});
      setHasShaken({});
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

  questions.forEach((question) => {
    const userAnswers = selectedAnswers[question.QuestionID] || [];
    const correctAnswerIds = answers[question.QuestionID]
      .filter((answer) => answer.IsCorrect)
      .map((answer) => answer.AnswerID);

    const isCorrect = userAnswers.length > 0 && correctAnswerIds.includes(userAnswers[0]);

    if (isCorrect) correctAnswers++;

    const userAnswerTexts = userAnswers.map((answerId) =>
      answers[question.QuestionID].find((ans) => ans.AnswerID === answerId)?.AnswerText || t("not_selected")
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
  });

  const finalScore = Math.round((correctAnswers / questions.length) * 100);
  const endTime = new Date();
  const timeTaken = Math.round((endTime - startTime) / 1000);
  setScore(finalScore);
  setResults(detailedResults);

  const userId = user?.UserID;
  if (userId && test) {
    try {
      await submitTestResult(test.TestID, userId, finalScore, timeTaken, detailedResults);
      await saveProgress(userId, test.LessonID, test.TestID, true);
      message.success(t("test_completed_success"));
      navigate(`/lesson/${test.LessonID}?currentLessonIndex=${completedTests.length + 1}`);
    } catch (err) {
      console.error("Ошибка сохранения результата теста:", err);
      message.error(t("error_completing_test"));
    }
  }
};

  const handleNextTest = async () => {
    const userId = user?.UserID;
    if (!userId) {
      setError(t("user_not_authenticated"));
      return;
    }

    try {
      const progressData = await fetchProgress(userId, test.LessonID);
      const savedCompletedTests = progressData
        .filter((progress) => progress.completed && progress.TestID)
        .map((progress) => progress.TestID);
      setCompletedTests(savedCompletedTests);

      const nextIndex = savedCompletedTests.length;
      if (!test.LessonID || isNaN(test.LessonID)) {
        throw new Error(t("invalid_lesson_id", { id: test.LessonID }));
      }

      if (!lesson || !lesson.tests) {
        const lessonData = await fetchOneLesson(test.LessonID);
        setLesson(lessonData);
        if (!lessonData.tests) {
          navigate(`/lesson/${test.LessonID}/results`);
          return;
        }
      }

      navigate(`/lesson/${test.LessonID}?currentLessonIndex=${nextIndex}`, { replace: true });
    } catch (error) {
      console.error("handleNextTest - Error:", error);
      setError(t("failed_to_proceed"));
    }
  };

  const handleReturnToLesson = async () => {
    const userId = user?.UserID;
    if (!userId) {
      setError(t("user_not_authenticated"));
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
      console.error("handleReturnToLesson - Error:", error);
      setError(t("failed_to_return"));
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
          console.error("loadProgress - Error:", error);
          setError(t("error_loading_progress"));
        }
      }
    };
    loadProgress();
  }, [score, user, test, t]);

  const progressPercentage = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  if (loading) {
    return <div className="loader"><LoaderNote /></div>;
  }

  if (error) {
    return (
      <div className="error">
        {t("error")}: {error}
        <Button type="primary" onClick={() => navigate(`/lesson/${test?.LessonID || ""}`)}>
          {t("return_to_lesson")}
        </Button>
      </div>
    );
  }

  if (testNotFound) {
    return (
      <div className="test-page">
        <h1>{t("test_not_found")}</h1>
        <p>{t("test_not_created")}</p>
        <Button type="primary" onClick={() => navigate(`/lesson/${test?.LessonID || ""}`)}>
          {t("return_to_lesson")}
        </Button>
      </div>
    );
  }

 

  if (score !== null && lesson && test.testType === "regular") {
    const userId = user?.UserID;
    if (!userId) return <div>{t("user_not_authenticated")}</div>;

    return (
      <div className="test-page">
       
      
        <h1>{t("test_results")}</h1>
        <p>
          {t("your_score")}: {score}%
        </p>
        <Button type="primary" onClick={handleNextTest}>
          {t("next")}
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
        <h2>
          {t("question_progress", { index: currentQuestionIndex + 1, total: questions.length })}
        </h2>
        <p className="question-text">{currentQuestion?.QuestionText}</p>
        {test.testType === "trueFalse" ? (
          <div className="true-false-container">
            {currentAnswers.map((answer) => {
              const questionId = currentQuestion.QuestionID;
              const isSelected = selectedAnswers[questionId]?.includes(answer.AnswerID);
              const feedbackData = feedback[questionId];
              const correctAnswerIds = feedbackData?.correctAnswers || [];
              const isAnswerCorrect = correctAnswerIds.includes(answer.AnswerID);
              const hasConfetti = showConfetti[`${questionId}-${answer.AnswerID}`] && isAnswerCorrect;
              const hasShake = hasShaken[`${questionId}-${answer.AnswerID}`] && !isAnswerCorrect;

              return (
                <div
                  key={answer.AnswerID}
                  ref={(el) => (answerRefs.current[`${questionId}-${answer.AnswerID}`] = el)}
                  className={`answer-option true-false-card ${
                    isSelected
                      ? isAnswerCorrect
                        ? "correct"
                        : "incorrect"
                      : feedbackData && isAnswerCorrect
                      ? "correct-faded"
                      : feedbackData && !isAnswerCorrect
                      ? "incorrect-faded"
                      : ""
                  } ${isSelected ? "selected" : ""} ${hasConfetti ? "bubbly-effect animate" : ""} ${
                    hasShake ? "horizontal-shaking" : ""
                  }`}
                  onClick={() => handleAnswerSelect(questionId, answer.AnswerID)}
                  style={{
                    cursor: isLocked[questionId] ? "default" : "pointer",
                  }}
                >
                  <div className="answer-content-trueFalse">
                    <span>{answer.AnswerText}</span>
                    {feedbackData && isLocked[questionId] && (
                      <div className="feedback-container">
                        {isAnswerCorrect && <CheckCircleOutlined />}
                        {!isAnswerCorrect && <CloseCircleOutlined />}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="answers-container" style={{ animation: currentQuestionIndex > 0 ? "fadeIn 0.5s" : "none" }}>
            {currentAnswers.map((answer) => {
              const questionId = currentQuestion.QuestionID;
              const isSelected = selectedAnswers[questionId]?.includes(answer.AnswerID);
              const feedbackData = feedback[questionId];
              const correctAnswerIds = feedbackData?.correctAnswers || [];
              const isAnswerCorrect = correctAnswerIds.includes(answer.AnswerID);
              const hasConfetti = showConfetti[`${questionId}-${answer.AnswerID}`] && isAnswerCorrect;
              const hasShake = hasShaken[`${questionId}-${answer.AnswerID}`] && !isAnswerCorrect;

              return (
                <div
                  key={answer.AnswerID}
                  ref={(el) => (answerRefs.current[`${questionId}-${answer.AnswerID}`] = el)}
                  className={`answer-option ${
                    isSelected
                      ? isAnswerCorrect
                        ? "correct"
                        : "incorrect"
                      : feedbackData && isAnswerCorrect
                      ? "correct-faded"
                      : feedbackData && !isAnswerCorrect
                      ? "incorrect-faded"
                      : ""
                  } ${isSelected ? "selected" : ""} ${hasConfetti ? "bubbly-effect animate" : ""} ${
                    hasShake ? "horizontal-shaking" : ""
                  }`}
                  onClick={() => handleAnswerSelect(questionId, answer.AnswerID)}
                  style={{
                    cursor: isLocked[questionId] ? "default" : "pointer",
                  }}
                >
                  <div className="answer-content">
                    <span>{answer.AnswerText}</span>
                    {feedbackData && isLocked[questionId] && (
                      <div className="feedback-container">
                        {isAnswerCorrect && <CheckCircleOutlined />}
                        {!isAnswerCorrect && <CloseCircleOutlined />}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {!isAnswerSelected() && (
        <p className="warning-message">{t("warning_select_answer")}</p>
      )}

      <div className="navigation-buttons">
        <Button disabled={currentQuestionIndex === 0} onClick={handlePreviousQuestion}>
          {t("previous")}
        </Button>
        <Button
          type="primary"
          onClick={handleNextQuestion}
          disabled={!isAnswerSelected()}
        >
          {currentQuestionIndex === questions.length - 1 ? t("finish") : t("next")}
        </Button>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
        <span className="progress-text">{Math.round(progressPercentage)}%</span>
      </div>
        <div className="img-container-test">
          <img src={human} alt="Test"  className="random-img2"  />
          <img src={pAtoms} alt="Test" className="random-img3"   />
        </div>
        
    </div>
    
  );
};

export default Test;