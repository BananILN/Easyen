import { Component } from "react"
import { ADMIN_ROUTE, LESSON_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, TEST_ROUTE,HOME_ROUTE, PROFILE_ROUTE } from "./index.js"
import  Admin  from "./pages/Admin"
import  Test  from "./pages/Test"
import  Auth  from "./pages/Auth"
import  Lesson  from "./pages/Lesson"
import HomePage from "./pages/HomePage"
import Profile from "./pages/Profile"

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