export  const ROUTES = {
    homepage: "/",
    courses: "/courses",
    profile: "/profile",
    statistic: "/statistic",
    courseDetalis: "/course/:id",
}


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