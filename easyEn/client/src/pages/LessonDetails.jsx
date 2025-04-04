import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { fetchOneLesson } from "../http/LessonApi"
import { Link } from "react-router"
import { LESSON_ROUTE } from ".."

export default function LessonDetails (){

    const [lesson, setLesson] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { id } = useParams()

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
        return <div>Загрузка урока...</div>
    }

    if (error) {
        return <div>Ошибка: {error}</div>
    }

    if (!lesson) {
        return <div>Урок не найден</div>
    }
    return <>
       <div className="lesson-details-container">
            <h1 className="lesson-title">{lesson.title}</h1>
            
            {lesson.img && (
                <img
                    src={`${import.meta.env.VITE_API_URL}${lesson.img}`}
                    alt={lesson.title}
                    className="lesson-image"
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
            )}
            
            <div className="lesson-content-wrapper">
                <h3>Описание урока:</h3>
                <div 
                    className="lesson-content"
                    dangerouslySetInnerHTML={{ 
                        __html: lesson.content || "<p>Описание урока отсутствует</p>" 
                    }}
                />
            </div>
            <Link to={LESSON_ROUTE} className="back-link">
                ← Назад к списку уроков
            </Link>
        </div>
    </>
}