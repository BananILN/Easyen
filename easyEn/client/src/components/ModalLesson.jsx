import { message, Button, Input, Upload, Form, Modal, Space, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next"; // Добавляем useTranslation
import { createLesson } from "../http/LessonApi";
import { UploadOutlined, CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";

const ModalLessonAdd = ({ open, onClose, onLessonCreated }) => {
  const { t } = useTranslation(); // Добавляем хук перевода
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (open) {
      form.resetFields();
      setUploadedFileName(null);
      setSelectedFile(null);
    } else {
      form.resetFields();
      setUploadedFileName(null);
      setSelectedFile(null);
    }
  }, [open, form]);

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error(t("authorization_required"));
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.RoleID !== 2) {
        message.error(t("access_denied"));
        return;
      }
    } catch (e) {
      message.error(t("access_check_error"));
      return;
    }

    const trimmedTitle = values.title.trim();
    if (!trimmedTitle) {
      message.error(t("lesson_title_required"));
      return;
    }
    const isValidTitle = /^[a-zA-ZА-Яа-я0-9\s.,!?;-]{3,100}$/.test(trimmedTitle);
    if (!isValidTitle) {
      message.error(t("invalid_lesson_title"));
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", trimmedTitle);
      formData.append("content", values.content || "");
      formData.append("sections", JSON.stringify(values.sections || []));
      if (selectedFile) {
        formData.append("img", selectedFile);
      }

      const newLesson = await createLesson(formData);
      message.success(t("lesson_created_success"));
      onLessonCreated(newLesson);
      onClose();
    } catch (error) {
      message.error(`${t("error_creating_lesson")}: ${error.response?.data?.message || error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = ({ file, fileList }) => {
    setFileLoading(true);
    if (file && file.status !== "removed") {
      setUploadedFileName(file.name);
      setSelectedFile(file.originFileObj || file);
      setFileLoading(false);
    } else {
      setUploadedFileName(null);
      setSelectedFile(null);
      setFileLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setUploadedFileName(null);
    setSelectedFile(null);
    onClose();
  };

  const isFormValid =
    form.getFieldsError().every((field) => !field.errors.length) &&
    form.isFieldsTouched(true) &&
    form.getFieldValue("title")?.trim() &&
    form.getFieldValue("content");

  return (
    <Modal
      open={open}
      title={t("add_lesson")} 
      onCancel={handleClose}
      footer={null}
      className="modal-main"
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ sections: [] }}
      >
        <Form.Item
          name="title"
          label={t("lesson_title")} 
          rules={[{ required: true, message: t("please_input_lesson_title") }]}
        >
          <Input placeholder={t("enter_lesson_title")} />
        </Form.Item>

        <Form.Item
          name="content"
          label={t("lesson_description")} 
          rules={[{ required: true, message: t("please_input_lesson_description") }]}
        >
          <Input.TextArea placeholder={t("enter_lesson_description")} rows={4} />
        </Form.Item>

        <Form.Item label={t("lesson_sections")}> 
          <Form.List name="sections">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Space
                    key={field.key}
                    direction="vertical"
                    style={{ display: "flex", marginBottom: 8 }}
                    align="start"
                  >
                    <Form.Item
                      {...field}
                      name={[field.name, "title"]}
                      fieldKey={[field.fieldKey, "title"]}
                      rules={[{ required: true, message: t("please_input_section_title") }]}
                    >
                      <Input placeholder={t("enter_section_title")} />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, "content"]}
                      fieldKey={[field.fieldKey, "content"]}
                      rules={[{ required: true, message: t("please_input_section_content") }]}
                    >
                      <Input.TextArea placeholder={t("enter_section_content")} rows={3} />
                    </Form.Item>
                    <Button type="danger" onClick={() => remove(field.name)}>
                      {t("remove_section")}
                    </Button>
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    {t("add_section")} 
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>

        <Form.Item
          label={t("upload_image")} 
          name="file"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            const files = Array.isArray(e) ? e : e?.fileList || [];
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
            <Button
              icon={
                fileLoading ? (
                  <Spin indicator={<LoadingOutlined />} />
                ) : uploadedFileName ? (
                  <CheckCircleOutlined style={{ color: "green" }} />
                ) : (
                  <UploadOutlined />
                )
              }
            >
              {fileLoading
                ? t("uploading")
                : uploadedFileName
                ? `${t("uploaded")}: ${uploadedFileName}`
                : t("select_file")}
            </Button>
          </Upload>
        </Form.Item>
        {uploadedFileName && (
          <div style={{ marginTop: 8, color: "green", fontSize: "0.9rem" }}>
            {t("file")}: {uploadedFileName}
          </div>
        )}

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={!isFormValid}
            >
              {t("create_lesson")} 
            </Button>
            <Button onClick={handleClose}>{t("cancel")}</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalLessonAdd;