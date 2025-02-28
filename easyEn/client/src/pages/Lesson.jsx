import { useParams } from "react-router";
import { useState } from "react";
import CourseCard from "../components/CourseCard";

const Lesson = () => {
    const [course, setCourses] = useState([]) 
    const { id } = useParams(); // Получите ID урока из параметров маршрута
    return (
        <div>
             <>
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search courses"
                    //   value={search}
                    //   onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="title-content">
                      <h1>Lesson</h1>
                    </div>
                    <div className="card-container">
                      {course.length === 0 ? (
                        <div>No courses found</div>
                      ) : (
                        course.map((item) => (
                          <CourseCard key={item.id} course={item} />
                        ))
                      )}
                    </div>
                  </>
        </div>
    );
};

export default Lesson;