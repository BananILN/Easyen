import { NavLink, useNavigate, Navigate } from "react-router";
import ProfileIcon from "../assets/Profile.svg?react";
import { NAV_ITEMS } from "..";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext"; 
import { HOME_ROUTE } from "..";
import { useEffect } from "react";
import ExitIcon from "../assets/exit.svg?react"


export default function Header() {
    const { isAuth, logout } = useContext(AuthContext); // Получаем isAuth и logout из AuthContext
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = (e) => {
      e.preventDefault(); // Предотвращаем стандартное поведение
      console.log("Выход из системы"); 
      logout();
      navigate(HOME_ROUTE, { replace: true }); // Перенаправляем на главную
  };
//   useEffect(() => {
//     console.log("isAuth изменился:", isAuth);
// }, []);

        const profile = NAV_ITEMS.find(item => item.path ==="/profile");
        return (
            <header className="header">
              {isAuth ? (
                // Если пользователь авторизован,  и кнопку выходпоказываем профильа
                <div className="header-auth">
                  {profile && (
                    <NavLink
                      to={profile.path}
                      className={({ isActive }) =>
                        `header-profile ${isActive ? "active-item" : ""}`
                      }
                    >
                      <ProfileIcon />
                      {profile.title} {/* Отображаем имя или email пользователя  user?.name || user?.email*/}
                    </NavLink>
                  )}
                      
                
                      <NavLink 
                        to={HOME_ROUTE} 
                        onClick={handleLogout}
                        className="logout-button"
                    >
                        <ExitIcon />
                    </NavLink>
                
                </div>
              ) : (
                // Если пользователь не авторизован, показываем кнопку авторизации
                <NavLink to="/login" className="login-button">
                  Войти
                </NavLink>
              )}
            </header>
          );
}