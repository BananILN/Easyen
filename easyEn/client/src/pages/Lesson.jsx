import React, { useState, useEffect, useContext } from "react";
import { useParams, useSearchParams } from "react-router";
import CourseCard from "../components/CourseCard";
import { fetchLesson } from "../http/LessonApi";
import { fetchTestByLesson, fetchProgress } from "../http/TestApi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Loader from "../components/Loader";
import { useTranslation } from "react-i18next";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";

const Lesson = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const [lesson, setLesson] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [progressData, setProgressData] = useState({});
  const { t } = useTranslation();

  const handleSearchChange = (e) => {
    const newSearch = e.target.value;
    setSearchParams(newSearch ? { search: newSearch } : {});
  };

  const filteredLessons = lesson.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    let isMounted = true;

    const getCourses = async () => {
      try {
        setLoading(true);
        const lessonData = await fetchLesson("");
        const updatedLessons = lessonData.map((item) => ({
          ...item,
          imgUrl: item.img ? `http://localhost:5000/static/${item.img}?t=${new Date().getTime()}` : null,
        }));

        const lessonsWithTests = await Promise.all(
          updatedLessons.map(async (lessonItem) => {
            const tests = await fetchTestByLesson(lessonItem.LessonID);
            return { ...lessonItem, tests };
          })
        );

        setLesson(lessonsWithTests);

        if (user?.UserID) {
          const progressPromises = lessonsWithTests.map(async (lessonItem) => {
            const progress = await fetchProgress(user.UserID, lessonItem.LessonID);
            return { lessonId: lessonItem.LessonID, progress };
          });
          const progressResults = await Promise.all(progressPromises);
          const progressMap = progressResults.reduce((acc, { lessonId, progress }) => {
            acc[lessonId] = progress;
            return acc;
          }, {});
          setProgressData(progressMap);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getCourses();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const loaderColor = theme === "light" ? "#333333" : theme === "dark" ? "#ffffff" : "#ffffff";

  if (loading) {
    return (
      <div className="lesson-main-page">
        <div className="loader-centered">
          <Loader color={loaderColor} />
        </div>
      </div>
    );
  }

  if (error) {
    return <div>{t("error")}: {error}</div>;
  }

  return (
    <div className="lesson-main-page">
      <input
        type="text"
        className="search-input"
        placeholder={t("search_courses")}
        value={search}
        onChange={handleSearchChange}
      />
      <div className="title-content">
        <h1>{t("courses")}</h1>
      </div>
      <div className="card-container">
        {filteredLessons.length === 0 ? (
          <div>{t("no_lessons_found")}</div>
        ) : (
          <div className="swiper-wrapper">
            <div className="swiper-nav-prev" />
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={10}
              slidesPerView={3}
              navigation={{
                prevEl: ".swiper-nav-prev",
                nextEl: ".swiper-nav-next",
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
                  <CourseCard
                    lesson={item}
                    progress={progressData[item.LessonID] || []}
                  />
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