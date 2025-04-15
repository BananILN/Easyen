export  const ROUTES = {
    homepage: "/",
    courses: "/courses",
    profile: "/profile",
    statistic: "/statistic",
    courseDetalis: "/course/:id",
}

export const ADMIN_ROUTE = '/admin'
export const LOGIN_ROUTE = '/login'
export const LESSON_ROUTE = '/lesson'
export const TEST_ROUTE = '/lesson/:id/test'
export const REGISTRATION_ROUTE ='/registration'
export const HOME_ROUTE ='/'
export const PROFILE_ROUTE = '/profile'
export const STATISTIC_ROUTE ='/statistic'
export const LESSDETAILS_ROUTE = '/lesson/:id'




export const NAV_ITEMS = [
    {
        title:"Главная",
        path: HOME_ROUTE,
    },
    {
        title:"Уроки",
        path: LESSON_ROUTE,
    },
    {
        title:"Статистика",
        path: ROUTES.statistic
    },
    {
        title:"Профиль",
        path: PROFILE_ROUTE,
    },
]