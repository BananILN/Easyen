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
export const TEST_ROUTE = '/test'
export const REGISTRATION_ROUTE = '/registration'




export const NAV_ITEMS = [
    {
        title:"Главная",
        path: ROUTES.homepage,
    },
    {
        title:"Уроки",
        path: ROUTES.courses,
    },
    {
        title:"Статистика",
        path: ROUTES.statistic
    },
    {
        title:"Профиль",
        path: ROUTES.profile,
    },
]