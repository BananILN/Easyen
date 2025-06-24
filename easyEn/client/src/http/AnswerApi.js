import { $authHost } from "./index";

export const createAnswer = async (answerText, isCorrect, questionId) => {
  try {
    const { data } = await $authHost.post("/api/answer", {
      answerText,
      isCorrect,
      questionId,
    });
    return data;
  } catch (error) {
    console.error("Ошибка при создании ответа:", error);
    throw error;
  }
};

export const fetchAnswersByQuestion = async (questionId) => {
  try {
    const { data } = await $authHost.get(`/api/answer?QuestionID=${questionId}`);
    return data;
  } catch (error) {
    console.error("Ошибка при загрузке ответов:", error);
    throw error;
  }
};

export const updateAnswer = async (answerId, { answerText, isCorrect, questionId }) => {
  try {
    const { data } = await $authHost.put(`api/answer/${answerId}`, { answerText, isCorrect, questionId });
    return data;
  } catch (error) {
    console.error("Ошибка при обновлении ответа:", error);
    throw error;
  }
};

export const deleteAnswer = async (answerId) => {
  try {
    const { data } = await $authHost.delete(`api/answer/${answerId}`);
    return data;
  } catch (error) {
    console.error("Ошибка при удалении ответа:", error);
    throw error;
  }
};