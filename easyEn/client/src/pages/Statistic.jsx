import { useEffect, useState, useContext } from 'react';
import { Card, Typography, Avatar } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { fetchStatistics } from '../http/StatisticApi';
import { UserContext } from '../context/UserContext';
import book from '../assets/bookks.png';

const { Title, Text } = Typography;

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, type }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="rgb(196, 195, 195)"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontFamily="Montserrat, sans-serif"
      fontSize={12}
    >
      {`${type} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function Statistic() {
  const { user, loading: userLoading } = useContext(UserContext);
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (userLoading || !user) return;

      try {
        setLoading(true);
        const userId = user.UserID;
        const data = await fetchStatistics(userId);
        setStatistics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, userLoading]);

  if (userLoading || loading) return <div className="loader">Загрузка...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;
  if (!user) return <div className="error">Пользователь не авторизован</div>;


  const completedLessons = new Set(statistics.map(result => result.LessonID)).size;

  const totalAnswers = statistics.reduce((acc, result) => {
    if (result.detailedResults && Array.isArray(result.detailedResults)) {
      return acc + result.detailedResults.length;
    }
    return acc;
  }, 0);
  const correctAnswers = statistics.reduce((acc, result) => {
    if (result.detailedResults && Array.isArray(result.detailedResults)) {
      return acc + result.detailedResults.filter(detail => detail.isCorrect).length;
    }
    return acc;
  }, 0);
  const accuracyPercentage = totalAnswers > 0 ? ((correctAnswers / totalAnswers) * 100).toFixed(2) : 0;

  
  const timeChartData = statistics
    .filter(result => {
      const timeTaken = Number(result.timeTaken);
      return !isNaN(timeTaken) && timeTaken >= 0;
    })
    .map(result => {
      const lessonId = result.LessonID;
      const timeTaken = Math.floor(Number(result.timeTaken) || 0);
      const testsInLesson = statistics.filter(test => test.LessonID === lessonId);
      const testIndex = testsInLesson.findIndex(test => test.TestID === result.TestID) + 1;
      const lessonName = result.lessonTitle || `Урок ${lessonId}`;
      return {
        testId: `Урок: ${lessonName} - Тест ${testIndex}`,
        timeTaken,
      };
    });


  const answerStats = statistics.reduce(
    (acc, result) => {
      if (result.detailedResults && Array.isArray(result.detailedResults)) {
        result.detailedResults.forEach(detail => {
          if (typeof detail.isCorrect === 'boolean') {
            if (detail.isCorrect) acc.correct += 1;
            else acc.incorrect += 1;
          }
        });
      }
      return acc;
    },
    { correct: 0, incorrect: 0 }
  );
  const pieData = [
    { type: 'Правильные', value: answerStats.correct || 0 },
    { type: 'Неправильные', value: answerStats.incorrect || 0 },
  ];

  const COLORS = ['#1890ff', '#ff4d4f'];


  const avatarUrl = user.img
    ? `${import.meta.env.VITE_API_URL}/static/${user.img}?t=${Date.now()}`
    : '/src/assets/user.svg';

  return (
    <div className="stat-page">
      <div className="stat-container">
   
        <div className="left-section">
          <div className="user-info-block">
            <Card
              className="stat-info-card"
              styles={{
                body: { padding: '40px', textAlign: 'center' },
                header: { background: 'var(--card-background)', color: 'var(--text-light)' },
              }}
            >
              <Avatar
                size={150}
                src={avatarUrl}
                onError={(e) => {
                  console.error('Image load failed, falling back to placeholder:', avatarUrl);
                  e.target.src = '/src/assets/user.svg'; 
                }}
                style={{ marginBottom: '10px', border: '3px solid var(--hover-color)' }}
              />
              <Title level={3} style={{ color: 'var(--text-light)', margin: 0 }}>
                {user.username || `Пользователь`}
              </Title>
              <div style={{ marginTop: '10px' }}>
                <Title level={1} style={{ color: '#000000', fontWeight: 'bold', margin: 0 }}>
                  {completedLessons}
                </Title>
                <Text style={{ color: 'var(--color)', fontSize: '1.2rem' }}>Пройденных уроков</Text>
              </div>
              <div style={{ marginTop: '10px' }}>
                <Title level={1} style={{ color: '#000000', fontWeight: 'bold', margin: 0 }}>
                  {accuracyPercentage}%
                </Title>
                <Text style={{ color: 'var(--color)', fontSize: '1.2rem' }}>Правильных ответов</Text>
              </div>
            </Card>
          </div>
          <div className="women-img">
            <img src={book} alt="Women"  />
          </div>
        </div>

      
        <div className="charts-block">
          <div className="chart-container">
            <Card
              title="Время прохождения тестов (сек)"
              className="stat-card"
              styles={{ header: { color: 'rgb(196, 195, 195)', fontFamily: 'Montserrat, sans-serif' } }}
            >
              {timeChartData.length > 0 ? (
                <LineChart
                  width={800}
                  height={350}
                  data={timeChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid stroke="#444" />
                  <XAxis dataKey="testId" stroke="rgb(196, 195, 195)" angle={-45} textAnchor="end" height={80} />
                  <YAxis
                    stroke="rgb(196, 195, 195)"
                    tickFormatter={v => `${Math.floor(Number(v))} сек`}
                    domain={[0, 'auto']}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} сек`, 'Время']}
                    contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #444', color: 'rgb(196, 195, 195)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="timeTaken"
                    name="Время"
                    stroke="#1890ff"
                    strokeWidth={2}
                    dot={{ r: 5, fill: '#1890ff', stroke: '#fff' }}
                  />
                </LineChart>
              ) : (
                <div className="no-data">Нет данных о времени прохождения тестов</div>
              )}
            </Card>
          </div>
          <div className="chart-container">
            <Card
              title="Качество выполнения тестов"
              className="stat-card"
              styles={{ header: { color: 'rgb(196, 195, 195)', fontFamily: 'Montserrat, sans-serif' } }}
            >
              {pieData.some(item => item.value > 0) ? (
                <PieChart width={400} height={250}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    label={renderCustomizedLabel}
                    labelLine={false}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} ответов`, name]}
                    contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #444', color: 'rgb(196, 195, 195)' }}
                  />
                </PieChart>
              ) : (
                <div className="no-data">Нет данных о результатах тестов</div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}