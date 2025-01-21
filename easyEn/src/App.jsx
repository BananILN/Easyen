import { lazy, Suspense } from 'react'
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
import { courseLoaderS } from './pages/CoursesDetails'
import { StartCoursePage } from './pages/StartCoursePage'
import { startCourseAction } from './pages/StartCoursePage'
import { ProtectedRoute } from './components/ProtectedRoute'

// const CoursesP = lazy(() => import('./pages/Courses'));


const router = createBrowserRouter(
  createRoutesFromElements(

    <Route path='/' element={<BaseLayout/>} >
      
        <Route index  element={<HomePage/>} /> 

        <Route 
        path={ROUTES.courses}
        element={
            <Courses />
        }
        /> 
      <Route
      path="/courses/:id/*"
      element={
       <CoursesDetails />
    }
      />

      <Route
        path="courses/:id/start-course"
        element={<StartCoursePage />}
        action={startCourseAction}
      />

        <Route
        path={ROUTES.profile}
        element={
          <ProtectedRoute isAllowed={false}>
            <Profile />
            </ProtectedRoute>
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
