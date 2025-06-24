
import {BrowserRouter, createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Routes,Navigate} from "react-router"

import './App.css'
import 'antd/dist/reset.css';

import AppRouter from "./components/AppRouter";
import { useCallback } from "react";
import { useEffect, useState,useContext } from "react";
import { check } from "./http/userApi.js";
import { UserContext } from "./context/UserContext.jsx";
import { AuthContext } from "./context/AuthContext.jsx";
import { ThemeContext } from "./context/ThemeContext.jsx";
import {MutatingDots} from 'react-loader-spinner'
import { fetchProfile } from "./http/ProfileApi.js";



function App() {
  const { login } = useContext(AuthContext)
  const { setUser} = useContext(UserContext)
  const {theme} = useContext(ThemeContext)
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Токен отсутствует");
      }
      
      const data = await check();
      
      localStorage.setItem("userId", data.UserID);
      login(data);
      const profileData = await fetchProfile(data.UserID);
      setUser({ ...data, ...profileData });
    } catch (error) {
      if (error.message !== "Токен отсутствует") {
        console.error("Auth check failed:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [login, setUser]); 

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
   const loaderColor = theme === 'light' ? '#333333' : theme === 'dark' ? '#ffffff' : '#ffffff'; 
    return (
      <div className="loading-overlay">
        <MutatingDots
          height="100"
          width="100"
          color={loaderColor}
          secondaryColor={loaderColor}
          radius="12.5"
          ariaLabel="mutating-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  }

   
  return (
    <BrowserRouter>
    <AppRouter />
  </BrowserRouter>
  
  ) 
}

export default App;
