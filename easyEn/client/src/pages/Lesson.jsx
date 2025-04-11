import { useParams,useSearchParams } from "react-router";
import { useState,useEffect, useRef } from "react";
import CourseCard from "../components/CourseCard";
import { fetchLesson } from "../http/LessonApi";
import { Button } from "antd";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ModalLessonAdd from "../components/ModalLesson";
import ModalLessonEdit from "../components/ModalLessonEdit";
import ModalLessonDelete from "../components/ModalLessonDelete";
import Loader from "../components/Loader";

const Lesson = () => {
  const { id } = useParams(); 
  const [lesson, setLesson] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [searchParams, setSearchParams] = useSearchParams(); 
  const search = searchParams.get("search") || "";
  const [modalAddVisible, setModalAddVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [selectedLessonForDelete, setSelectedLessonForDelete] = useState(null);

  const handleLessonCreated = (newLesson) => {
    setLesson([...lesson, newLesson]);
  };

  const handleLessonUpdated = (updatedLesson) => {
    setLesson(lesson.map(item => 
      item.LessonID === updatedLesson.LessonID ? updatedLesson : item
    ));
  };
  const handleLessonDeleted = (deletedLessonId) => {
    setLesson(lesson.filter(item => item.LessonID !== deletedLessonId));
  };

  const handleEditLesson = (lesson) => {
    setSelectedLesson(lesson);
    setModalEditVisible(true);
  };
  const handleDeleteLesson = (lesson) => {
    setSelectedLessonForDelete(lesson);
    setModalDeleteVisible(true);
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
    return () => {
      isMounted = false;
    };
  }, [search]);

  if (loading) {
      return <div className="loader"><Loader/></div>; 
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
      <div style={{ margin: "20px 0", display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="primary"
          onClick={() => setModalAddVisible(true)}
        >
          Добавить урок
        </Button>
      </div>

      <ModalLessonAdd
        visible={modalAddVisible}
        onClose={() => setModalAddVisible(false)}
        onLessonCreated={handleLessonCreated}
      />
      <ModalLessonEdit
          visible={modalEditVisible}
          onClose={() => setModalEditVisible(false)}
          lesson={selectedLesson}
          onLessonUpdated={handleLessonUpdated}
        />
        <ModalLessonDelete
          visible={modalDeleteVisible}
          onClose={() => {
            setModalDeleteVisible(false);
            setSelectedLessonForDelete(null);
          }}
          lesson={selectedLessonForDelete}
          onLessonDeleted={handleLessonDeleted}
        />
    </div>

    <div className="card-container">
      {filteredLessons.length === 0 ? (
        <div>No lessons found</div>
      ) : (
        <div className="swiper-wrapper">
        <div className="swiper-nav-prev" />
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={10}
          slidesPerView={3}
          navigation={{
            prevEl: '.swiper-nav-prev',
            nextEl: '.swiper-nav-next',
          }}
          pagination={{ clickable: true }}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 5,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 5,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 5,
            },
            1480: {
              slidesPerView: 4,
              spaceBetween: 5,
            },
            1720: {
              slidesPerView: 5,
              spaceBetween: 5,
            },
          }}
        >
          {filteredLessons.map((item) => (
            <SwiperSlide key={item.LessonID}>
              <CourseCard lesson={item} onEdit={handleEditLesson} onDelete={handleDeleteLesson} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-nav-next" />
      </div>
      )}
    </div>
  </div>
);
};
export default Lesson;