import { useParams,useSearchParams } from "react-router";
import { useState,useEffect } from "react";
import CourseCard from "../components/CourseCard";
import { fetchLesson } from "../http/LessonApi";

const Lesson = () => {
  const { id } = useParams(); // Получите ID урока из параметров (если нужно)
  const [lesson, setLesson] = useState([]); // Инициализируем как массив
  const [loading, setLoading] = useState(true); // Состояние для загрузки
  const [error, setError] = useState(null); // Состояние для ошибок
  const [searchParams, setSearchParams] = useSearchParams(); // Управление параметрами URL
  const search = searchParams.get("search") || "";

 

  const updateSearchParams = (newSearch) =>{
    setSearchParams((params) =>{
      if(newSearch){
        params.set("search", newSearch);
      }else{
        params.delete("search");
      }
      return params;
    })
  }

  const filteredLessons = lesson.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase())
  )
 
  const handleSearchChange = (e) => {
    const newSearch = e.target.value;
    setSearchParams(newSearch ? { search: newSearch } : {});
  };
  
  useEffect(() => {
    const getCourses = async () => {
      try {
        const data = await fetchLesson(search); // Передаем search в API
        setLesson(data); // Устанавливаем данные уроков
        setLoading(false); // Загрузка завершена
      } catch (err) {
        setError(err.message); // Устанавливаем ошибку
        setLoading(false); // Загрузка завершена
      }
    };

    getCourses(); // Вызываем функцию загрузки
  }, [search]);

  if (loading) {
      return <div>Загрузка уроков...</div>; // Отображаем загрузку
  }

  if (error) {
      return <div>Ошибка: {error}</div>; // Отображаем ошибку
  }

  return (
      <div>
          <input
              type="text"
              className="search-input"
              placeholder="Search courses"
              value={search}
              onChange={handleSearchChange}
          />
          <div className="title-content">
              <h1>Lesson</h1>
          </div>
          <div className="card-container">
              {filteredLessons.length === 0 ? (
                  <div>No lessons found</div> // Если уроков нет
              ) : (
                  filteredLessons.map((item) => (
                      <CourseCard key={item.LessonID} lesson={item} /> // Используем CourseCard
                  ))
              )}
          </div>
      </div>
  );
  
};

export default Lesson;