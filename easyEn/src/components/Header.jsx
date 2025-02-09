import { NavLink } from "react-router";
import ProfileIcon from "../assets/Profile.svg?react";
import { NAV_ITEMS } from "..";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext"; 

export default function Header() {
    const { isAuth, logout } = useContext(AuthContext); // Получаем isAuth и logout из AuthContext
    const { user } = useContext(UserContext);

        const profile = NAV_ITEMS.find(item => item.path ==="/profile");
        return (
            <header className="header">
              {isAuth ? (
                // Если пользователь авторизован, показываем профиль и кнопку выхода
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
                  <button onClick={logout} className="logout-button">
                    Выйти
                  </button>
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