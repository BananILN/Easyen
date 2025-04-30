import { message } from "antd";
import React, { useState } from "react";
import { createLesson } from "../http/LessonApi";
import {Button, Input, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons"


export default function ModalLessonAdd({visible, onClose, onLessonCreated}){

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [file,setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () =>{

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
        }

        const trimmedTitle = title.trim();

          const isValidTitle = /^[a-zA-ZА-Яа-я0-9\s.,!?:-]{3,1000}$/.test(trimmedTitle);
          if (!isValidTitle) {
            message.error(
              "Название должно содержать от 3 до 100 символов, без специальных символов типа @#$%^&*"
            );
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
      
            const newLesson = await createLesson(formData);
            message.success("Урок успешно создан");

            onLessonCreated(newLesson);
            handleClose();

          } catch (error) {
            message.error("Ошибка при создании урока");
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
            <h2>Добавить новый урок</h2>
            <button className="close-btn" onClick={handleClose}>
              &times;
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
              Создать урок
            </Button>
          </div>
        </div>
      </div>
    )
}