import { useLoaderData, useNavigation, useSearchParams } from "react-router";
import { mockFetch } from "../api";
import { useState, useEffect, useCallback } from "react";
import { Loader } from "../components/Loader";
import CourseCard from "../components/CourseCard";

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

// export const courseLoader = async ({ request }) => {
//   const search = new URL(request.url).searchParams.get("search");
//   const courses = await mockFetch("/courses", { search });

//   if (courses.error) {
//     throw new Response("Not Found", { status: 404 });
//   }

//   return { courses };
// };

export const Courses = () => {
  const [course, setCourses] = useState([]) 
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { state } = useNavigation();
  const [search, setSearch] = useState(searchParams.get("search") || "");


  const getCourses = useCallback(
    debounce(async (newSearch) =>{
        setLoading(true);
        const coursesData = await mockFetch("/courses", { search: newSearch });
        setCourses(coursesData);
        setLoading(false)
    },1000),[]
  );


  const updateSearchParams = () => {
    setSearchParams((params) => {
      if (search) {
        params.set("search", search);
      } else {
        params.delete("search");
      }
      return new URLSearchParams(params);
    });
  };

  useEffect(() => {
    updateSearchParams();
    getCourses(search)
  }, [search]);

  // if (!Array.isArray(courses)) {
  //   console.error("courses is not an array:", courses);
  //   return <div>No courses available</div>;
  // }

  // if (state === "loading") {
  //   return (
  //     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
  //       <Loader />
  //     </div>
  //   );
  // }

  return (
    <>
      {/* {state === "loading" && <Loader />} */}
      <input
        type="text"
        className="search-input"
        placeholder="Search courses"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="title-content">
        <h1>Courses</h1>
      </div>
      <div className="card-container">
        {loading ? (
          <Loader/>
        ) : (
          course.length === 0 ?(
            <div>No courses found</div>
          ): (
            course.map((cours) => (
              <CourseCard key={cours.id} course={cours} />
             ))
          )
        )}
      </div>
    </>
  );
};