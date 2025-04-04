import React, { memo } from "react";
import { Link } from "react-router";
import { LESSDETAILS_ROUTE, ROUTES } from "../index";
import fallbackImg from '../assets/abksback3.png'

export const CourseCard = memo(( { lesson } ) =>{

      const imageSrc = lesson.img 
    ? import.meta.env.VITE_API_URL + lesson.img
    : fallbackImg;

    return (
        <div className="card" key={lesson.id}>
        <div className="img-cont">
          <img
            className="abstract-img-course"
            src={imageSrc}
            alt={lesson.title}
            loading="lazy" 
            onError={(e) => {
              // Если даже указанное изображение не загрузится
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
        </div>
      </div>
    );
  });
  
  export default CourseCard;
  
