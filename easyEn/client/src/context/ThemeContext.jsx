import useConfig from 'antd/es/config-provider/hooks/useConfig';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import { updateProfile } from '../http/ProfileApi'; // Убедитесь, что путь правильный

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
    const { user } = useContext(UserContext);
    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
        if (user && user.UserID) {
            updateProfile(user.UserID, { theme }).catch(err => console.error('Не удалось обновить тему:', err));
        }
    }, [theme, user]);

    useEffect(() => {
        if (user && user.theme && user.theme !== theme) {
            setTheme(user.theme);
        }
    }, [user]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}