import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";
import { fetchTestResultsByLesson, fetchUserAnswersByTest } from "../http/TestApi";
import Loader from "../components/Loader";
import { Button, Collapse, Card, Divider, Typography, Space } from "antd";
import { LESSON_ROUTE } from "../";
import { UserContext } from "../context/UserContext";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Buffer } from 'buffer';

console.log('Buffer доступен:', Buffer);

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Typography.Text type="danger">
            Не удалось сгенерировать PDF: {this.state.error?.message || 'Неизвестная ошибка'}
          </Typography.Text>
        </div>
      );
    }
    return this.props.children;
  }
}

import robotoRegular from '../assets/fonts/Roboto-Regular.ttf';
import robotoItalic from '../assets/fonts/Roboto-Italic.ttf';
import robotoBold from '../assets/fonts/Roboto-Bold.ttf';
import montserratRegular from '../assets/fonts/Montserrat-Regular.ttf';
import montserratBold from '../assets/fonts/Montserrat-Bold.ttf';

Font.register({
  family: 'Roboto',
  fonts: [
    { src: robotoRegular, fontWeight: 400, fontStyle: 'normal' },
    { src: robotoItalic, fontWeight: 400, fontStyle: 'italic' },
    { src: robotoBold, fontWeight: 700, fontStyle: 'normal' },
  ],
});
Font.register({
  family: 'Montserrat',
  fonts: [
    { src: montserratRegular, fontWeight: 400 },
    { src: montserratBold, fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Roboto', fontSize: 10, color: '#333', backgroundColor: '#fff' },
  headerSection: { padding: 15, borderRadius: 5, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  header: { fontSize: 20, fontWeight: 700, color: '#1e3a8a', fontFamily: 'Montserrat' },
  userImage: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#fff' },
  subheader: { fontSize: 12, fontStyle: 'italic', margin: 4, color: '#4b5563' },
  table: { marginTop: 15, display: 'table', width: '100%', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 4 },
  tableRow: { flexDirection: 'row', padding: 8 },
  tableRowAlternate: { backgroundColor: '#f9fafb' },
  tableCell: { width: '25%', textAlign: 'left', padding: 3 },
  tableHeader: { backgroundColor: '#e0e7ff', fontWeight: 700, fontFamily: 'Montserrat', color: '#1e3a8a', padding: 8 },
  correct: { color: '#15803d', fontWeight: 700 },
  incorrect: { color: '#b91c1c', fontWeight: 700 },
  section: { margin: 10 },
  list: { marginLeft: 20, marginBottom: 10 },
  footer: { position: 'absolute', bottom: 20, left: 30, right: 30, textAlign: 'center', fontSize: 8, color: '#6b7280', borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 5 },
});

const PDFDocument = ({ lessonId, user, results, detailedResults, userImage }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.headerSection}>
        <Text style={styles.header}>Результаты тестов для урока {lessonId}</Text>
        {userImage && <Image src={userImage} style={styles.userImage} />}
      </View>
      <View>
        <Text style={styles.subheader}>Имя: {user?.username || 'Неизвестно'}</Text>
        <Text style={styles.subheader}>Email: {user?.email || 'Не указан'}</Text>
        <Text style={styles.subheader}>Дата: {new Date().toLocaleString()}</Text>
      </View>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Тест</Text>
          <Text style={styles.tableCell}>Счет</Text>
          <Text style={styles.tableCell}>Время</Text>
          <Text style={styles.tableCell}>Дата</Text>
        </View>
        {results.map((result, index) => (
          <View key={index} style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlternate]}>
            <Text style={styles.tableCell}>Тест {index + 1}</Text>
            <Text style={styles.tableCell}>{result.Score}%</Text>
            <Text style={styles.tableCell}>{result.timeTaken || 'Не указано'} сек</Text>
            <Text style={styles.tableCell}>
              {result.CompletedAt ? new Date(result.CompletedAt).toLocaleString() : 'Не указано'}
            </Text>
          </View>
        ))}
      </View>
      {results.map((result, index) => (
        detailedResults[result.TestID]?.length > 0 && (
          <View key={index} style={styles.section}>
            <Text style={[styles.subheader, { fontStyle: 'normal', fontWeight: 700, color: '#1e3a8a' }]}>
              Подробные результаты теста {index + 1}
            </Text>
            {detailedResults[result.TestID].map((detail, detailIndex) => (
              <View key={detailIndex} style={styles.list}>
                <Text style={{ fontWeight: 700 }}>Вопрос {detailIndex + 1}: {detail.questionText}</Text>
                <Text style={detail.isCorrect ? styles.correct : styles.incorrect}>
                  Мои ответы: {detail.userAnswers.join(', ') || 'Нет ответа'}
                </Text>
                <Text style={styles.correct}>
                  Правильные ответы: {detail.correctAnswers.join(', ')}
                </Text>
              </View>
            ))}
          </View>
        )
      ))}
      <Text style={styles.footer} fixed>
        Сгенерировано: {new Date().toLocaleString()}
      </Text>
    </Page>
  </Document>
);

const TestResults = ({ lessonId }) => {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useContext(UserContext);
  const [results, setResults] = useState([]);
  const [componentLoading, setComponentLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailedResults, setDetailedResults] = useState({});
  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    const loadResults = async () => {
      try {
        setComponentLoading(true);
        const userId = user?.UserID;
        if (!userId) throw new Error("Пользователь не авторизован");

        if (!lessonId) throw new Error("ID урока не указан");

        const resultsData = await fetchTestResultsByLesson(lessonId, userId);
        setResults(resultsData);

        
        const detailed = {};
        for (const result of resultsData) {
          const userAnswers = await fetchUserAnswersByTest(result.TestID, userId);
          const questionsData = await fetchQuestionsByTest(result.TestID); 
          const answersData = {}; 
          for (const question of questionsData) {
            const questionAnswers = await fetchAnswersByQuestion(question.QuestionID);
            answersData[question.QuestionID] = questionAnswers;
          }

        
          const detailedForTest = questionsData.map((question) => {
            const userAnswerRecords = userAnswers.filter((ua) => ua.QuestionID === question.QuestionID);
            const userAnswerIds = userAnswerRecords.map((ua) => ua.AnswerID);
            const correctAnswerIds = answersData[question.QuestionID].filter((a) => a.IsCorrect).map((a) => a.AnswerID);
            const userAnswerTexts = userAnswerIds.map((answerId) =>
              answersData[question.QuestionID].find((ans) => ans.AnswerID === answerId)?.AnswerText || 'Нет ответа'
            );
            const correctAnswerTexts = correctAnswerIds.map((answerId) =>
              answersData[question.QuestionID].find((ans) => ans.AnswerID === answerId)?.AnswerText
            );
            const isCorrect = userAnswerIds.length > 0 && correctAnswerIds.some((id) => userAnswerIds.includes(id));

            return {
              questionText: question.QuestionText,
              userAnswers: userAnswerTexts,
              correctAnswers: correctAnswerTexts,
              isCorrect,
            };
          });
          detailed[result.TestID] = detailedForTest;
        }
        setDetailedResults(detailed);

        if (user?.img) {
          const imageUrl = `/static/${user.img}`;
          try {
            const response = await fetch(imageUrl, { mode: 'cors' });
            if (!response.ok) throw new Error(`Не удалось загрузить изображение: ${response.statusText}`);
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onloadend = () => {
              if (typeof reader.result === 'string' && reader.result.startsWith('data:image/')) {
                setUserImage(reader.result);
              } else {
                setUserImage(null);
              }
            };
            reader.onerror = () => setUserImage(null);
            reader.readAsDataURL(blob);
          } catch (imgError) {
            setUserImage(null);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setComponentLoading(false);
      }
    };

    if (!userLoading && user) loadResults();
  }, [lessonId, user, userLoading]);

  const handleBackToLessons = () => {
    navigate(LESSON_ROUTE);
  };

  if (componentLoading || userLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Typography.Title level={3} style={{ color: "#ff4d4f" }}>Ошибка</Typography.Title>
        <Typography.Text>{error}</Typography.Text>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div style={{ padding: 24, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Typography.Title level={3}>Результаты тестов</Typography.Title>
        <Typography.Text>Нет результатов для этого урока.</Typography.Text>
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
      <Typography.Title level={2} style={{ marginBottom: 24, textAlign: "center" }}>
        Результаты тестов для урока
      </Typography.Title>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", maxWidth: 1200 }}>
        {results.map((result, index) => (
          <Card
            key={index}
            title={`Тест ${index + 1}: ${result.Score}%`}
            style={{ marginBottom: 16, borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", width: "100%", maxWidth: 800 }}
            styles={{ header: { background: "#f5f5f5", borderRadius: "8px 8px 0 0" } }}
          >
            <Space direction="vertical" style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "left" }}>
              <Typography.Text>
                <strong>Пользователь:</strong> {user?.username || 'Неизвестно'}
              </Typography.Text>
              <Typography.Text style={{ textAlign: "center" }}>
                <strong>Время выполнения:</strong> {result.timeTaken || "Не указано"} сек
              </Typography.Text>
              <Typography.Text style={{ textAlign: "center" }}>
                <strong>Время прохождения:</strong>{" "}
                {result.CompletedAt ? new Date(result.CompletedAt).toLocaleString() : "Не указано"}
              </Typography.Text>
              <Collapse
                defaultActiveKey={['1']}
                style={{ marginTop: 12, width: "100%" }}
                items={[
                  {
                    key: '1',
                    label: 'Подробные результаты',
                    children: detailedResults[result.TestID]?.map((detail, detailIndex) => (
                      <div key={detailIndex} style={{ marginBottom: 12, width: "100%" }}>
                        <Typography.Text strong>
                          Вопрос {detailIndex + 1}:
                        </Typography.Text>
                        <Typography.Text style={{ display: "block", marginLeft: 8, textAlign: "left" }}>
                          {detail.questionText}
                        </Typography.Text>
                        <Typography.Text style={{ display: "block", marginLeft: 8, marginTop: 8, textAlign: "left" }}>
                          <strong>Мои ответы:</strong>{" "}
                          <span style={{ color: detail.isCorrect ? "rgb(34, 139, 34)" : "rgb(139, 0, 0)", fontWeight: "bold" }}>
                            {detail.userAnswers.join(", ") || "Нет ответа"}
                          </span>
                        </Typography.Text>
                        <Typography.Text style={{ display: "block", marginLeft: 8, textAlign: "left" }}>
                          <strong>Правильные ответы:</strong>{" "}
                          <span style={{ color: "rgb(34, 139, 34)" }}>
                            {detail.correctAnswers.join(", ")}
                          </span>
                        </Typography.Text>
                        <Divider style={{ margin: "12px 0" }} />
                      </div>
                    )) || (
                      <Typography.Text style={{ textAlign: "center" }}>
                        Детализированные данные недоступны
                      </Typography.Text>
                    ),
                  },
                ]}
              />
            </Space>
          </Card>
        ))}
      </div>
      <Space style={{ marginTop: 24, display: "flex", justifyContent: "center", width: "100%" }}>
        <ErrorBoundary>
          <PDFDownloadLink
            document={<PDFDocument lessonId={lessonId} user={user} results={results} detailedResults={detailedResults} userImage={userImage} />}
            fileName={`${user?.username || 'User'}-Результаты теста-${lessonId}.pdf`}
            style={{ textDecoration: 'none' }}
          >
            {({ blob, url, loading, error }) => (
              <Button type="primary" disabled={loading}>
                {loading ? 'Генерация PDF...' : 'Скачать результаты в PDF'}
              </Button>
            )}
          </PDFDownloadLink>
        </ErrorBoundary>
        <Button type="default" onClick={handleBackToLessons}>
          К списку уроков
        </Button>
      </Space>
    </div>
  );
};

export default TestResults;