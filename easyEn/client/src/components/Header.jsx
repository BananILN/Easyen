import { NavLink, useNavigate } from "react-router"; // Исправлен импорт
import { NAV_ITEMS } from "..";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";
import { HOME_ROUTE } from "..";
import ExitIcon from "../assets/exit.svg?react";

export default function Header() {
  const { isAuth, logout } = useContext(AuthContext);
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    console.log("Выход из системы");
    logout();
    navigate(HOME_ROUTE, { replace: true });
  };

  const profile = NAV_ITEMS.find(item => item.path === "/profile");

  // Диагностика
  console.log("User data in Header:", user);
  const avatarUrl = user && user.img 
    ? `${import.meta.env.VITE_API_URL}/static/${user.img}`
    : "/src/assets/user.svg";
  console.log("Generated avatar URL:", avatarUrl);

  if (loading) {
    return <header className="header">Загрузка...</header>;
  }

  return (
    <header className="header">
      {isAuth ? (
        <div className="header-auth">
          {profile && (
            <NavLink
              to={profile.path}
              className={({ isActive }) =>
                `header-profile ${isActive ? "active-item" : ""}`
              }
            >
              <div className="header-avatar-wrapper">
                <img
                  src={avatarUrl}
                  alt="User Avatar"
                  className="header-avatar"
                  onError={(e) => {
                    console.log("Image load failed, falling back to default");
                    e.target.src = "/src/assets/user.svg";
                  }}
                  onLoad={() => console.log("Image loaded successfully")}
                />
              </div>
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
        <NavLink to="/login" className="login-button">
          Войти
        </NavLink>
      )}
    </header>
  );
}