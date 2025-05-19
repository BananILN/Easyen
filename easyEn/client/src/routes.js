import { Component } from "react"
import { ADMIN_ROUTE, LESSON_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, TEST_ROUTE,HOME_ROUTE, PROFILE_ROUTE, STATISTIC_ROUTE, LESSDETAILS_ROUTE } from "./index.js"
import  Admin  from "./pages/Admin"
import  Test  from "./pages/Test"
import  Auth  from "./pages/Auth"
import Statistic from "./pages/Statistic"
import  Lesson  from "./pages/Lesson"
import HomePage from "./pages/HomePage"
import Profile from "./pages/Profile"
import LessonDetails  from "./pages/LessonDetails"
import TestResults from "./pages/TestResults.jsx"

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: TEST_ROUTE,
        Component: Test
    },
    {
        path: PROFILE_ROUTE,
        Component: Profile
    },
    {
        path: STATISTIC_ROUTE,
        Component: Statistic
    },
    {
        path: '/lesson/:id',
        Component: LessonDetails
    },
    {
        path: "/test-results/:lessonId",
        Component: TestResults
    }


]

export const publicRoutes = [ 
    {
        path:HOME_ROUTE,
        Component:HomePage
    },

    {
        path: LESSON_ROUTE,
        Component: Lesson
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    },
    
]