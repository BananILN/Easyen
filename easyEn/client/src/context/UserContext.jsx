import { createContext, useState,useEffect } from "react";
import { check } from "../http/userApi";
import { fetchProfile } from "../http/ProfileApi";

export const UserContext = createContext();

export const UserProvider = ({ children }) =>{

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      check()
        .then(data => {
          const userId = data.UserID;
          return fetchProfile(userId); // Получаем полные данные профиля
        })
        .then(profileData => {
          setUser(profileData); // Устанавливаем данные с img
          console.log("Profile data set in UserContext:", profileData);
        })
        .catch(err => {
          console.error("Ошибка проверки авторизации или профиля:", err);
          setUser(null);
        })
        .finally(() => setLoading(false));
    }, []);
   

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
          {children}
        </UserContext.Provider>
      );
}