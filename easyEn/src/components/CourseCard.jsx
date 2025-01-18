import React, { memo } from "react";
import { Link } from "react-router";
import { ROUTES } from "../index";

export const CourseCard = memo(( { course } ) =>{

    return (
        <div className="card" key={course.id}>
        <div className="img-cont">
          <img
            className="abstract-img-course"
            src={course.imageUrl}
            alt={course.title}
            loading="lazy" 
          />
        </div>
        <Link to={`${ROUTES.courses}/${course.id}`} className="title-card">
          {course.title}
        </Link>
        <div className="progress-card">
          <div className="progressbar-Card"></div>
          <div className="text-desc-card">Completed: 0%</div>
        </div>
      </div>
    );
  });
  
  export default CourseCard;