import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, useSearchParams, useLocation } from "react-router";
import { fetchOneLesson } from "../http/LessonApi";
import { fetchProgress, saveProgress } from "../http/TestApi";
import Loader from "../components/Loader";
import { Button } from "antd";
import TestResults from "./TestResults";
import { UserContext } from "../context/UserContext";

export default function LessonDetails() {
  const { user } = useContext(UserContext);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(
    parseInt(searchParams.get("currentLessonIndex")) || 0
  );
  const [completedTests, setCompletedTests] = useState([]);
  const [testHistory, setTestHistory] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const loadLesson = async () => {
      try {
        setLoading(true);
        console.log('LessonDetails - ID from useParams:', id);

        if (!id || isNaN(id)) {
          throw new Error(`Неверный ID урока: ${id}`);
        }

        const data = await fetchOneLesson(id);
        console.log("Lesson data in LessonDetails:", data);
        setLesson(data);

        const userId = user?.UserID;
        if (!userId) {
          throw new Error("Пользователь не авторизован");
        }

        const progressData = await fetchProgress(userId, id);
        const savedCompletedTests = progressData
          .filter((progress) => progress.completed && progress.TestID)
          .map((progress) => progress.TestID);
        const savedTestHistory = progressData
          .filter((progress) => progress.TestID)
          .map((progress) => progress.TestID);
        setCompletedTests(savedCompletedTests);
        setTestHistory(savedTestHistory);

        if (isInitialLoad) {
          const nextIndex = savedCompletedTests.length;
          const currentIndexFromParams = parseInt(searchParams.get("currentLessonIndex")) || 0;
          const initialIndex = currentIndexFromParams !== 0 ? currentIndexFromParams : nextIndex;
          if (initialIndex <= (data.sections?.length - 1 || 0)) {
            setCurrentLessonIndex(initialIndex);
            setSearchParams({ currentLessonIndex: initialIndex });
          } else {
            setCurrentLessonIndex(data.sections?.length - 1 || 0);
            setSearchParams({ currentLessonIndex: data.sections?.length - 1 || 0 });
          }
          setIsInitialLoad(false);
        }
      } catch (err) {
        console.error('LessonDetails - Ошибка загрузки урока:', err);
        setError(err.message || 'Ошибка загрузки урока');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadLesson();
    } else {
      setLoading(false);
      setError("Пользователь не авторизован");
    }
  }, [id, setSearchParams, user]);

  useEffect(() => {
    const currentIndexFromParams = parseInt(searchParams.get("currentLessonIndex")) || 0;
    if (currentIndexFromParams !== currentLessonIndex && currentIndexFromParams < (lesson?.sections?.length || 0)) {
      setCurrentLessonIndex(currentIndexFromParams);
    } else if (currentIndexFromParams >= (lesson?.sections?.length || 0)) {
      setCurrentLessonIndex(lesson?.sections?.length - 1 || 0);
      setSearchParams({ currentLessonIndex: lesson?.sections?.length - 1 || 0 });
    }
  }, [searchParams, lesson, setSearchParams]);

  const handleTestComplete = async (testId) => {
    const userId = user?.UserID;
    if (!userId) return;

    const updatedCompletedTests = [...completedTests, testId];
    const updatedTestHistory = [...testHistory, testId];
    setCompletedTests(updatedCompletedTests);
    setTestHistory(updatedTestHistory);

    await saveProgress(userId, id, testId, true);

    const nextIndex = updatedCompletedTests.length;
    if (nextIndex < (lesson.tests?.length || 0)) {
      setCurrentLessonIndex(nextIndex);
      setSearchParams({ currentLessonIndex: nextIndex });
    } else {
      setShowResults(true);
    }
  };

  const handleStartTest = (testId) => {
    navigate(`/test/${testId}`);
  };

  const handleRetakeTest = async (testId) => {
    const userId = user?.UserID;
    if (!userId) return;

    await saveProgress(userId, id, testId, false);

    const progressData = await fetchProgress(userId, id);
    const savedCompletedTests = progressData
      .filter((progress) => progress.completed && progress.TestID)
      .map((progress) => progress.TestID);
    const savedTestHistory = progressData
      .filter((progress) => progress.TestID)
      .map((progress) => progress.TestID);
    setCompletedTests(savedCompletedTests);
    setTestHistory(savedTestHistory);

    const testIndex = lesson.tests.findIndex((test) => test.TestID === testId);
    if (testIndex >= 0) {
      setCurrentLessonIndex(testIndex);
      setSearchParams({ currentLessonIndex: testIndex });
    }

    navigate(`/test/${testId}`);
  };

  const handleGoBack = () => {
    const prevIndex = currentLessonIndex - 1;
    if (prevIndex >= 0) {
      setCurrentLessonIndex(prevIndex);
      setSearchParams({ currentLessonIndex: prevIndex });
    }
  };

  const handleGoForward = () => {
    const nextIndex = currentLessonIndex + 1;
    if (nextIndex < (lesson.sections?.length || 0)) {
      setCurrentLessonIndex(nextIndex);
      setSearchParams({ currentLessonIndex: nextIndex });
    }
  };

  const handleSkipToNextSection = () => {
    const nextIndex = currentLessonIndex + 1;
    if (nextIndex < (lesson.sections?.length || 0)) {
      setCurrentLessonIndex(nextIndex);
      setSearchParams({ currentLessonIndex: nextIndex });
    }
  };

  const handleFinishLesson = () => {
    setShowResults(true);
  };

  const handleBackToLessons = () => {
    navigate('/lesson');
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="error">
        Ошибка: {error}
        <Button type="primary" onClick={() => navigate('/lesson')}>
          Вернуться к урокам
        </Button>
      </div>
    );
  }

  if (!lesson) {
    return <div>Урок не найден</div>;
  }

  const currentSection =
    lesson.sections && lesson.sections[currentLessonIndex]
      ? lesson.sections[currentLessonIndex]
      : { content: lesson.content || "<p>Теория отсутствует</p>" };
  const currentTest =
    lesson.tests && lesson.tests.length > currentLessonIndex
      ? lesson.tests[currentLessonIndex]
      : null;

  const canSkipFirstTest = testHistory.includes(lesson.tests?.[0]?.TestID);

  if (showResults) {
    return <TestResults lessonId={id} />;
  }

  return (
    <div className="lesson-details-page">
      <div
        className="lesson-header"
        style={{
          backgroundImage: lesson.img
            ? `url(${import.meta.env.VITE_API_URL}/static/${lesson.img})`
            : "none",
          backgroundColor: lesson.img ? "transparent" : "rgb(34, 37, 63)",
          position: "relative",
        }}
      >
        <div className="lesson-header-overlay">
          <h1 className="lesson-title">{lesson.title}</h1>
        </div>
      </div>

      <div className="lesson-content-container" style={{ transition: "all 0.3s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 className="lesson-content-title">Теория урока:</h3>
          {lesson.sections && lesson.sections.length > 0 && (
            <span style={{ color: "rgb(31, 30, 30)", fontSize: "1.2em", fontWeight: "bold" }}>
              Часть {currentLessonIndex + 1}/{lesson.sections.length}
            </span>
          )}
        </div>

        <div
          className="lesson-content"
          style={{ transition: "opacity 0.3s ease" }}
          dangerouslySetInnerHTML={{
            __html: currentSection.content,
          }}
        />

        {lesson.tests && lesson.tests.length > 0 && currentTest ? (
          <div className="test-section" style={{ marginTop: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {currentLessonIndex > 0 && (
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <Button type="default" onClick={handleGoBack}>
                    Назад
                  </Button>
                </div>
              )}

              {completedTests.includes(currentTest.TestID) ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: currentLessonIndex === 0 ? "center" : "center",
                    width: "100%",
                  }}
                >
                  <div className="next-part">
                    <p>Тест "{currentTest.title}" завершён!</p>
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                      {currentLessonIndex < lesson.tests.length - 1 ? (
                        <Button
                          type="primary"
                          onClick={() => {
                            setCurrentLessonIndex(currentLessonIndex + 1);
                            setSearchParams({ currentLessonIndex: currentLessonIndex + 1 });
                          }}
                        >
                          Перейти к следующей части
                        </Button>
                      ) : completedTests.length === lesson.tests.length ? (
                        <Button type="primary" onClick={handleFinishLesson}>
                          Завершить урок
                        </Button>
                      ) : null}
                      <Button type="default" onClick={() => handleRetakeTest(currentTest.TestID)}>
                        Пройти тест заново
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="button-container">
                  <Button
                    type="primary"
                    className="start-quiz-button"
                    style={{ margin: "0 auto" }}
                    onClick={() => handleStartTest(currentTest.TestID)}
                  >
                    Начать тест
                  </Button>
                  {currentLessonIndex === 0 && canSkipFirstTest && (
                    <Button
                      type="default"
                      onClick={handleSkipToNextSection}
                      style={{ marginTop: "10px" }}
                    >
                      Пропустить тест
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p>Тесты для этого урока отсутствуют.</p>
        )}
      </div>
    </div>
  );
}