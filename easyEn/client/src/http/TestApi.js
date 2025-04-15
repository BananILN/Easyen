// http/TestApi.js
import { $host, $authHost } from "./index";

// Получение теста по LessonID
export const fetchTestByLesson = async (lessonId) => {
  const { data } = await $host.get(`api/test?LessonID=${lessonId}`);
  // Проверяем, есть ли тест для данного урока
  if (!data || data.length === 0) {
    return null; // Если тест не найден, возвращаем null
  }
  return data[0]; // Возвращаем первый (и единственный) тест для урока
};

// Получение вопросов по TestID
export const fetchQuestionsByTest = async (testId) => {
  const { data } = await $host.get(`api/question?TestID=${testId}`);
  return data;
};

// Получение ответов по QuestionID
export const fetchAnswersByQuestion = async (questionId) => {
  const { data } = await $host.get(`api/answer?QuestionID=${questionId}`);
  return data;
};

// Отправка результатов теста
export const submitTestResult = async (testId, userId, score) => {
  const { data } = await $authHost.post('api/testResult', {
    TestID: testId,
    UserID: userId,
    Score: score,
  });
  return data;
};