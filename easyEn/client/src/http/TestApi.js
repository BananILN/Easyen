import { $host, $authHost } from "./index";


export const fetchTestByLesson = async (lessonId) => {
  const { data } = await $host.get(`api/test?LessonID=${lessonId}`);
 
  if (!data || data.length === 0) {
    return null; 
  }
  return data[0]; 
};

export const fetchQuestionsByTest = async (testId) => {
  const { data } = await $host.get(`api/question?TestID=${testId}`);
  return data;
};

export const fetchAnswersByQuestion = async (questionId) => {
  const { data } = await $host.get(`api/answer?QuestionID=${questionId}`);
  return data;
};

export const submitTestResult = async (testId, userId, score) => {
  const { data } = await $authHost.post('api/testResult', {
    TestID: testId,
    UserID: userId,
    Score: score,
  });
  return data;
};