import { NAV_ITEMS } from "..";
import { Link } from "react-router";
import HomeIcon  from "../assets/home.svg?react";
import CoursesIcon  from "../assets/Cours.svg?react";
import ProfileIcon  from "../assets/Profile.svg?react";
import StatisticIcon from "../assets/Statistic.svg?react";

export default function MainNavigation() {
    const icons = {
        "/": <HomeIcon/>,
        "/courses": <CoursesIcon />,
        "/profile": <ProfileIcon />,
        "/statistic": <StatisticIcon />,
    }
   

    return(
        <nav className="navigate"  >
            {NAV_ITEMS.map(item => (
                <Link to={item.path} key={item.path}
                    className = "nav-items">
                     {icons[item.path]} 
                     <span>{item.title}</span>
                </Link>
            ))}
        </nav>
    )
}