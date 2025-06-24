import React, { useEffect, useState, useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import { fetchAllUsers, fetchProgressForUser } from "../http/AdminApi";
import { fetchLesson } from "../http/LessonApi";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { Table, Button, Input, Space, Empty, Tooltip, Select, Modal, message } from "antd";
import { useNavigate } from "react-router";
import { HOME_ROUTE } from "../index";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import defaultImg from "../assets/user.svg";
import { MutatingDots } from "react-loader-spinner";
import ModalLessonDelete from "../components/ModalLessonDelete";
import ModalLessonEdit from "../components/ModalLessonEdit";
import ModalLessonAdd from "../components/ModalLesson";
import ModalTestAdd from "../components/ModalAddTest";
import ModalTestEdit from "../components/ModalTestEdit";
import ModalTestDelete from "../components/ModalTestDelete";
import { fetchTestByLesson, deleteTest } from "../http/TestApi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import CourseCard from "../components/CourseCard";

const { Option } = Select;

const Admin = () => {
  const { t } = useTranslation();
  const { isAuth, user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [filteredTestLessons, setFilteredTestLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsersExpanded, setIsUsersExpanded] = useState(false);
  const [searchUserTerm, setSearchUserTerm] = useState("");
  const [searchLessonTerm, setSearchLessonTerm] = useState("");
  const [searchTestTerm, setSearchTestTerm] = useState("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isTestModalVisible, setIsTestModalVisible] = useState(false);
  const [isTestEditModalVisible, setIsTestEditModalVisible] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [isDeleteTestModalVisible, setIsDeleteTestModalVisible] = useState(false);
  const navigate = useNavigate();
  const swiperRef = useRef(null);

  useEffect(() => {
    if (!isAuth || user?.RoleID !== 2) {
      setError(t("access_denied"));
      setLoading(false);
      navigate(HOME_ROUTE, { replace: true });
      return;
    }

    const loadAdminData = async () => {
      try {
        setLoading(true);

        const usersData = await fetchAllUsers();
        const usersWithProgress = [];
        for (const user of usersData) {
          try {
            const progress = await fetchProgressForUser(user.UserID);
            usersWithProgress.push({ ...user, progress });
          } catch (err) {
            console.error(`Ошибка получения прогресса для пользователя ${user.UserID}:`, err);
            usersWithProgress.push({ ...user, progress: [] });
          }
        }
        setUsers(usersWithProgress);
        setFilteredUsers(usersWithProgress);

        const lessonsData = await fetchLesson();
        const normalizedLessons = Array.isArray(lessonsData)
          ? lessonsData.map((lesson) => ({
              ...lesson,
              sections: Array.isArray(lesson.sections) ? lesson.sections : [],
            }))
          : [];
        setLessons(normalizedLessons);
        setFilteredLessons(normalizedLessons);
        setFilteredTestLessons(normalizedLessons);
      } catch (err) {
        setError(t("admin_load_error"));
        console.error("Ошибка загрузки данных администратора:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [t, isAuth, user, navigate]);

  useEffect(() => {
    if (selectedLesson && selectedSection !== null) {
      loadTestsForLesson(selectedLesson.LessonID);
    }
  }, [selectedLesson, selectedSection]);

  const handleCardClick = (lesson) => {
    if (selectedLesson && selectedLesson.LessonID === lesson.LessonID) return;
    setSelectedLesson(lesson);
    setSelectedSection(null);
    setSelectedTest(null);
  };

  const handleSearchUsers = (value) => {
    setSearchUserTerm(value);
    if (value.trim() === "") {
      setFilteredUsers(users);
    } else {
      const lowerCaseValue = value.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.username.toLowerCase().includes(lowerCaseValue) ||
          user.email.toLowerCase().includes(lowerCaseValue)
      );
      setFilteredUsers(filtered);
    }
  };

  const handleSearchLessons = (value) => {
    setSearchLessonTerm(value);
    if (value.trim() === "") {
      setFilteredLessons(lessons);
    } else {
      const lowerCaseValue = value.toLowerCase();
      const filtered = lessons.filter((lesson) =>
        lesson.title.toLowerCase().includes(lowerCaseValue)
      );
      setFilteredLessons(filtered);
    }
  };

  const handleSearchTests = (value) => {
    setSearchTestTerm(value);
    if (value.trim() === "") {
      setFilteredTestLessons(lessons);
    } else {
      const lowerCaseValue = value.toLowerCase();
      const filtered = lessons.filter((lesson) =>
        lesson.title.toLowerCase().includes(lowerCaseValue)
      );
      setFilteredTestLessons(filtered);
    }
  };

  const handleSelectSection = (sectionIndex) => {
    setSelectedSection(sectionIndex);
    setSelectedTest(null);
  };

  const loadTestsForLesson = async (lessonId) => {
    if (selectedLesson) {
      try {
        const tests = await fetchTestByLesson(lessonId);
        console.log("Полученные тесты:", tests);
        const testForSection = tests.find((test) => test.order === selectedSection + 1);
        console.log("Выбранный тест для секции:", testForSection);
        setSelectedTest(testForSection || null);
      } catch (error) {
        console.error("Ошибка загрузки тестов:", error);
        setSelectedTest(null);
        message.error(t("error_loading_tests"));
      }
    }
  };

  const handleTestCreated = (newTest) => {
    // Удаляем вызов message.success
    if (selectedSection !== null) {
      loadTestsForLesson(selectedLesson.LessonID);
    }
  };

  const handleDeleteTest = async () => {
    if (!selectedTest || !selectedTest.TestID) {
      message.warning(t("no_test_to_delete"));
      setIsDeleteTestModalVisible(false);
      return;
    }

    try {
      await deleteTest(selectedTest.TestID);
      message.success(t("test_deleted_success"));
      setSelectedTest(null);
      if (selectedSection !== null) {
        loadTestsForLesson(selectedLesson.LessonID);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || t("unknown_error");
      console.error("Ошибка удаления теста:", error);
      message.error(`${t("error_deleting_test")}: ${errorMessage}`);
    }
    setIsDeleteTestModalVisible(false);
  };

  const handleOpenDeleteTestModal = () => {
    if (selectedTest) {
      setIsDeleteTestModalVisible(true);
    } else {
      message.warning(t("no_test_to_delete"));
    }
  };

  const handleAddTest = () => {
    setSelectedTest(null);
    setIsTestModalVisible(true);
  };

  const handleEditTestDetails = () => {
    if (selectedTest) {
      setIsTestEditModalVisible(true);
    } else {
      message.warning(t("no_test_to_edit"));
    }
  };

  const displayedUsers = isUsersExpanded ? filteredUsers : filteredUsers.slice(0, 2);

  if (loading) {
    const loaderColor = theme === "light" ? "#333333" : theme === "dark" ? "#ffffff" : "#ffffff";
    return (
      <div className="admin-page" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <MutatingDots
          height="100"
          width="100"
          color={loaderColor}
          secondaryColor={loaderColor}
          radius="12.5"
          ariaLabel="mutating-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  }
  if (error) return <div>{error}</div>;

  const handleDeleteUser = async (userId) => {
    if (window.confirm(t("confirm_delete_user"))) {
      try {
        await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        setUsers(users.filter((u) => u.UserID !== userId));
        setFilteredUsers(filteredUsers.filter((u) => u.UserID !== userId));
      } catch (err) {
        console.error(`Ошибка удаления пользователя ${userId}:`, err);
        setError(t("delete_user_error"));
      }
    }
  };

  const handleDeleteLesson = (lesson) => {
    setSelectedLesson(lesson);
    setIsDeleteModalVisible(true);
  };

  const handleEditLesson = (lesson) => {
    setSelectedLesson(lesson);
    setIsEditModalVisible(true);
  };

  const handleLessonDeleted = (deletedLessonId) => {
    setLessons(lessons.filter((lesson) => lesson.LessonID !== deletedLessonId));
    setFilteredLessons(filteredLessons.filter((lesson) => lesson.LessonID !== deletedLessonId));
    setFilteredTestLessons(filteredTestLessons.filter((lesson) => lesson.LessonID !== deletedLessonId));
  };

  const handleLessonUpdated = (updatedLesson) => {
    setLessons(lessons.map((lesson) => (lesson.LessonID === updatedLesson.LessonID ? updatedLesson : lesson)));
    setFilteredLessons(filteredLessons.map((lesson) => (lesson.LessonID === updatedLesson.LessonID ? updatedLesson : lesson)));
    setFilteredTestLessons(filteredTestLessons.map((lesson) => (lesson.LessonID === updatedLesson.LessonID ? updatedLesson : lesson)));
  };

  const handleLessonCreated = (newLesson) => {
    setLessons([...lessons, newLesson]);
    setFilteredLessons([...filteredLessons, newLesson]);
    setFilteredTestLessons([...filteredTestLessons, newLesson]);
  };

  const userColumns = [
    {
      title: t("username"),
      dataIndex: "username",
      key: "username",
      render: (username, record) => (
        <div className="user-column">
          <div className="user-avatar-wrapper">
            <img
              src={
                record.img
                  ? `${import.meta.env.VITE_API_URL}/static/${record.img}`
                  : defaultImg
              }
              alt="User Avatar"
              className="user-avatar"
              onError={(e) => {
                console.log(`Ошибка загрузки изображения для пользователя ${record.UserID}, переключение на запасное`);
                e.target.src = defaultImg;
              }}
              onLoad={() => console.log(`Изображение успешно загружено для пользователя ${record.UserID}`)}
            />
          </div>
          <span>{username}</span>
        </div>
      ),
    },
    {
      title: t("email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("password"),
      dataIndex: "password",
      key: "password",
      render: () => "****",
    },
    {
      title: t("progress"),
      dataIndex: "progress",
      key: "progress",
      render: (progress) => {
        const completedLessons = progress ? progress.filter((p) => p.completed).length : 0;
        const totalLessons = progress ? progress.length : 0;
        const completedLessonTitles = progress
          ? progress
              .filter((p) => p.completed)
              .map((p) => p.Lesson?.title || `Lesson ${p.LessonID}`)
              .join(", ")
          : t("no_completed_lessons");

        return (
          <Tooltip title={`${t("completed_lessons")}: ${completedLessonTitles}`}>
            <span>{`${completedLessons}/${totalLessons} ${t("lessons_completed")}`}</span>
          </Tooltip>
        );
      }
    },
    {
      title: t("actions"),
      key: "actions",
      render: (text, record) => (
        <Button className="delete-button" onClick={() => handleDeleteUser(record.UserID)}>
          {t("delete")}
        </Button>
      ),
    },
  ];

  return (
    <div className="admin-page">
      {/* Секция с пользователями */}
      <h1>{t("admin_panel")}</h1>
      <Space direction="vertical" style={{ width: "100%", marginBottom: 16 }}>
        <Input
          placeholder={t("search_users")}
          value={searchUserTerm}
          onChange={(e) => handleSearchUsers(e.target.value)}
          className="search-input"
        />
      </Space>
      <div className={`table-container ${isUsersExpanded ? "expanded" : "collapsed"}`}>
        <Table
          dataSource={displayedUsers}
          columns={userColumns}
          rowKey="UserID"
          pagination={false}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                styles={{
                  image: {
                    filter: theme === "light" ? "invert(0)" : "invert(1)",
                  },
                }}
                description={t("no_data_message")}
                style={{
                  color: theme === "light" ? "var(--text-light)" : "var(--text-dark)",
                }}
              />
            ),
          }}
        />
      </div>
      {filteredUsers.length > 2 && (
        <Button
          type="link"
          onClick={() => setIsUsersExpanded(!isUsersExpanded)}
          style={{ marginTop: 16 }}
          className="expand-button"
        >
          {isUsersExpanded ? (
            <>
              {t("collapse")} <UpOutlined />
            </>
          ) : (
            <>
              {t("expand")} <DownOutlined />
            </>
          )}
        </Button>
      )}

      {/* Секция с уроками */}
      <h2 style={{ marginTop: "40px" }}>{t("lessons_management")}</h2>
      <div
        style={{
          width: "100%",
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        className="custom-space-lesson"
      >
        <Input
          placeholder={t("search_lessons")}
          value={searchLessonTerm}
          onChange={(e) => handleSearchLessons(e.target.value)}
          className="search-input input-search-space"
        />
        <Button
          type="primary"
          onClick={() => setIsAddModalVisible(true)}
          className="button-space"
          style={{ minWidth: "100px" }}
        >
          {t("add_lesson")}
        </Button>
      </div>
      <div className="card-container">
        {filteredLessons.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px", color: theme === "light" ? "var(--text-dark)" : "var(--text-light)" }}>
            {t("no_lessons_found")}
          </div>
        ) : (
          <div className="swiper-wrapper">
            <div className="swiper-nav-prev" />
            <Swiper
              ref={swiperRef}
              modules={[Navigation, Pagination]}
              spaceBetween={10}
              slidesPerView={3}
              navigation={{
                prevEl: ".swiper-nav-prev",
                nextEl: ".swiper-nav-next",
              }}
              pagination={{ clickable: true }}
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 5 },
                768: { slidesPerView: 2, spaceBetween: 5 },
                1024: { slidesPerView: 3, spaceBetween: 5 },
                1480: { slidesPerView: 4, spaceBetween: 5 },
                1720: { slidesPerView: 5, spaceBetween: 5 },
              }}
            >
              {filteredLessons.map((lesson) => (
                <SwiperSlide key={lesson.LessonID}>
                  <CourseCard
                    lesson={lesson}
                    onEdit={() => handleEditLesson(lesson)}
                    onDelete={() => handleDeleteLesson(lesson)}
                    progress={[]}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="swiper-nav-next" />
          </div>
        )}
      </div>

      {/* Секция Конструктор тестов */}
      <h2 style={{ marginTop: "40px" }}>{t("test_constructor")}</h2>
      <Space direction="vertical" style={{ width: "100%", marginBottom: 16 }}>
        <Input
          placeholder={t("search_lessons")}
          value={searchTestTerm}
          onChange={(e) => handleSearchTests(e.target.value)}
          className="search-input"
        />
      </Space>
      <div className="test-constructor-grid">
        {filteredTestLessons.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px", color: theme === "light" ? "var(--text-dark)" : "var(--text-light)" }}>
            {t("no_lessons_found")}
          </div>
        ) : (
          filteredTestLessons.map((lesson) => (
            <div
              key={lesson.LessonID}
              className={`lesson-card ${selectedLesson && selectedLesson.LessonID === lesson.LessonID ? "active" : ""}`}
              onClick={() => handleCardClick(lesson)}
            >
              <h3
                style={{
                  cursor: "pointer",
                  color: theme === "light" ? "var(--text-dark)" : "var(--text-light)",
                }}
              >
                {lesson.title}
              </h3>
              {selectedLesson && selectedLesson.LessonID === lesson.LessonID && (
                <Select
                  placeholder={t("select_section")}
                  onChange={handleSelectSection}
                  value={selectedSection}
                  style={{ width: "100%", marginBottom: "10px" }}
                >
                  {lesson.sections.map((section, index) => (
                    <Option key={index} value={index}>
                      {section.title || `Section ${index + 1}`}
                    </Option>
                  ))}
                </Select>
              )}
              {selectedLesson && selectedLesson.LessonID === lesson.LessonID && selectedSection !== null && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {!selectedTest && (
                    <Button
                      type="default"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddTest();
                      }}
                      style={{ width: "100%", marginRight: "0" }}
                    >
                      {t("add_test")}
                    </Button>
                  )}
                  {selectedTest && (
                    <>
                      <Button
                        type="default"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTestDetails();
                        }}
                        style={{ width: "100%", marginRight: "0" }}
                      >
                        {t("edit_test_details")}
                      </Button>
                      <Button
                        type="default"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDeleteTestModal();
                        }}
                        style={{ width: "100%", marginRight: "0" }}
                      >
                        {t("delete_test")}
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Модальные окна */}
      <ModalLessonDelete
        open={isDeleteModalVisible}
        onClose={() => {
          setIsDeleteModalVisible(false);
          setSelectedLesson(null);
        }}
        lesson={selectedLesson}
        onLessonDeleted={handleLessonDeleted}
      />

      <ModalLessonEdit
        open={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          setSelectedLesson(null);
        }}
        lesson={selectedLesson}
        onLessonUpdated={handleLessonUpdated}
      />

      <ModalLessonAdd
        open={isAddModalVisible}
        onClose={() => {
          setIsAddModalVisible(false);
        }}
        onLessonCreated={handleLessonCreated}
      />

      <ModalTestAdd
        open={isTestModalVisible}
        onClose={() => {
          setIsTestModalVisible(false);
          setSelectedSection(null);
        }}
        onTestCreated={handleTestCreated}
        lesson={selectedLesson}
        sectionIndex={selectedSection}
        testToEdit={null}
      />

      <ModalTestEdit
        open={isTestEditModalVisible}
        onClose={() => {
          setIsTestEditModalVisible(false);
          if (selectedSection !== null) {
            loadTestsForLesson(selectedLesson.LessonID);
          }
        }}
        test={selectedTest}
        onTestUpdated={() => loadTestsForLesson(selectedLesson.LessonID)}
        selectedSection={selectedSection}
        selectedLesson={selectedLesson}
      />

      <ModalTestDelete
        open={isDeleteTestModalVisible}
        onClose={() => setIsDeleteTestModalVisible(false)}
        test={selectedTest}
        onTestDeleted={() => {
          setSelectedTest(null);
          if (selectedSection !== null) {
            loadTestsForLesson(selectedLesson.LessonID);
          }
        }}
      />
    </div>
  );
};

export default Admin;