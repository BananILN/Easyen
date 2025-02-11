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



// const router = createBrowserRouter(
//   createRoutesFromElements(

//     <Route path='/' element={<BaseLayout/>} >
      
//         <Route index  element={<HomePage/>} /> 

//         <Route 
//         path={ROUTES.courses}
//         element={
//             <Courses />
//         }
//         /> 
//       <Route
//       path="/courses/:id/*"
//       element={
//        <CoursesDetails />
//     }
//       />

//       <Route
//         path="courses/:id/start-course"
//         element={<StartCoursePage />}
//         action={startCourseAction}
//       />

//         <Route
//         path={ROUTES.profile}
//         element={
//           <ProtectedRoute isAllowed={false}>
//             <Profile />
//             </ProtectedRoute>
//         }
//         />
//         <Route 
//         path={ROUTES.statistic}
//         element={
//           <Statistic/>
//         }/>
       
//         {/* <Route path="*" element={<ErrorPage />} /> */}
//     </Route>
//   )
// );
// <RouterProvider router={router} fallbackElement={<Loader/>}/>;

function App() {
   
  return (
    <BrowserRouter>
    <AppRouter />
  </BrowserRouter>
  
  ) 
}

export default App;
