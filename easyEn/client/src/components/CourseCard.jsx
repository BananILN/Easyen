import React, { memo } from "react";
import { Link } from "react-router";
import { LESSDETAILS_ROUTE } from "../index";
import fallbackImg from '../assets/abksback3.png';
import { Button } from "antd";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";

export const CourseCard = memo(({ lesson, onEdit, onDelete }) => {
  const { user } = useContext(AuthContext) || {};
  let isAdmin = false;
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      isAdmin = decoded.RoleID === 2;
    }
  } catch (e) {
    console.error("Ошибка декодирования токена:", e);
  }

  
  const imageSrc = lesson.imgUrl 
    ? lesson.imgUrl
    : lesson.img 
      ? `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_URL.endsWith('/') ? '' : '/'}static/${lesson.img}?t=${new Date().getTime()}`
      : fallbackImg;



  return (
    <div className="card" key={lesson.LessonID}>
      <div className="img-cont">
        <img
          className="abstract-img-course"
          src={imageSrc}
          alt={lesson.title}
          loading="lazy"
          onError={(e) => {
            console.log("Ошибка загрузки изображения:", imageSrc);
            e.target.src = fallbackImg;
          }}
        />
      </div>
      <Link to={`${LESSDETAILS_ROUTE.replace(':id', lesson.LessonID)}`} className="title-card">
        {lesson.title}
      </Link>
      <div className="progress-card">
        <div className="progressbar-Card"></div>
        <div className="text-desc-card">Completed: 0%</div>

        {isAdmin && (
          <div className="admin-actions" style={{ marginTop: '10px' }}>
            <Button 
              type="primary" 
              size="small" 
              onClick={() => onEdit(lesson)}
              style={{ marginRight: '5px' }}
            >
              Редактировать
            </Button>
            <Button 
              type="primary" 
              danger 
              size="small" 
              onClick={() => onDelete(lesson)}
            >
              Удалить
            </Button>
          </div>
        )}
      </div>
    </div>
  );
});

export default CourseCard;