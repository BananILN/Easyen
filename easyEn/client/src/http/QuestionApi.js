import { $authHost } from "./index";

export const createQuestion = async (questionText, isMultipleChoice, testId) => {
  try {
    const { data } = await $authHost.post("/api/question", {
      questionText,
      isMultipleChoice,
      testID: testId,
    });
    return data;
  } catch (error) {
    console.error("Ошибка при создании вопроса:", error);
    throw error;
  }
};

export const fetchQuestionsByTest = async (testId) => {
  try {
    const { data } = await $authHost.get(`/api/question?TestID=${testId}`);
    return data;
  } catch (error) {
    console.error("Ошибка при загрузке вопросов:", error);
    throw error;
  }
};

export const updateQuestion = async (questionId, { questionText, isMultipleChoice, testId }) => {
    const { data } = await $authHost.put(`/api/question/${questionId}`, { questionText, isMultipleChoice, testID: testId });
    return data;
};

export const deleteQuestion = async (questionId) => {
    const { data } = await $authHost.delete(`/api/question/${questionId}`);
    return data;
};