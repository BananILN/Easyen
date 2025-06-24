import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Button, Input, message, Form, Select, Space } from "antd";
import { updateTest, fetchOneLesson, fetchTestByLesson } from "../http/TestApi";
import { createQuestion, fetchQuestionsByTest, updateQuestion, deleteQuestion } from "../http/QuestionApi";
import { createAnswer, fetchAnswersByQuestion, updateAnswer, deleteAnswer } from "../http/AnswerApi";

const { Option } = Select;

const ModalTestEdit = ({ open, onClose, test, onTestUpdated, selectedSection, selectedLesson }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [availableOrders, setAvailableOrders] = useState([]);

  useEffect(() => {
    if (open && test && selectedLesson) {
      loadTestData();
    }
  }, [open, test, selectedLesson]);

  const loadTestData = async () => {
    setLoading(true);
    try {
      const questionsData = await fetchQuestionsByTest(test.TestID);
      setQuestions(questionsData);

      const answersData = {};
      for (const question of questionsData) {
        const answersForQuestion = await fetchAnswersByQuestion(question.QuestionID);
        answersData[question.QuestionID] = answersForQuestion;
      }
      setAnswers(answersData);

      const sectionCount = selectedLesson?.sections?.length || 0;
      const available = Array.from({ length: sectionCount }, (_, i) => i + 1);
      setAvailableOrders(available);

      form.setFieldsValue({
        title: test.title,
        testType: test.testType,
        order: test.order,
        lessonId: selectedLesson?.LessonID || test.LessonID,
      });
      console.log("Загружены данные теста для ID:", test.TestID, "Порядок:", test.order, "LessonID:", test.LessonID);
    } catch (error) {
      console.error("Ошибка загрузки данных теста:", error);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (!test || !test.TestID) {
        throw new Error(t("test_not_selected"));
      }

      let validLessonId = test.LessonID;
      if (selectedLesson?.LessonID) {
        try {
          const lesson = await fetchOneLesson(selectedLesson.LessonID);
          if (lesson) validLessonId = selectedLesson.LessonID;
        } catch (lessonError) {
          console.warn("Урок не найден, используется существующий LessonID:", test.LessonID);
        }
      }

      const updatedData = {
        title: values.title,
        lessonId: validLessonId,
        testType: values.testType,
        order: parseInt(values.order, 10),
      };
      console.log("Обновление теста с ID:", test.TestID, "Данные:", updatedData);

      const response = await updateTest(test.TestID, updatedData);
      if (response && !response.error) {
        // Обновляем вопросы и ответы
        for (const question of questions) {
          if (question.QuestionID) {
            await updateQuestion(question.QuestionID, {
              questionText: question.QuestionText,
              isMultipleChoice: question.IsMultipleChoice,
              testId: test.TestID,
            });
            const existingAnswers = answers[question.QuestionID] || [];
            for (const answer of existingAnswers) {
              await updateAnswer(answer.AnswerID, {
                answerText: answer.AnswerText,
                isCorrect: answer.IsCorrect,
                questionId: question.QuestionID,
              });
            }
          }
        }
        message.success(t("test_updated_successfully"));
        onTestUpdated();
        onClose();
      } else {
        throw new Error(t("test_update_failed"));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || t("unknown_error");
      message.error(`${t("test_update_error")}: ${errorMessage}`);
      console.error("Ошибка обновления теста:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async () => {
    try {
      const newQuestion = await createQuestion(t("new_question"), false, test.TestID);
      setQuestions([...questions, newQuestion]);
      const newAnswers = await fetchAnswersByQuestion(newQuestion.QuestionID);
      setAnswers({ ...answers, [newQuestion.QuestionID]: newAnswers });
    } catch (error) {
      console.error("Ошибка добавления вопроса:", error);
    }
  };

  const handleUpdateQuestion = async (questionId, values) => {
    try {
      const updatedQuestions = questions.map((q) =>
        q.QuestionID === questionId ? { ...q, QuestionText: values.questionText, IsMultipleChoice: values.isMultipleChoice } : q
      );
      setQuestions(updatedQuestions);
      await updateQuestion(questionId, {
        questionText: values.questionText,
        isMultipleChoice: values.isMultipleChoice,
        testId: test.TestID,
      });
    } catch (error) {
      console.error("Ошибка обновления вопроса:", error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await deleteQuestion(questionId);
      setQuestions(questions.filter((q) => q.QuestionID !== questionId));
      const newAnswers = { ...answers };
      delete newAnswers[questionId];
      setAnswers(newAnswers);
    } catch (error) {
      console.error("Ошибка удаления вопроса:", error);
    }
  };

  const handleAddAnswer = async (questionId) => {
    try {
      const newAnswer = await createAnswer(t("new_answer"), false, questionId);
      setAnswers({
        ...answers,
        [questionId]: [...(answers[questionId] || []), newAnswer],
      });
    } catch (error) {
      console.error("Ошибка добавления ответа:", error);
    }
  };

  const handleUpdateAnswer = async (answerId, values) => {
    try {
      const updatedAnswers = {};
      for (const qId in answers) {
        updatedAnswers[qId] = answers[qId].map((a) =>
          a.AnswerID === answerId ? { ...a, AnswerText: values.answerText, IsCorrect: values.isCorrect } : a
        );
      }
      setAnswers(updatedAnswers);
      await updateAnswer(answerId, {
        answerText: values.answerText,
        isCorrect: values.isCorrect,
        questionId: values.questionId,
      });
    } catch (error) {
      console.error("Ошибка обновления ответа:", error);
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    try {
      await deleteAnswer(answerId);
      const newAnswers = {};
      for (const qId in answers) {
        newAnswers[qId] = answers[qId].filter((a) => a.AnswerID !== answerId);
      }
      setAnswers(newAnswers);
    } catch (error) {
      console.error("Ошибка удаления ответа:", error);
    }
  };

  return (
    <Modal
      open={open}
      title={t("edit_test")}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          {t("cancel")}
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()} loading={loading}>
          {t("save")}
        </Button>,
      ]}
      className="modal-main"
      width={700}
      style={{ maxHeight: "90vh", overflowY: "auto" }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="title"
          label={t("test_title")}
          rules={[{ required: true, message: t("please_input_test_title") }]}
        >
          <Input placeholder={t("enter_test_title")} />
        </Form.Item>
        <Form.Item
          name="testType"
          label={t("test_type")}
          rules={[{ required: true, message: t("please_select_test_type") }]}
        >
          <Select placeholder={t("select_test_type")}>
            <Option value="regular">{t("regular_test")}</Option>
            <Option value="classic">{t("classic_test")}</Option>
            <Option value="trueFalse">{t("true_false_test")}</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="order"
          label={t("test_order")}
          rules={[{ required: true, type: "number", message: t("please_select_test_order") }]}
        >
          <Select placeholder={t("select_order")}>
            {availableOrders.map((order) => (
              <Option key={order} value={order}>
                {t("position")} {order}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <h3>{t("questions")}</h3>
        {questions.map((question, qIndex) => (
          <div
            key={question.QuestionID || qIndex}
            style={{
              border: "1px solid var(--border-color)",
              padding: "16px",
              marginBottom: "16px",
              borderRadius: "8px",
            }}
          >
            <Form.Item label={`${t("question")} ${qIndex + 1}`}>
              <Input
                value={question.QuestionText || ""}
                onChange={(e) =>
                  handleUpdateQuestion(question.QuestionID, {
                    questionText: e.target.value,
                    isMultipleChoice: question.IsMultipleChoice,
                    testId: test.TestID,
                  })
                }
                placeholder={t("enter_question_text")}
              />
            </Form.Item>

            <Form.Item label={t("is_multiple_choice")}>
              <Select
                value={question.IsMultipleChoice}
                onChange={(value) =>
                  handleUpdateQuestion(question.QuestionID, {
                    questionText: question.QuestionText,
                    isMultipleChoice: value,
                    testId: test.TestID,
                  })
                }
              >
                <Option value={true}>{t("yes")}</Option>
                <Option value={false}>{t("no")}</Option>
              </Select>
            </Form.Item>

            <h4>{t("answers")}</h4>
            {answers[question.QuestionID]?.map((answer, aIndex) => (
              <Space
                key={answer.AnswerID}
                style={{ display: "flex", marginBottom: "8px", alignItems: "center" }}
              >
                <Input
                  value={answer.AnswerText || ""}
                  onChange={(e) =>
                    handleUpdateAnswer(answer.AnswerID, {
                      answerText: e.target.value,
                      isCorrect: answer.IsCorrect,
                      questionId: question.QuestionID,
                    })
                  }
                  placeholder={t("enter_answer_text")}
                  style={{ width: "300px" }}
                />
                <Select
                  value={answer.IsCorrect}
                  onChange={(value) =>
                    handleUpdateAnswer(answer.AnswerID, {
                      answerText: answer.AnswerText,
                      isCorrect: value,
                      questionId: question.QuestionID,
                    })
                  }
                  style={{ width: "120px" }}
                >
                  <Option value={true}>{t("correct")}</Option>
                  <Option value={false}>{t("incorrect")}</Option>
                </Select>
                <Button
                  type="danger"
                  onClick={() => handleDeleteAnswer(answer.AnswerID)}
                  disabled={answers[question.QuestionID]?.length === 1}
                >
                  {t("remove_answer")}
                </Button>
              </Space>
            ))}

            <Button type="dashed" onClick={() => handleAddAnswer(question.QuestionID)} style={{ marginTop: "8px" }}>
              {t("add_answer")}
            </Button>

            <Button
              type="danger"
              onClick={() => handleDeleteQuestion(question.QuestionID)}
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
      </Form>
    </Modal>
  );
};

export default ModalTestEdit;