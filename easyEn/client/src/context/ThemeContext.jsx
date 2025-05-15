import useConfig from 'antd/es/config-provider/hooks/useConfig';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { UserContext } from './UserContext';


export const ThemeContext = createContext();

export default function ThemeContext({children}) {

    const {user} = useContext(UserContext);
    const [theme, setTheme]=  useState(() => localStorage.getItem("theme") || "light");

    useEffect( ()=>{
        document.documentElement.setAttribute("data-theme",theme)
        localStorage.setItem("theme",theme)
    },[theme])

    useEffect(() => {
      if (user && user.theme && user.theme !== theme) {
        setTheme(user.theme); 
      }
    }, [user]);
    
    return (
      <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
