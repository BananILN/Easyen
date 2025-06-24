import { message, Button, Input, Upload, Form, Modal, Space, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { updateLesson } from "../http/LessonApi";
import { UploadOutlined, CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";

const ModalLessonEdit = ({ open, onClose, lesson, onLessonUpdated }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFormChanged, setIsFormChanged] = useState(false);

  useEffect(() => {
    if (open && lesson) {
      let normalizedSections = [];
      if (lesson.sections && Array.isArray(lesson.sections)) {
        normalizedSections = lesson.sections.map((section, index) => ({
          title: section.title || `Section ${index + 1}`,
          content: section.content || "",
        }));
      }
      form.setFieldsValue({
        title: lesson.title || "",
        content: lesson.content || "",
        sections: normalizedSections,
      });
      setUploadedFileName(lesson.img || null);
      setSelectedFile(null);
      setIsFormChanged(false);
    } else {
      form.resetFields();
      setUploadedFileName(null);
      setSelectedFile(null);
      setIsFormChanged(false);
    }
  }, [open, lesson, form]);

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("Требуется авторизация");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.RoleID !== 2) {
        message.error("Недостаточно прав");
        return;
      }
    } catch (e) {
      message.error("Ошибка проверки прав доступа");
      return;
    }
    if (!values.title?.trim()) {
      message.error("Введите название урока");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", values.content);
      formData.append("sections", JSON.stringify(values.sections));
      if (selectedFile) {
        formData.append("img", selectedFile);
        console.log("Uploading new image:", selectedFile.name, selectedFile);
      } else {
        console.log("No new image uploaded, keeping existing:", lesson.img);
      }
      console.log("FormData entries:", Array.from(formData.entries()));
      const updatedLesson = await updateLesson(lesson.LessonID, formData);
      message.success("Урок успешно обновлен");
      if (updatedLesson.img) {
        updatedLesson.imgUrl = `http://localhost:5000/static/${updatedLesson.img}?t=${Date.now()}`;
      }
      onLessonUpdated(updatedLesson);
      onClose();
    } catch (error) {
      message.error("Ошибка при обновлении урока: " + (error.response?.data?.message || error.message));
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = ({ file, fileList }) => {
    console.log("File change event:", file, fileList);
    setFileLoading(true);
    if (file && file.status !== "removed") {
      setUploadedFileName(file.name);
      setSelectedFile(file.originFileObj || file);
      setFileLoading(false);
    } else {
      setUploadedFileName(lesson?.img || null);
      setSelectedFile(null);
      setFileLoading(false);
    }
    setIsFormChanged(true);
  };

  const handleClose = () => {
    form.resetFields();
    setUploadedFileName(lesson?.img || null);
    setSelectedFile(null);
    setIsFormChanged(false);
    onClose();
  };

  const handleValuesChange = (changedValues, allValues) => {
    const hasTitle = allValues.title?.trim().length > 0;
    const hasContent = allValues.content?.trim().length > 0;
    const hasSections = Array.isArray(allValues.sections) 
      ? allValues.sections.some(section => 
          (section?.title?.trim()?.length > 0 || section?.content?.trim()?.length > 0)
        )
      : false;
    setIsFormChanged(hasTitle || hasContent || hasSections || !!selectedFile);
  };

  return (
    <Modal
      open={open}
      title="Редактировать урок"
      onCancel={handleClose}
      footer={null}
      className="modal-main"
      width={800}
    >
      <Form 
        form={form}
        layout="vertical" 
        onFinish={handleSubmit} 
        initialValues={{ sections: [] }}
        onValuesChange={handleValuesChange}
      >
        <Form.Item
          name="title"
          label="Название урока"
          rules={[{ required: true, message: "Введите название урока" }]}
        >
          <Input placeholder="Введите название" />
        </Form.Item>
        <Form.Item
          name="content"
          label="Описание урока"
          rules={[{ required: true, message: "Введите описание" }]}
        >
          <Input.TextArea placeholder="Введите описание" rows={4} />
        </Form.Item>
        <Form.Item label="Секции урока">
          <Form.List name="sections">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => {
                  const { key, name, ...restField } = field; // Извлекаем key отдельно
                  return (
                    <Space
                      key={key} // Ключи передаем явно
                      direction="vertical"
                      style={{ display: "flex", marginBottom: 8 }}
                      align="start"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "title"]}
                        fieldKey={[field.fieldKey, "title"]}
                        rules={[{ required: true, message: "Введите название секции" }]}
                      >
                        <Input placeholder="Название секции" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "content"]}
                        fieldKey={[field.fieldKey, "content"]}
                        rules={[{ required: true, message: "Введите содержимое секции" }]}
                      >
                        <Input.TextArea placeholder="Содержание секции" rows={3} />
                      </Form.Item>
                      <Button type="danger" onClick={() => remove(name)}>
                        Удалить секцию
                      </Button>
                    </Space>
                  );
                })}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    Добавить секцию
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>
        <Form.Item
          label="Изображение"
          name="file"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            const files = Array.isArray(e) ? e : e?.fileList || [];
            console.log("getValueFromEvent files:", files);
            return files;
          }}
        >
          <Upload
            beforeUpload={() => false}
            onChange={handleFileChange}
            maxCount={1}
            accept="image/*"
            fileList={form.getFieldValue("file") || []}
            showUploadList={false}
          >
            <Button icon={fileLoading ? <Spin indicator={<LoadingOutlined />} /> : uploadedFileName ? <CheckCircleOutlined style={{ color: 'green' }} /> : <UploadOutlined />}>
              {fileLoading ? "Загрузка..." : uploadedFileName ? `Загружено: ${uploadedFileName}` : "Выберите файл"}
            </Button>
          </Upload>
        </Form.Item>
        {uploadedFileName && (
          <div style={{ marginTop: 8, color: 'green', fontSize: '0.9rem' }}>
            Файл: {uploadedFileName}
          </div>
        )}
        {lesson && lesson.img && !uploadedFileName && (
          <div style={{ marginTop: 8, color: 'var(--text-light)', fontSize: '0.9rem' }}>
            Текущее изображение: {lesson.img}
          </div>
        )}
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading} disabled={!isFormChanged || loading}>
              Сохранить
            </Button>
            <Button onClick={handleClose}>Отмена</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalLessonEdit;