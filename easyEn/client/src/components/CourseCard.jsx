import React, { memo } from "react";
import { Link } from "react-router";
import { LESSDETAILS_ROUTE, ROUTES } from "../index";
import fallbackImg from '../assets/abksback3.png'
import { Button } from "antd";
import { AuthContext } from "../context/AuthContext"; // Предполагаем, что у вас есть AuthContext
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";

export const CourseCard = memo(( { lesson, onEdit, onDelete } ) =>{
  const { user } = useContext(AuthContext) || {}; // Получаем данные пользователя из контекста
  let isAdmin = false;
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      isAdmin = decoded.RoleID === 2; // Админ, если RoleID === 2
    }
  } catch (e) {
    console.error("Ошибка декодирования токена:", e);
  }

  const imageSrc = lesson.img 
    ? import.meta.env.VITE_API_URL + lesson.img
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
  
