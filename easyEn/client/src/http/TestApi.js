import { $host, $authHost } from "./index";

export const fetchTestByLesson = async (lessonId) => {
  const { data } = await $host.get(`api/test?LessonID=${lessonId}`);
  return data;
};

export const fetchTestById = async (testId) => {
  const { data } = await $host.get(`api/test/${testId}`);
  return data;
};

export const createTest = async (title, LessonID, testType, order) => {
  const { data } = await $authHost.post("api/test", { title, LessonID, testType, order });
  return data;
};

export const fetchQuestionsByTest = async (testId) => {
  const { data } = await $host.get(`api/question?TestID=${testId}`);
  return data;
};

export const fetchAnswersByQuestion = async (questionId) => {
  const { data } = await $host.get(`api/answer?QuestionID=${questionId}`);
  return data;
};

export const submitTestResult = async (testId, userId, score, timeTaken) => {
  try {
    const { data } = await $authHost.post("/api/testResult", {
      Score: score,
      TestID: testId,
      UserID: userId,
      timeTaken,
    });
    return data;
  } catch (error) {
    console.error("Ошибка при сохранении результата:", error);
    throw error;
  }
};

export const saveUserAnswers = async (userAnswers) => {
  try {
    const { data } = await $authHost.post("/api/userAnswer", userAnswers);
    return data;
  } catch (error) {
    console.error("Ошибка при сохранении ответов пользователя:", error);
    throw error;
  }
};

export const fetchUserAnswersByTest = async (testId, userId) => {
  try {
    const response = await $authHost.get(`/api/userAnswer/test/${testId}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Ошибка при загрузке ответов пользователя:", error);
    throw error;
  }
};

export const deleteUserAnswersByTest = async (testId, userId) => {
  try {
    const response = await $authHost.delete(`/api/userAnswer/test/${testId}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Ошибка при удалении ответов пользователя:", error);
    throw error;
  }
};

export const fetchTestResultsByLesson = async (lessonId, userId) => {
  try {
    const { data } = await $authHost.get(`/api/testResult/lesson/${lessonId}/user/${userId}`);
    return data;
  } catch (error) {
    console.error("Ошибка при загрузке результатов:", error);
    throw error;
  }
};

export const saveProgress = async (userId, lessonId, testId, completed) => {
  try {
    const response = await $authHost.post("/api/progress", {
      UserID: userId,
      LessonID: lessonId,
      TestID: testId,
      completed,
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при сохранении прогресса:", error);
    throw error;
  }
};

export const fetchProgress = async (userId, lessonId) => {
  try {
    const response = await $authHost.get(`/api/progress/user/${userId}/lesson/${lessonId}`);
    return response.data;
  } catch (error) {
    console.error("Ошибка при загрузке прогресса:", error);
    throw error;
  }
};

export const updateTest = async (testId, { title, lessonId, testType, order }) => {
  try {
    const { data } = await $authHost.put(`api/test/${testId}`, { title, LessonID: lessonId, testType, order });
    return data;
  } catch (error) {
    console.error("Ошибка при обновлении теста:", error);
    throw error;
  }
};

export const deleteTest = async (testId) => {
  const { data } = await $authHost.delete(`api/test/${testId}`);
  return data;
};

export const fetchOneLesson = async (id) => {
  try {
    const response = await $host.get(`api/lesson/${id}`);
    if (response.status !== 200) {
      throw new Error(`Ошибка ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error("Ошибка запроса:", {
      url: error.config.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};