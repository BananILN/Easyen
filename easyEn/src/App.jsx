import { useState } from 'react'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Routes} from "react-router"
import './App.css'

import { ROUTES } from '.'
import HomePage from './pages/HomePage'
import Statistic from './pages/Statistic'
import Profile from './pages/Profile'
import { Courses } from './pages/Courses'
import ErrorPage from './pages/ErrorPage'
import { BaseLayout } from './components/BaseLayout'
import { CoursesDetails } from './pages/CoursesDetails'
import { Loader } from './components/Loader'
import { courseLoader } from './pages/Courses'



const router = createBrowserRouter(
  createRoutesFromElements(

    <Route path='/' element={<BaseLayout/>} >
      
        <Route index  element={<HomePage/>} /> 

        <Route 
        path={ROUTES.courses}
        element={
          <Courses />
        }
        loader={courseLoader}/> 
      <Route
        path="/courses"
        fallbackElement={<Loader />}
        lazy={() =>
          import("./pages/Courses").then((module) => ({
            Component: module.Courses,
            loader: module.courseLoader,
          }))
        }
      />
      <Route
      path="/courses/:id"
      element={<CoursesDetails />}
      loader={courseLoader}
      />
      

        <Route
        path={ROUTES.profile}
        element={
            <Profile />
        }
        />
        <Route 
        path={ROUTES.statistic}
        element={
          <Statistic/>
        }/>
       
        {/* <Route path="*" element={<ErrorPage />} /> */}
    </Route>
  )
);

function App() {
 
  return <RouterProvider router={router} fallbackElement={<Loader/>}/>;
}

export default App;
