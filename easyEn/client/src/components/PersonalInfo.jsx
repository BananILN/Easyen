import React, { useEffect, useState, useContext } from "react";
import { fetchProfile, updateProfile } from "../http/ProfileApi";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";
import { Button, Input, message, Skeleton } from "antd";
import { ManOutlined, WomanOutlined } from "@ant-design/icons";
import { useTranslation } from 'react-i18next';

export default function PersonalInfo() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [userId, setUserId] = useState(null);
  const { isAuth } = useContext(AuthContext);
  const { user } = useContext(UserContext);
  const { t } = useTranslation();

  useEffect(() => {
    if (!isAuth) {
      setError(t('authorization_required'));
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError(t('token_not_found'));
      setLoading(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.UserID || user?.UserID;
      if (!userId) throw new Error(t('user_id_not_defined'));

      setUserId(userId);

      fetchProfile(userId)
        .then((data) => {
          setProfile(data);
          setEditedProfile(data);
          const imageUrl = data.img ? `${import.meta.env.VITE_API_URL}/static/${data.img}` : null;
          setPreviewUrl(imageUrl);
        })
        .catch((err) => {
          console.error("Ошибка загрузки:", err);
          setError(t('profile_not_found'));
        })
        .finally(() => setLoading(false));
    } catch (err) {
      console.error("Ошибка декодирования:", err);
      setError(t('invalid_token'));
      setLoading(false);
    }
  }, [isAuth, user]);

  const handleEditToggle = async () => {
    if (isEditing) {
      if (!userId) {
        message.error(t('user_id_not_defined'));
        return;
      }
      try {
        const formData = new FormData();
        formData.append("username", editedProfile.username || "");
        formData.append("email", editedProfile.email || "");
        formData.append("about", editedProfile.about || "");
        formData.append("gender", editedProfile.gender || "male");
        if (file) {
          formData.append("img", file);
        }

        const updatedProfile = await updateProfile(userId, formData);
        setProfile(updatedProfile);
        setFile(null);
        const newImageUrl = updatedProfile.img
          ? `${import.meta.env.VITE_API_URL}/static/${updatedProfile.img}?t=${Date.now()}`
          : null;
        setPreviewUrl(newImageUrl);

        try {
          const res = await fetch(newImageUrl, { method: "HEAD" });
          if (!res.ok) throw new Error(t('image_saved_but_unavailable'));
          setPreviewUrl(newImageUrl);
        } catch (err) {
          console.error("Ошибка проверки изображения:", err.message);
          message.warning(t('image_saved_but_unavailable'));
        }

        message.success(t('profile_update_success'));
      } catch (err) {
        console.error("Ошибка при сохранении:", err.response?.data || err);
        message.error(t('profile_update_error'));
      }
    }
    setIsEditing(!isEditing);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => setPreviewUrl(event.target.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenderChange = (newGender) => {
    handleInputChange("gender", newGender);
  };

  if (loading) {
    return (
      <div className="user-info" style={{ minHeight: "400px" }}>
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    );
  }
  if (error) return <div>{error}</div>;
  if (!profile) return <div>{t('profile_not_found')}</div>;

  return (
    <div className="user-info" style={{ minHeight: "400px" }}>
      <h1>{t('personal_info')}</h1>
      <div className="user-img">
        <div className="avatar-wrapper">
          <img
            src={previewUrl || "/src/assets/user.svg"}
            alt="User"
            onError={(e) => {
              console.error("Ошибка загрузки изображения:", previewUrl);
              e.target.src = "/src/assets/user.svg";
            }}
          />
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="avatar-upload-input"
            />
          )}
          {isEditing && (
            <div className="avatar-overlay">
              <span>
                <svg width="84" height="84" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <image href="/src/assets/changeImg.png" width="24" height="24" />
                </svg>
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="user-desc">
        <div className="user-name">
          <label>{t('name_label')}</label>
          {isEditing ? (
            <Input
              value={editedProfile.username || ""}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className="edit-input"
            />
          ) : (
            <p>{profile.username}</p>
          )}
        </div>
        <div className="user-email">
          <label>{t('email_label')}</label>
          {isEditing ? (
            <Input
              value={editedProfile.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="edit-input"
            />
          ) : (
            <p>{profile.email}</p>
          )}
        </div>
        <div className="user-about">
          <label>{t('about_label')}</label>
          {isEditing ? (
            <Input.TextArea
              value={editedProfile.about || ""}
              onChange={(e) => handleInputChange("about", e.target.value)}
              className="edit-input about-textarea"
              rows={4}
              placeholder={t('about_placeholder')}
              autoSize={{ minRows: 4, maxRows: 10 }}
            />
          ) : (
            <p>{profile.about || t('about_not_specified')}</p>
          )}
        </div>
        <div className="user-gender">
          <label>{t('gender_label')}</label>
          {isEditing ? (
            <div className="gender-container-profile">
              <div className="gender-icons">
                <ManOutlined style={{ marginRight: 0, color: "#1890ff" }} />
                <WomanOutlined style={{ marginLeft: -2, marginRight: 0, color: "#ff4d4f" }} />
              </div>
              <div className="gender-buttons">
                <button
                  type="button"
                  className={`gender-button male ${editedProfile.gender === "male" ? "selected" : ""}`}
                  onClick={() => handleGenderChange("male")}
                >
                  {t('gender_male')}
                </button>
                <button
                  type="button"
                  className={`gender-button female ${editedProfile.gender === "female" ? "selected" : ""}`}
                  onClick={() => handleGenderChange("female")}
                >
                  {t('gender_female')}
                </button>
              </div>
            </div>
          ) : (
            <p>{profile.gender === "male" ? t('gender_male') : t('gender_female')}</p>
          )}
        </div>
        <Button
          type={isEditing ? "primary" : "default"}
          onClick={handleEditToggle}
          className="edit-button"
        >
          {isEditing ? t('save') : t('edit')}
        </Button>
      </div>
    </div>
  );
}