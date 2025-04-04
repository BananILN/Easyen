import { useEffect, useState } from "react";
import { fetchProfile } from "../http/ProfileApi";
import { jwtDecode } from "jwt-decode";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);

      const userId = decodedToken.UserID; 
      if (!userId) {
        setError("ID пользователя не найден в токене");
        setLoading(false);
        return;
      }

      fetchProfile(userId)
        .then(data => {
          setProfile(data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Ошибка при загрузке профиля:", error);
          setError("Не удалось загрузить профиль");
          setLoading(false);
        });
    } else {
      setError("Токен не найден");
      setLoading(false);
    }
  }, []);

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
  );
}