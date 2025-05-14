import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";
import { fetchTestResultsByLesson } from "../http/TestApi";
import Loader from "../components/Loader";
import { Button, Collapse, Card, Divider, Typography, Space } from "antd";
import { LESSON_ROUTE } from "../";
import { UserContext } from "../context/UserContext";

const { Panel } = Collapse;
const { Title, Text } = Typography;

const TestResults = ({ lessonId }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailedResults, setDetailedResults] = useState({});

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true);
        const userId = user?.UserID;
        if (!userId) throw new Error("Пользователь не авторизован");

        if (!lessonId) throw new Error("ID урока не указан");

        const resultsData = await fetchTestResultsByLesson(lessonId, userId);
        setResults(resultsData);
        const detailed = {};
        resultsData.forEach((result) => {
          detailed[result.TestID] = result.detailedResults || [];
        });
        setDetailedResults(detailed);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadResults();
    } else {
      setLoading(false);
      setError("Пользователь не авторизован");
    }
  }, [lessonId, user]);

  const handleBackToLessons = () => {
    navigate(LESSON_ROUTE);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Title level={3} style={{ color: "#ff4d4f" }}>Ошибка</Title>
        <Text>{error}</Text>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div style={{ padding: 24, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Title level={3}>Результаты тестов</Title>
        <Text>Нет результатов для этого урока.</Text>
        <Space style={{ marginTop: 16 }}>
          <Button type="primary" onClick={() => navigate(`/lesson/${lessonId}`)}>
            Вернуться к уроку
          </Button>
          <Button type="default" onClick={handleBackToLessons}>
            К списку уроков
          </Button>
        </Space>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Title level={2} style={{ marginBottom: 24, textAlign: "center" }}>
        Результаты тестов для урока
      </Title>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", maxWidth: 1200 }}>
        {results.map((result, index) => (
          <Card
            key={index}
            title={`Тест ${index + 1}: ${result.Score}%`}
            style={{
              marginBottom: 16,
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              width: "100%",
              maxWidth: 800,
            }}
            styles={{ header: { background: "#f5f5f5", borderRadius: "8px 8px 0 0" } }}
          >
            <Space direction="vertical" style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "left" }}>
              <Text style={{ textAlign: "center" }}>
                <strong>Время выполнения:</strong> {result.timeTaken || "Не указано"} сек
              </Text>
              <Text style={{ textAlign: "center" }}>
                <strong>Время прохождения:</strong>{" "}
                {result.CompletedAt ? new Date(result.CompletedAt).toLocaleString() : "Не указано"}
              </Text>
              <Collapse
                defaultActiveKey={['1']}
                style={{ marginTop: 12, width: "100%" }}
                items={[
                  {
                    key: '1',
                    label: 'Подробные результаты',
                    children: detailedResults[result.TestID]?.map((detail, detailIndex) => (
                      <div key={detailIndex} style={{ marginBottom: 12, width: "100%" }}>
                        <Text strong>Вопрос {detailIndex + 1}:</Text>
                        <Text style={{ display: "block", marginLeft: 8, textAlign: "left" }}>{detail.questionText}</Text>
                        <Text style={{ display: "block", marginLeft: 8, marginTop: 8, textAlign: "left" }}>
                          <strong>Ваши ответы:</strong>{" "}
                          <span
                            style={{
                              color: detail.isCorrect ? "#52c41a" : "#ff4d4f",
                              fontWeight: "bold",
                            }}
                          >
                            {detail.userAnswers.join(", ") || "Нет ответа"}
                          </span>
                        </Text>
                        <Text style={{ display: "block", marginLeft: 8, textAlign: "left" }}>
                          <strong>Правильные ответы:</strong>{" "}
                          <span style={{ color: "#52c41a" }}>
                            {detail.correctAnswers.join(", ")}
                          </span>
                        </Text>
                        <Divider style={{ margin: "12px 0" }} />
                      </div>
                    )) || <Text style={{ textAlign: "center" }}>Детализированные данные недоступны</Text>,
                  },
                ]}
              />
            </Space>
          </Card>
        ))}
      </div>
      <Space style={{ marginTop: 24, display: "flex", justifyContent: "center", width: "100%" }}>
        <Button type="default" onClick={handleBackToLessons}>
          К списку уроков
        </Button>
      </Space>
    </div>
  );
};

export default TestResults;