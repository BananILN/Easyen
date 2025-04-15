// Test.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { fetchTestByLesson, fetchQuestionsByTest, fetchAnswersByQuestion, submitTestResult } from "../http/TestApi";
import Loader from "../components/Loader";
import { Button } from "antd";

const Test = () => {
  const { id: lessonId } = useParams(); // ID урока из URL
  const navigate = useNavigate();
  const [test, setTest] = useState(null); // Состояние для теста
  const [questions, setQuestions] = useState([]); // Состояние для вопросов
  const [answers, setAnswers] = useState({}); // Храним ответы: { QuestionID: [AnswerID, ...] }
  const [selectedAnswers, setSelectedAnswers] = useState({}); // Храним выбранные ответы: { QuestionID: [AnswerID, ...] }
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Индекс текущего вопроса
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [error, setError] = useState(null); // Состояние ошибки
  const [score, setScore] = useState(null); // Результат теста в процентах
  const [testNotFound, setTestNotFound] = useState(false); // Состояние для случая, когда тест не найден
  const [results, setResults] = useState([]); // Состояние для хранения результатов по каждому вопросу

  // Загрузка теста, вопросов и ответов
  useEffect(() => {
    const loadTestData = async () => {
      try {
        setLoading(true);

        // 1. Получаем тест по LessonID
        const testData = await fetchTestByLesson(lessonId);
        if (!testData) {
          setTestNotFound(true); // Если тест не найден, устанавливаем флаг
          return;
        }
        setTest(testData);

        // 2. Получаем вопросы по TestID
        const questionsData = await fetchQuestionsByTest(testData.TestID);
        if (questionsData.length === 0) {
          throw new Error("Вопросы для теста не найдены");
        }
        // Ограничиваем до 15 вопросов
        const limitedQuestions = questionsData.slice(0, 15);
        setQuestions(limitedQuestions);

        // 3. Получаем ответы для каждого вопроса и инициализируем selectedAnswers
        const answersData = {};
        const initialSelectedAnswers = {};
        for (const question of limitedQuestions) {
          const questionAnswers = await fetchAnswersByQuestion(question.QuestionID);
          answersData[question.QuestionID] = questionAnswers;
          initialSelectedAnswers[question.QuestionID] = []; // Инициализируем пустой массив для каждого вопроса
        }
        setAnswers(answersData);
        setSelectedAnswers(initialSelectedAnswers); // Устанавливаем начальные выбранные ответы
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTestData();
  }, [lessonId]);

  // Обработка выбора ответа
  const handleAnswerSelect = (questionId, answerId, isMultipleChoice) => {
    setSelectedAnswers((prev) => {
      const currentSelection = prev[questionId] || [];
      if (isMultipleChoice) {
        // Для множественного выбора
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
        // Для одиночного выбора
        return {
          ...prev,
          [questionId]: [answerId],
        };
      }
    });
  };

  // Проверка, выбран ли хотя бы один ответ для текущего вопроса
  const isAnswerSelected = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const currentQuestionId = currentQuestion.QuestionID;
    const userAnswers = selectedAnswers[currentQuestionId] || [];
    return userAnswers.length > 0; // Возвращает true, если выбран хотя бы один ответ
  };

  // Переход к следующему вопросу
  const handleNextQuestion = () => {
    if (!isAnswerSelected()) {
      return; // Не переходим к следующему вопросу, если ответ не выбран
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Завершение теста
      calculateScore();
    }
  };

  // Переход к предыдущему вопросу
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Подсчёт результата и создание детализированных результатов
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

      // Собираем информацию о вопросе и ответах
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

    const finalScore = Math.round((correctAnswers / questions.length) * 100); // Процент правильных ответов
    setScore(finalScore);
    setResults(detailedResults); // Сохраняем детализированные результаты

    // Отправка результата на сервер
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
                onChange={() => {}} // Пустой onChange для предотвращения предупреждения React
              />
              <span>{answer.AnswerText}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Сообщение, если ответ не выбран */}
      {!isAnswerSelected() && (
        <p className="warning-message">Пожалуйста, выберите хотя бы один ответ, чтобы продолжить.</p>
      )}

      {/* Навигация */}
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
          disabled={!isAnswerSelected()} // Кнопка заблокирована, если ответ не выбран
        >
          {currentQuestionIndex === questions.length - 1 ? "Завершить" : "Далее"}
        </Button>
      </div>

      {/* Прогресс-бар */}
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