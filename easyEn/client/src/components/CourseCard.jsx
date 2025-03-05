import React, { memo } from "react";
import { Link } from "react-router";
import { ROUTES } from "../index";


export const CourseCard = memo(( { lesson } ) =>{

    return (
        <div className="card" key={lesson.id}>
        <div className="img-cont">
          <img
            className="abstract-img-course"
            src={import.meta.env.VITE_API_URL + lesson.img}
            alt={lesson.title}
            loading="lazy" 
          />
        </div>
        <Link to={``} className="title-card">
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
  
//   export const CourseCard = memo(({ lesson }) => {
//     return (
//         <div className="card" key={lesson.id}>
//             <div className="img-cont">
//                 <img
//                     className="abstract-img-course"
//                     src={lesson.img} // Используем lesson.img вместо lesson.imageUrl
//                     alt={lesson.title}
//                     loading="lazy"
//                 />
//             </div>
//             <Link to={`${ROUTES.lesson}/${lesson.LessonID}`} className="title-card">
//                 {lesson.title} {/* Используем lesson.title вместо course.title */}
//             </Link>
//             <div className="progress-card">
//                 <div className="progressbar-Card"></div>
//                 <div className="text-desc-card">Completed: 0%</div>
//             </div>
//         </div>
//     );
// });

// export default CourseCard;