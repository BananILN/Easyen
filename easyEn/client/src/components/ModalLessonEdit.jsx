import { message } from "antd";
import React, { useState, useEffect } from "react";
import { updateLesson } from "../http/LessonApi";
import { Button, Input, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";

export default function ModalLessonEdit({ visible, onClose, lesson, onLessonUpdated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lesson) {
      setTitle(lesson.title || "");
      setContent(lesson.content || "");
      setFile(null);
    }
  }, [lesson]);

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Требуется авторизация');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.RoleID !== 2) {
        message.error('Недостаточно прав');
        return;
      }
    } catch (e) {
      message.error('Ошибка проверки прав доступа');
      return;
    }

    if (!title.trim()) {
      message.error("Введите название урока");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (file) {
        formData.append("img", file);
      }

      const updatedLesson = await updateLesson(lesson.LessonID, formData);
      message.success("Урок успешно обновлен");

      if (updatedLesson.img) {
        updatedLesson.imgUrl = `http://localhost:5000/static/${updatedLesson.img}?t=${new Date().getTime()}`;
      }

      onLessonUpdated(updatedLesson);
      handleClose();
    } catch (error) {
      message.error("Ошибка при обновлении урока");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
    setFile(null);
    onClose();
  };

  const beforeUpload = (file) => {
    setFile(file);
    return false;
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-main">
        <div className="modal-header">
          <h2>Редактировать урок</h2>
          <button className="close-btn" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Название урока</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название"
            />
          </div>

          <div className="form-group">
            <label>Описание урока</label>
            <Input.TextArea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Введите описание"
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>Изображение</label>
            <Upload
              beforeUpload={beforeUpload}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>
                {file ? file.name : "Выберите файл"}
              </Button>
            </Upload>
            {lesson.img && !file && (
              <p>Текущее изображение: {lesson.img}</p>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <Button onClick={handleClose}>Отмена</Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={!title.trim()}
          >
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  );
}