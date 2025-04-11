import { useEffect, useState, useContext } from "react";
import { fetchProfile, updateProfile } from "../http/ProfileApi";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";
import SettingsNavigation from "../components/SettingNavigation";
import { Button, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export default function Profile() {
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

  useEffect(() => {
    if (!isAuth) {
      setError("Требуется авторизация");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError("Токен не найден");
      setLoading(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      console.log("Декодированный токен:", decodedToken);
      const userId = decodedToken.UserID || user?.UserID;
      if (!userId) throw new Error("ID пользователя не найден");

      setUserId(userId);

      fetchProfile(userId)
        .then(data => {
          console.log("Данные профиля:", data);
          setProfile(data);
          setEditedProfile(data);
          const imageUrl = data.img ? `${import.meta.env.VITE_API_URL}/static/${data.img}` : null;
          console.log("Начальный URL изображения:", imageUrl);
          setPreviewUrl(imageUrl);
        })
        .catch(err => {
          console.error("Ошибка загрузки:", err);
          setError("Ошибка загрузки профиля");
        })
        .finally(() => setLoading(false));
    } catch (err) {
      console.error("Ошибка декодирования:", err);
      setError("Неверный токен");
      setLoading(false);
    }
  }, [isAuth, user]);

  const handleEditToggle = async () => {
    if (isEditing) {
      if (!userId) {
        message.error("ID пользователя не определён");
        return;
      }
      try {
        const formData = new FormData();
        formData.append("username", editedProfile.username || "");
        formData.append("email", editedProfile.email || "");
        if (file) {
          formData.append("img", file);
        }

        console.log("Отправляемые данные:", {
          userId,
          username: editedProfile.username,
          email: editedProfile.email,
          file: file ? file.name : "Нет файла",
        });

        const updatedProfile = await updateProfile(userId, formData);
        setProfile(updatedProfile);
        setFile(null);
        const newImageUrl = updatedProfile.img
          ? `${import.meta.env.VITE_API_URL}/static/${updatedProfile.img}?t=${Date.now()}`
          : null;
        console.log("Новый URL изображения:", newImageUrl);

        try {
          const res = await fetch(newImageUrl, { method: 'HEAD' });
          if (!res.ok) {
            throw new Error(`Сервер вернул статус: ${res.status}`);
          }
          console.log("Изображение доступно:", newImageUrl);
          setPreviewUrl(newImageUrl);
        } catch (err) {
          console.error("Ошибка проверки изображения:", err.message);
          message.warning("Изображение сохранено, но недоступно на сервере");
        }

        message.success("Профиль успешно обновлен");
      } catch (err) {
        console.error("Ошибка при сохранении:", err.response?.data || err);
        message.error(`Ошибка при сохранении профиля: ${err.response?.data?.message || err.message}`);
      }
    }
    setIsEditing(!isEditing);
  };

  const beforeUpload = (file) => {
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;
  if (!profile) return <div>Профиль не найден</div>;

  return (
    <div className="user-cont">
      <SettingsNavigation />
      <div className="user-info">
        <h1>Personal Info</h1>
        <div className="user-img">
          {/* Изображение аватара с круглой формой определяется в CSS */}
          <img
            src={previewUrl || "/src/assets/user.svg"}
            alt="User"
            onError={(e) => {
              console.error("Ошибка загрузки изображения:", previewUrl);
              e.target.src = "/src/assets/user.svg";
            }}
          />
          {isEditing && (
            <Upload
              beforeUpload={beforeUpload}
              showUploadList={false}
              accept="image/*"
              className="upload-img"
            >
              <Button icon={<UploadOutlined />}>
                {file ? file.name : "Изменить фото"}
              </Button>
            </Upload>
          )}
        </div>
        <div className="user-desc">
          <div className="user-name">
            <label>Имя</label>
            {isEditing ? (
              <Input
                value={editedProfile.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className="edit-input"
              />
            ) : (
              <p>{profile.username}</p>
            )}
          </div>
          <div className="user-email">
            <label>Email</label>
            {isEditing ? (
              <Input
                value={editedProfile.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="edit-input"
              />
            ) : (
              <p>{profile.email}</p>
            )}
          </div>
          <Button
            type={isEditing ? "primary" : "default"}
            onClick={handleEditToggle}
            className="edit-button"
          >
            {isEditing ? "Сохранить" : "Редактировать"}
          </Button>
        </div>
      </div>
    </div>
  );
}