// Header.jsx
import { NavLink, useNavigate } from "react-router"; 
import { NAV_ITEMS } from "..";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";
import { HOME_ROUTE } from "..";
import  defaultImg   from "../assets/user.svg";
import ExitIcon from "../assets/exit.svg?react";
import { fetchProfile } from "../http/ProfileApi"; 

export default function Header() {
  const { isAuth, logout } = useContext(AuthContext);
  const { user, setUser, loading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      if (isAuth && user && !user.img) {
        try {
          const userId = localStorage.getItem("userId");
          if (userId) {
            const profileData = await fetchProfile(userId);
            setUser((prev) => ({ ...prev, ...profileData })); 
          }
        } catch (error) {
          console.error("Не удалось загрузить данные профиля в Header:", error);
        }
      }
    };

    loadProfile();
  }, [isAuth, user?.UserID, setUser]);

  const handleLogout = (e) => {
    e.preventDefault();
    console.log("Выход из системы");
    logout();
    navigate(HOME_ROUTE, { replace: true });
  };

  const profile = NAV_ITEMS.find((item) => item.path === "/profile");

  console.log("User data in Header:", user);
  const avatarUrl = user && user.img
    ? `${import.meta.env.VITE_API_URL}/static/${user.img}`
    : defaultImg;
  // console.log("Generated avatar URL:", avatarUrl);

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