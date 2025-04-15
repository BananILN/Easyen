import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { fetchTestByLesson, fetchQuestionsByTest, fetchAnswersByQuestion, submitTestResult } from "../http/TestApi";
import Loader from "../components/Loader";
import { Button } from "antd";

const Test = () => {
  const { id: lessonId } = useParams(); 
  const navigate = useNavigate();
  const [test, setTest] = useState(null); 
  const [questions, setQuestions] = useState([]); 
  const [answers, setAnswers] = useState({}); 
  const [selectedAnswers, setSelectedAnswers] = useState({}); 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [score, setScore] = useState(null); 
  const [testNotFound, setTestNotFound] = useState(false); 
  const [results, setResults] = useState([]); 


  useEffect(() => {
    const loadTestData = async () => {
      try {
        setLoading(true);

       
        const testData = await fetchTestByLesson(lessonId);
        if (!testData) {
          setTestNotFound(true); 
          return;
        }
        setTest(testData);

    
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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTestData();
  }, [lessonId]);

 
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
    const currentQuestionId = currentQuestion.QuestionID;
    const userAnswers = selectedAnswers[currentQuestionId] || [];
    return userAnswers.length > 0; 
  };


  const handleNextQuestion = () => {
    if (!isAnswerSelected()) {
      return; 
    }
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

  const calculateScore = () => {
    let correctAnswers = 0;
    const detailedResults = [];

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
    });

    const finalScore = Math.round((correctAnswers / questions.length) * 100); 
    setScore(finalScore);
    setResults(detailedResults); 

   
    const userId = localStorage.getItem('userId');
    if (userId && test) {
      submitTestResult(test.TestID, userId, finalScore);
    }
  };

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (loading) {
    return <div className="loader"><Loader /></div>;
  }

  if (error) {
    return <div className="error">Ошибка: {error}</div>;
  }

  if (testNotFound) {
    return (
      <div className="test-page">
        <h1>Тест не найден</h1>
        <p>Для этого урока тест ещё не создан.</p>
        <Button type="primary" onClick={() => navigate(`/lesson/${lessonId}`)}>
          Вернуться к уроку
        </Button>
      </div>
    );
  }

  if (score !== null) {
    return (
      <div className="test-page">
        <h1>Результат теста</h1>
        <p>Ваш результат: {score}%</p>
        <h2>Подробности ответов:</h2>
        <div className="results-details">
          {results.map((result, index) => (
            <div key={index} className={`result-item ${result.isCorrect ? "correct" : "incorrect"}`}>
              <h3>Вопрос {index + 1}: {result.questionText}</h3>
              <p>
                Ваш ответ: {result.userAnswers.length > 0 ? result.userAnswers.join(", ") : "Не выбрано"}
              </p>
              <p>
                Правильный ответ: {result.correctAnswers.join(", ")}
              </p>
              <p>Статус: {result.isCorrect ? "Правильно" : "Неправильно"}</p>
            </div>
          ))}
        </div>
        <Button type="primary" onClick={() => navigate(`/lesson/${lessonId}`)}>
          Вернуться к уроку
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswers = answers[currentQuestion.QuestionID] || [];

  return (
    <div className="test-page">
      <h1>{test?.title}</h1>
      <div className="question-container">
        <h2>Вопрос {currentQuestionIndex + 1} из {questions.length}</h2>
        <p className="question-text">{currentQuestion.QuestionText}</p>
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
              <input
                type={currentQuestion.IsMultipleChoice ? "checkbox" : "radio"}
                checked={selectedAnswers[currentQuestion.QuestionID]?.includes(answer.AnswerID) || false}
                onChange={() => {}} 
              />
              <span>{answer.AnswerText}</span>
            </div>
          ))}
        </div>
      </div>

      {!isAnswerSelected() && (
        <p className="warning-message">Пожалуйста, выберите хотя бы один ответ, чтобы продолжить.</p>
      )}

      <div className="navigation-buttons">
        <Button
          disabled={currentQuestionIndex === 0}
          onClick={handlePreviousQuestion}
        >
          Назад
        </Button>
        <Button
          type="primary"
          onClick={handleNextQuestion}
          disabled={!isAnswerSelected()} 
        >
          {currentQuestionIndex === questions.length - 1 ? "Завершить" : "Далее"}
        </Button>
      </div>

      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{ width: `${progressPercentage}%` }}
        ></div>
        <span className="progress-text">{Math.round(progressPercentage)}%</span>
      </div>
    </div>
  );
};

export default Test;