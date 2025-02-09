import { Component } from "react"
import { ADMIN_ROUTE, LESSON_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, TEST_ROUTE } from "."
import  Admin  from "./pages/Admin"
import  Test  from "./pages/Test"
import  Auth  from "./pages/Auth"
import  Lesson  from "./pages/Lesson"

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: TEST_ROUTE,
        Component: Test
    }

]

export const publicRoutes = [ 
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