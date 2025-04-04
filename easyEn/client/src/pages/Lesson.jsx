import { useParams,useSearchParams } from "react-router";
import { useState,useEffect } from "react";
import CourseCard from "../components/CourseCard";
import { fetchLesson } from "../http/LessonApi";
import ModalLesson from "../components/ModalLesson";
import { Button } from "antd";

const Lesson = () => {
  const { id } = useParams(); 
  const [lesson, setLesson] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [searchParams, setSearchParams] = useSearchParams(); 
  const search = searchParams.get("search") || "";

  const [modalVisible, setModalVisible] = useState(false);

  const handleLessonCreated = (newLesson) => {
    setLesson([...lesson, newLesson]);
  };

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
    let isMounted = true
    
    const getCourses = async () => {
      try {
        const data = await fetchLesson(search); 
        setLesson(data); 
        setLoading(false); 
      } catch (err) {
        setError(err.message); 
        setLoading(false); 
      }
    };

    getCourses(); 
  }, [search]);

  if (loading) {
      return <div>Загрузка уроков...</div>; 
  }

  if (error) {
      return <div>Ошибка: {error}</div>; 
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
                <div>
            {/* Существующий код... */}
            
            <div style={{ margin: "20px 0", display: "flex", justifyContent: "flex-end" }}>
              <Button 
                type="primary" 
                onClick={() => setModalVisible(true)}
              >
                Добавить урок
              </Button>
            </div>

            <ModalLesson
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onLessonCreated={handleLessonCreated}
            />
          </div>

          <div className="card-container">
              {filteredLessons.length === 0 ? (
                  <div>No lessons found</div> 
              ) : (
                  filteredLessons.map((item) => (
                      <CourseCard key={item.LessonID} lesson={item} /> 
                  ))
              )}
          </div>
      </div>
  );
};
export default Lesson;