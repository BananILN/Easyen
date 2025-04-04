// import { lazy, Suspense } from 'react'
import {BrowserRouter, createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Routes,Navigate} from "react-router"

import './App.css'
import 'antd/dist/reset.css';

import AppRouter from "./components/AppRouter";
import { useCallback } from "react";
import { useEffect, useState,useContext } from "react";
import { check } from "./http/userApi.js";
import { UserContext } from "./context/UserContext.jsx";
import { AuthContext } from "./context/AuthContext.jsx";
import {MutatingDots} from 'react-loader-spinner'



function App() {
  const { login } = useContext(AuthContext)
  const {updateUser} = useContext(UserContext)
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const data = await check()
      updateUser(data)
      login(true)
    } finally {
      setLoading(false)
    }
  }, [login, updateUser])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (loading) {
    return (
      <div className="loading-overlay">
        <MutatingDots
          height="100"
          width="100"
          color="#2d82e3"
          secondaryColor="#2d82e3"
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
