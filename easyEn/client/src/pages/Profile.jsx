import { useEffect, useState } from "react";
import { fetchProfile } from "../http/ProfileApi";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import Auth from "./Auth";
import { UserContext } from "../context/UserContext";
import SettingsNavigation from "../components/SettingNavigation";
import { Button } from "antd";
import  { Input } from "antd";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Состояние редактирования
  const [editedProfile, setEditedProfile] = useState({});
  const { isAuth } = useContext(AuthContext)
  const { user } = useContext(UserContext)


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
      console.log("Декодированный токен:", decodedToken); // Отладочный вывод
      
      const userId = decodedToken.UserID || user?.UserID;
      if (!userId) throw new Error("ID пользователя не найден");

      fetchProfile(userId)
        .then(data => {
          console.log("Данные профиля:", data); // Отладочный вывод
          setProfile(data);
          setEditedProfile(data);
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

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Здесь можно добавить логику сохранения на сервер
      setProfile(editedProfile);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
    return <div>Профиль не найден</div>;
  }

  return (
    <div className="user-cont"> 
     <SettingsNavigation /> {/* Левая панель настроек */}
      <div className="user-info">
        <h1>Personal Info</h1>
        <div className="user-img">
          <img src="/src/assets/user.svg" alt="User" />
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
          {/* <div className="user-bio">
            <label>About me</label>
            {isEditing ? (
              <Input value={editedProfile.about}
              onChange={ (e)=> handleInputChange("about", e.target.value)}
              className="edit-input"
            />
            ): (
              <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corporis, aperiam aut. Reiciendis corrupti dolor ipsum odio porro sunt ratione maiores?</p>
            )}
          
          </div> */}
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