import { useEffect, useState, useContext } from 'react';
import { Card, Typography } from 'antd';
import { Column } from '@ant-design/charts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts'; 
import { fetchStatistics } from '../http/StatisticApi';
import { UserContext } from '../context/UserContext';

const { Title } = Typography;

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
      if (userLoading || !user) {
        return;
      }

      try {
        setLoading(true);
        const userId = user.UserID;
        console.log(`Fetching statistics for UserID: ${userId}`);
        
        const data = await fetchStatistics(userId);
        console.log('Исходные данные статистики:', data.map(item => ({
          TestID: item.TestID,
          timeTaken: item.timeTaken,
          type: typeof item.timeTaken,
          LessonID: item.LessonID,
          lessonTitle: item.lessonTitle,
          detailedResults: item.detailedResults, 
        })));
        setStatistics(data);
      } catch (err) {
        setError(err.message);
        console.error('Ошибка при получении данных:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, userLoading]);

  if (userLoading || loading) return <div className="loader">Загрузка...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;
  if (!user) return <div className="error">Пользователь не авторизован</div>;

  const testsByLesson = statistics.reduce((acc, result) => {
    const lessonId = result.LessonID;
    if (!lessonId) {
      console.warn(`LessonID отсутствует для TestID ${result.TestID}`);
      return acc;
    }
    if (!acc[lessonId]) {
      acc[lessonId] = [];
    }
    acc[lessonId].push(result);
    return acc;
  }, {});

  const timeChartData = statistics
    .filter(result => {
      const timeTaken = Number(result.timeTaken);
      if (isNaN(timeTaken) || timeTaken < 0) {
        console.warn(`Отфильтровано невалидное значение timeTaken для TestID ${result.TestID}: ${result.timeTaken}`);
        return false;
      }
      return true;
    })
    .map(result => {
      const lessonId = result.LessonID;
      const timeTaken = Math.floor(Number(result.timeTaken) || 0);
      if (!lessonId) {
        return {
          testId: `Тест ${result.TestID}`,
          timeTaken,
        };
      }

      const testsInLesson = testsByLesson[lessonId] || [];
      const testIndex = testsInLesson.findIndex(test => test.TestID === result.TestID) + 1;
      const lessonName = result.lessonTitle || `Урок ${lessonId}`;

      console.log(`Обработано timeTaken для TestID ${result.TestID}: ${timeTaken}, LessonID: ${lessonId}, TestIndex: ${testIndex}`);
      return {
        testId: `Урок: ${lessonName} - Тест ${testIndex}`,
        timeTaken,
      };
    });

  console.log('Данные для графика времени:', timeChartData);

  
  const answerStats = statistics.reduce(
    (acc, result) => {
      if (result.detailedResults && Array.isArray(result.detailedResults)) {
        result.detailedResults.forEach(detail => {
          if (typeof detail.isCorrect === 'boolean') {
            if (detail.isCorrect) {
              acc.correct += 1;
            } else {
              acc.incorrect += 1;
            }
          } else {
            console.warn(`Некорректное значение isCorrect для TestID ${result.TestID}:`, detail);
          }
        });
      } else {
        console.warn(`detailedResults отсутствует или не является массивом для TestID ${result.TestID}`);
      }
      return acc;
    },
    { correct: 0, incorrect: 0 }
  );

  console.log('Статистика ответов:', answerStats); 

  const pieData = [
    { type: 'Правильные', value: answerStats.correct || 0 },
    { type: 'Неправильные', value: answerStats.incorrect || 0 },
  ]; 

  console.log('Данные для круговой диаграммы:', pieData);

  const COLORS = ['#1890ff', '#ff4d4f'];

 
  const userTestCount = statistics.reduce((acc, result) => {
    const username = result.username || `Пользователь ${result.UserID}`;
    acc[username] = (acc[username] || 0) + 1;
    return acc;
  }, {});

  const columnData = Object.entries(userTestCount).map(([username, count]) => ({
    username,
    count,
  }));

  const columnConfig = {
    data: columnData,
    xField: 'username',
    yField: 'count',
    xAxis: {
      label: {
        autoRotate: true,
        style: { fill: 'rgb(196, 195, 195)' },
      },
    },
    yAxis: {
      label: {
        formatter: v => `${v} тестов`,
        style: { fill: 'rgb(196, 195, 195)' },
      },
    },
    columnStyle: { fillOpacity: 0.8 },
    label: {
      position: 'top',
      style: { fill: '#fff', fontFamily: 'Montserrat, sans-serif' },
    },
    height: 200,
  };

  return (
    <div className="stat-page">
      <div className="stat-cont">
        <Title level={2} className="stat-title">
          Статистика по тестам
        </Title>

        <div className="">
          <Card
            title="Время прохождения тестов (сек)"
            className="stat-card"
            styles={{ header: { color: 'rgb(196, 195, 195)', fontFamily: 'Montserrat, sans-serif' } }}
          >
            {timeChartData.length > 0 ? (
              <LineChart
                width={600}
                height={300}
                data={timeChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid stroke="#444" />
                <XAxis dataKey="testId" stroke="rgb(196, 195, 195)" />
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

        <div className="stat-charts">
          <Card
            title="Качество выполнения тестов"
            className="stat-card"
            styles={{ header: { color: 'rgb(196, 195, 195)', fontFamily: 'Montserrat, sans-serif' } }}
          >
            {pieData.some(item => item.value > 0) ? (
              <PieChart width={400} height={200}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  label={renderCustomizedLabel}
                  outerRadius={80}
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

          <Card
            title="Количество выполненных тестов по пользователям"
            className="stat-card"
            styles={{ header: { color: 'rgb(196, 195, 195)', fontFamily: 'Montserrat, sans-serif' } }}
          >
            <Column {...columnConfig} />
          </Card>
        </div>
      </div>
    </div>
  );
}