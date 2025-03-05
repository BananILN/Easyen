// import { lazy, Suspense } from 'react'
import {BrowserRouter, createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Routes,Navigate} from "react-router"

import './App.css'
import 'antd/dist/reset.css';
import HomePage from './pages/HomePage.jsx'
import  Lesson  from './pages/Lesson.jsx';


import Test  from './pages/Test';
// import { ROUTES } from '.'
// import HomePage from './pages/HomePage'
// import Statistic from './pages/Statistic'
// import Profile from './pages/Profile'
// import { Courses } from './pages/Courses'

import { BaseLayout } from './components/BaseLayout'
// import { CoursesDetails } from './pages/CoursesDetails'
// import { Loader } from './components/Loader'

// import { StartCoursePage } from './pages/StartCoursePage'
// import { startCourseAction } from './pages/StartCoursePage'
// import { ProtectedRoute } from './components/ProtectedRoute'

import AppRouter  from './components/AppRouter'
import { useEffect, useState,useContext } from "react";
import { check } from "./http/userApi.js";
import { UserContext } from "./context/UserContext.jsx";
import { AuthContext } from "./context/AuthContext.jsx";
import {MutatingDots} from 'react-loader-spinner'


function App() {
  const {login} = useContext(AuthContext)
  const {updateUser} = useContext(UserContext)
  const [loading, setLoading] = useState(true);

  useEffect( ()=>{
      check().then(data =>{
        updateUser(true)
        login(true)
      }).finally( () =>{
        setLoading(false)
      })  
  }, [])

  if(loading){
    return (
<div style={{
        display: "flex",
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh", 
        backgroundColor: "rgb(28, 30, 51)" 
      }}>
        <MutatingDots
          visible={true}
          height="100"
          width="100"
          color="#2d82e3" 
          secondaryColor="#2d82e3"
          radius="12.5"
          ariaLabel="mutating-dots-loading"
        />
      </div>
    )
  }

   
  return (
    <BrowserRouter>
    <AppRouter />
  </BrowserRouter>
  
  ) 
}

export default App;
