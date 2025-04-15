import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { fetchOneLesson } from "../http/LessonApi"
import { Link } from "react-router"
import { LESSON_ROUTE, TEST_ROUTE } from ".."
import Loader from "../components/Loader"

export default function LessonDetails (){

    const [lesson, setLesson] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { id } = useParams()
    const navigate = useNavigate();

    useEffect(() => {
        const loadLesson = async () => {
            try {
                setLoading(true)
                const data = await fetchOneLesson(id)
                console.log("Данные урока:", data)
                setLesson(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        loadLesson()
    }, [id])

    if (loading) {
        return <Loader/>
    }

    if (error) {
        return <div>Ошибка: {error}</div>
    }

    if (!lesson) {
        return <div>Урок не найден</div>
    }

    const handleStartQuiz = () => {
        // Предполагаем, что у вас есть маршрут для теста, например, /lesson/:id/quiz
        navigate(`/lesson/${id}/quiz`);
      };

    return <div className="lesson-details-page">
    {/* Верхняя часть с заблюренным фоном */}
    <div
      className="lesson-header"
      style={{
        backgroundImage: lesson.img
          ? `url(${import.meta.env.VITE_API_URL}/static/${lesson.img})`
          : "none",
        backgroundColor: lesson.img ? "transparent" : "rgb(34, 37, 63)", // Запасной фон в тон дизайна
      }}
    >
      <div className="lesson-header-overlay">
        <h1 className="lesson-title">{lesson.title}</h1>
      </div>
    </div>

    {/* Содержимое урока */}
    <div className="lesson-content-container">
      <h3 className="lesson-content-title">Описание урока:</h3>
      <div
        className="lesson-content"
        dangerouslySetInnerHTML={{
          __html: lesson.content || "<p>Описание урока отсутствует</p>",
        }}
      />

      {/* Кнопка "Начать тест" */}
      <Link to={TEST_ROUTE}>
      <button className="start-quiz-button" onClick={handleStartQuiz}>
        Начать тест
      </button>
      </Link>
  

      {/* Ссылка "Назад" */}
      <Link to={LESSON_ROUTE} className="back-link">
        ← Назад к списку уроков
      </Link>
    </div>
  </div>
}