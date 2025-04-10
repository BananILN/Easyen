import { useEffect, useState } from "react";
import { fetchProfile } from "../http/ProfileApi";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import Auth from "./Auth";
import { UserContext } from "../context/UserContext";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      <div className="setting-navigation">
        <h1>Setting</h1>
          <ul>
            <li>Personal Info</li>
            <li>Appereance</li>
          </ul>

      </div>
      
    <div className="user-info">
      <div className="user-img">
          <img src="/src/assets/user.svg" alt="User" />
        </div>
        <div className="user-desc">
          <div className="user-name">
            {profile.username} 
          </div>
          <div className="user-email">
            {profile.email} 
          </div>
          <div className="user-bio">
            Made design, api queries, statistics, sprint game, did some layout and supervised development.
          </div>
        </div>
      </div>
    </div>
      
  );
}