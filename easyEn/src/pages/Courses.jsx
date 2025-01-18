import { useLoaderData, useNavigation, useSearchParams } from "react-router";
import { mockFetch } from "../api";
import { Suspense, useState, useEffect } from "react";
import { Loader } from "../components/Loader";
import { ROUTES } from "../index";
import { Link } from "react-router";

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

export const courseLoader = async ({ request }) => {
  const search = new URL(request.url).searchParams.get("search");
  const courses = await mockFetch("/courses", { search });

  if (courses.error) {
    throw new Response("Not Found", { status: 404 });
  }

  return { courses };
};

export const Courses = ({ id }) => {
  const { courses } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchFromQuery = searchParams.get("search") || "";
  const { state } = useNavigation();
  const [search, setSearch] = useState(searchFromQuery);

  const updateSearchParams = debounce((newSearch) => {
    setSearchParams((params) => {
      if (newSearch) {
        params.set("search", newSearch);
      } else {
        params.delete("search");
      }
      return params;
    });
  }, 2000);

  useEffect(() => {
    updateSearchParams(search);
  }, [search]);

  if (!Array.isArray(courses)) {
    console.error("courses is not an array:", courses);
    return <div>No courses available</div>;
  }

  if (state === "loading") {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader />
      </div>
    );
  }

  return (
    <>
      {state === "loading" && <Loader />}
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
        {courses.map((course) => (
          <div className="card" key={course.id}>
            <div className="img-cont">
              <img
                className="abstract-img-course"
                src={course.imageUrl}
                alt={course.title}
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
        ))}
      </div>
    </>
  );
};