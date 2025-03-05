import { useNavigation, useSearchParams } from "react-router";

import { useState, useEffect, useCallback } from "react";
import { Loader } from "../components/Loader";
import CourseCard from "../components/CourseCard";
import { fetchLesson } from "../http/LessonApi";


const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};


export const Courses = () => {
  const [course, setCourses] = useState([]) 
  const [loading,setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { state } = useNavigation();
  const [search, setSearch] = useState(searchParams.get("search") || "");



  const [lesson, setLesson] = useState();


  useEffect(()=>{
          fetchLesson().then(data => {
              setLesson(data)
          })
  }, [])
  

  // const getCourses = useCallback(
  //   debounce(async (newSearch) =>{
  //       setLoading(true);
  //       const coursesData = await mockFetch("/courses", { search: newSearch });
  //       setCourses(coursesData);
  //       setLoading(false)
  //   },1000),[]
  // );


  // const updateSearchParams = () => {
  //   setSearchParams((params) => {
  //     if (search) {
  //       params.set("search", search);
  //     } else {
  //       params.delete("search");
  //     }
  //     return new URLSearchParams(params);
  //   });
  // };

  // useEffect(() => {
  //   updateSearchParams();
  //   getCourses(search)
  // }, [search]);

  const styles = {
    loaderContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
     
      zIndex: 1000,
    },
  };
  

  return (
    <>
    {loading ? (
      <div style={styles.loaderContainer}>
        <Loader />
      </div>
    ) : (
      <>
        <input
          type="text"
          className="search-input"
          placeholder="Search courses"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="title-content">
          <h1>Lesson</h1>
        </div>
        <div className="card-container">
          {course.length === 0 ? (
            <div>No courses found</div>
          ) : (
            course.map((item) => (
              <CourseCard key={item.id} lesson={item} />
            ))
          )}
        </div>
      </>
    )}
  </>
  );
};