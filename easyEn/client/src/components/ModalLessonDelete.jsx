import React from "react";
import { Button, message } from "antd";
import { deleteLesson } from "../http/LessonApi";
import { jwtDecode } from "jwt-decode";

export default function ModalLessonDelete({ visible, onClose, lesson, onLessonDeleted }) {
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
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

    setLoading(true);
    try {
      await deleteLesson(lesson.LessonID);
      message.success("Урок успешно удален");
      onLessonDeleted(lesson.LessonID);
      onClose();
    } catch (error) {
      message.error("Ошибка при удалении урока");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-main">
        <div className="modal-header">
          <h2>Удалить урок</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <p>Вы уверены, что хотите удалить урок "{lesson.title}"?</p>
          <p>Это действие нельзя отменить.</p>
        </div>

        <div className="modal-footer">
          <Button onClick={onClose} disabled={loading}>
            Отмена
          </Button>
          <Button
            type="primary"
            danger
            onClick={handleDelete}
            loading={loading}
          >
            Удалить
          </Button>
        </div>
      </div>
    </div>
  );
}