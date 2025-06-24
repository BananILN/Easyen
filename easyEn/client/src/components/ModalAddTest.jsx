import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Form, Input, Select, Button, message, Space } from "antd";
import {
  createTest,
  updateTest,
  deleteTest,
} from "../http/TestApi.js";
import {
  createQuestion,
  fetchQuestionsByTest,
  updateQuestion,
  deleteQuestion,
} from "../http/QuestionApi.js";
import {
  createAnswer,
  fetchAnswersByQuestion,
  updateAnswer,
  deleteAnswer,
} from "../http/AnswerApi.js";

const { Option } = Select;

const ModalTestAdd = ({ open, onClose, onTestCreated, lesson, sectionIndex, testToEdit }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [questions, setQuestions] = useState([{ questionText: "", isMultipleChoice: false, answers: [{ answerText: "", isCorrect: false }] }]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (open) {
      if (testToEdit) {
        setIsEditing(true);
        form.setFieldsValue({
          title: testToEdit.title,
          lessonId: testToEdit.LessonID,
          sectionIndex: testToEdit.order - 1,
          testType: testToEdit.testType,
        });
        loadExistingTestData(testToEdit.TestID);
      } else if (lesson && sectionIndex !== null) {
        setIsEditing(false);
        form.setFieldsValue({
          title: `${lesson.title} - Test ${sectionIndex + 1}`,
          lessonId: lesson.LessonID,
          sectionIndex,
          testType: "regular",
        });
        setQuestions([{ questionText: "", isMultipleChoice: false, answers: [{ answerText: "", isCorrect: false }] }]);
      } else {
        form.resetFields();
        setQuestions([{ questionText: "", isMultipleChoice: false, answers: [{ answerText: "", isCorrect: false }] }]);
      }
    }
  }, [open, lesson, sectionIndex, testToEdit, form]);

  const loadExistingTestData = async (testId) => {
    try {
      setLoading(true);
      console.log(`Загрузка вопросов для теста ID: ${testId}`);
      const questionsData = await fetchQuestionsByTest(testId);
      console.log("Полученные вопросы:", questionsData);
      if (questionsData && questionsData.length > 0) {
        const detailedQuestions = await Promise.all(
          questionsData.map(async (q) => {
            const answers = await fetchAnswersByQuestion(q.QuestionID);
            return {
              questionText: q.QuestionText,
              isMultipleChoice: q.IsMultipleChoice,
              questionId: q.QuestionID,
              answers: answers.map((a) => ({
                answerText: a.AnswerText,
                isCorrect: a.IsCorrect,
                answerId: a.AnswerID,
              })),
            };
          })
        );
        setQuestions(detailedQuestions);
      } else {
        console.warn("Вопросы не найдены для теста ID:", testId);
        setQuestions([{ questionText: "", isMultipleChoice: false, answers: [{ answerText: "", isCorrect: false }] }]);
      }
    } catch (error) {
      console.error("Ошибка загрузки данных теста:", error);
      message.error(t("error_loading_test_data"));
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: "", isMultipleChoice: false, answers: [{ answerText: "", isCorrect: false }] }]);
  };

  const handleAddAnswer = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers.push({ answerText: "", isCorrect: false });
    setQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = async (index) => {
    if (questions.length > 1) {
      const questionToRemove = questions[index];
      if (questionToRemove.questionId) {
        await deleteQuestion(questionToRemove.questionId);
        await Promise.all(
          questionToRemove.answers.map((answer) => answer.answerId && deleteAnswer(answer.answerId))
        );
      }
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    }
  };

  const handleRemoveAnswer = async (questionIndex, answerIndex) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].answers.length > 1) {
      const answerToRemove = updatedQuestions[questionIndex].answers[answerIndex];
      if (answerToRemove.answerId) {
        await deleteAnswer(answerToRemove.answerId);
      }
      updatedQuestions[questionIndex].answers.splice(answerIndex, 1);
      setQuestions(updatedQuestions);
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleAnswerChange = (questionIndex, answerIndex, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers[answerIndex][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const { title, lessonId, testType } = values;
      const order = sectionIndex !== undefined ? parseInt(sectionIndex) + 1 : 1;

      let testResult;
      if (isEditing && testToEdit) {
        testResult = await updateTest(testToEdit.TestID, { title, lessonId, testType, order });
        const existingQuestions = await fetchQuestionsByTest(testToEdit.TestID);
        await Promise.all(
          existingQuestions.map(async (q) => {
            await deleteQuestion(q.QuestionID);
            const answers = await fetchAnswersByQuestion(q.QuestionID);
            await Promise.all(answers.map((a) => deleteAnswer(a.AnswerID)));
          })
        );
        message.success(t("test_updated_successfully"));
      } else {
        testResult = await createTest(title, lessonId, testType, order);
        // Передаем результат без вызова сообщения
        onTestCreated(testResult);
      }

      const testId = testResult.TestID;

      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const { questionText, isMultipleChoice } = question;

        if (testType === "trueFalse" && question.answers.length !== 2) {
          throw new Error(t("true_false_must_have_two_answers"));
        }
        const correctAnswers = question.answers.filter((a) => a.isCorrect);
        if (testType === "trueFalse" && correctAnswers.length !== 1) {
          throw new Error(t("true_false_must_have_one_correct_answer"));
        } else if (!testType === "trueFalse" && !correctAnswers.length) {
          throw new Error(t("at_least_one_correct_answer_required"));
        }

        const newQuestion = question.questionId
          ? await updateQuestion(question.questionId, { questionText, isMultipleChoice, testId })
          : await createQuestion(questionText, isMultipleChoice, testId);
        const questionId = newQuestion.QuestionID || newQuestion.questionId;

        for (let j = 0; j < question.answers.length; j++) {
          const answer = question.answers[j];
          if (answer.answerId) {
            await updateAnswer(answer.answerId, { answerText: answer.answerText, isCorrect: answer.isCorrect, questionId });
          } else {
            await createAnswer(answer.answerText, answer.isCorrect, questionId);
          }
        }
      }

      // Выводим сообщение об успехе только здесь
      if (!isEditing) {
        message.success(t("test_created_success"), 2); // Указываем длительность 2 секунды для ясности
      }
      form.resetFields();
      setQuestions([{ questionText: "", isMultipleChoice: false, answers: [{ answerText: "", isCorrect: false }] }]);
      onClose();
    } catch (error) {
      console.error("Ошибка сохранения теста:", error);
      message.error(error.message || t("error_saving_test"));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTest = async () => {
    if (testToEdit && testToEdit.TestID) {
      setLoading(true);
      try {
        const existingQuestions = await fetchQuestionsByTest(testToEdit.TestID);
        await Promise.all(
          existingQuestions.map(async (q) => {
            await deleteQuestion(q.QuestionID);
            const answers = await fetchAnswersByQuestion(q.QuestionID);
            await Promise.all(answers.map((a) => deleteAnswer(a.AnswerID)));
          })
        );
        await deleteTest(testToEdit.TestID);
        message.success(t("test_deleted_successfully"));
        onTestCreated(null);
        onClose();
      } catch (error) {
        console.error("Ошибка удаления теста:", error);
        message.error(t("error_deleting_test"));
      } finally {
        setLoading(false);
      }
    }
  };

  if (!lesson || sectionIndex === null) return null;

  return (
    <Modal
      open={open}
      title={isEditing ? t("edit_test") : t("add_test")}
      onCancel={onClose}
      footer={null}
      className="modal-main"
      width={700}
      style={{ maxHeight: "90vh", overflowY: "auto" }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="title"
          label={t("test_title")}
          rules={[{ required: true, message: t("please_input_test_title") }]}
        >
          <Input placeholder={t("enter_test_title")} />
        </Form.Item>

        <Form.Item
          name="lessonId"
          label={t("select_lesson")}
          initialValue={lesson.LessonID}
        >
          <Input disabled value={lesson.title} />
        </Form.Item>

        <Form.Item
          name="sectionIndex"
          label={t("select_section")}
          initialValue={sectionIndex}
        >
          <Input disabled value={lesson.sections[sectionIndex]?.title || `Section ${sectionIndex + 1}`} />
        </Form.Item>

        <Form.Item
          name="testType"
          label={t("test_type")}
          rules={[{ required: true, message: t("please_select_test_type") }]}
          initialValue="regular"
        >
          <Select placeholder={t("select_test_type")}>
            <Option value="regular">{t("regular_test")}</Option>
            <Option value="classic">{t("classic_test")}</Option>
            <Option value="trueFalse">{t("true_false_test")}</Option>
          </Select>
        </Form.Item>

        <h3>{t("questions")}</h3>
        {questions.map((question, qIndex) => (
          <div key={qIndex} style={{ border: "1px solid var(--border-color)", padding: "16px", marginBottom: "16px", borderRadius: "8px" }}>
            <Form.Item label={`${t("question")} ${qIndex + 1}`}>
              <Input
                value={question.questionText}
                onChange={(e) => handleQuestionChange(qIndex, "questionText", e.target.value)}
                placeholder={t("enter_question_text")}
              />
            </Form.Item>

            <Form.Item label={t("is_multiple_choice")}>
              <Select
                value={question.isMultipleChoice}
                onChange={(value) => handleQuestionChange(qIndex, "isMultipleChoice", value)}
              >
                <Option value={true}>{t("yes")}</Option>
                <Option value={false}>{t("no")}</Option>
              </Select>
            </Form.Item>

            <h4>{t("answers")}</h4>
            {question.answers.map((answer, aIndex) => (
              <Space key={aIndex} style={{ display: "flex", marginBottom: "8px", alignItems: "center" }}>
                <Input
                  value={answer.answerText}
                  onChange={(e) => handleAnswerChange(qIndex, aIndex, "answerText", e.target.value)}
                  placeholder={t("enter_answer_text")}
                  style={{ width: "300px" }}
                />
                <Select
                  value={answer.isCorrect}
                  onChange={(value) => handleAnswerChange(qIndex, aIndex, "isCorrect", value)}
                  style={{ width: "120px" }}
                >
                  <Option value={true}>{t("correct")}</Option>
                  <Option value={false}>{t("incorrect")}</Option>
                </Select>
                <Button
                  type="danger"
                  onClick={() => handleRemoveAnswer(qIndex, aIndex)}
                  disabled={question.answers.length === 1}
                >
                  {t("remove_answer")}
                </Button>
              </Space>
            ))}

            <Button type="dashed" onClick={() => handleAddAnswer(qIndex)} style={{ marginTop: "8px" }}>
              {t("add_answer")}
            </Button>

            <Button
              type="danger"
              onClick={() => handleRemoveQuestion(qIndex)}
              disabled={questions.length === 1}
              style={{ marginTop: "16px", marginLeft: "8px" }}
            >
              {t("remove_question")}
            </Button>
          </div>
        ))}

        <Button type="dashed" onClick={handleAddQuestion} style={{ marginBottom: "16px" }}>
          {t("add_question")}
        </Button>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEditing ? t("save_changes") : t("create_test")}
            </Button>
            {isEditing && (
              <Button type="danger" onClick={handleDeleteTest} loading={loading}>
                {t("delete_test")}
              </Button>
            )}
            <Button onClick={onClose}>{t("cancel")}</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalTestAdd;