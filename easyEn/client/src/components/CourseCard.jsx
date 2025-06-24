import React, { memo, useContext } from "react";
import { Link } from "react-router";
import { LESSDETAILS_ROUTE } from "../index";
import fallbackImg from "../assets/abksback3.png";
import { Button, Progress } from "antd";
import { useTranslation } from "react-i18next";

export const CourseCard = memo(({ lesson, onEdit, onDelete, progress = [] }) => {
  const { t } = useTranslation();

  const parsedSections = typeof lesson.sections === "string" ? JSON.parse(lesson.sections || "[]") : lesson.sections || [];
  const totalSections = Array.isArray(parsedSections) ? parsedSections.length : 0;

  const totalTests = lesson.tests?.length || 0;
  const completedTests = progress.filter((p) => p.completed).length || 0;

  const completedSections = Math.min(completedTests, totalSections);

  const totalTasks = totalTests + totalSections;
  const completedTasks = completedTests + completedSections;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const imageSrc = lesson.imgUrl
    ? lesson.imgUrl
    : lesson.img
    ? `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_URL.endsWith("/") ? "" : "/"}static/${lesson.img}?t=${new Date().getTime()}`
    : fallbackImg;

  const progressStrokeColor = progressPercentage === 0
    ? { "0%": "#d9d9d9", "100%": "#d9d9d9" }
    : {
        "0%": "#ff4d4f",
        "50%": "#ffeb3b",
        "100%": "#52c41a",
      };

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
      <Link to={`${LESSDETAILS_ROUTE.replace(":id", lesson.LessonID)}`} className="title-card">
        {lesson.title}
      </Link>
      <div className="progress-card">
        <div className="progress-stats">
          <span className="stat-item">
            <svg width="12" height="12" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6 3.5L1 2V15L6 16.5M6 3.5L12 1M6 3.5V16.5M12 1L17 2.5V15.5L12 13.5M12 1V13.5M12 13.5L6 16.5"
                stroke="#EAEAEA"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            {t("theory")}: {totalSections}
          </span>
          <span className="divider" />
          <span className="stat-item">
            <svg width="12" height="14" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5 5H10.5M5 13H10.5M5 9H9.5M13 1H2C1.44772 1 1 1.44772 1 2V16C1 16.5523 1.44772 17 2 17H13C13.5523 17 14 16.5523 14 2C14 1.44772 13.5523 1 13 1Z"
                stroke="#EAEAEA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t("tests")}: {totalTests}
          </span>
        </div>
        <Progress
          percent={progressPercentage}
          showInfo={false}
          strokeColor={progressStrokeColor}
          className="custom-progress-bar"
        />
        <span className="progress-text">
          {t("completed")}: {Math.round(progressPercentage)}%
        </span>
        {(onEdit || onDelete) && (
          <div className="admin-actions" style={{ marginTop: "10px" }}>
            {onEdit && (
              <Button
                type="primary"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(lesson);
                }}
                style={{ marginRight: "5px" }}
              >
                {t("edit")}
              </Button>
            )}
            {onDelete && (
              <Button
                type="primary"
                danger
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(lesson);
                }}
              >
                {t("delete")}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default CourseCard;