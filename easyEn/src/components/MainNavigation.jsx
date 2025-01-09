import React from 'react';
import { NAV_ITEMS } from "..";
import { Link } from "react-router";
import HomeIcon  from "../assets/home.svg?react";
import CoursesIcon  from "../assets/Cours.svg?react";
import ProfileIcon  from "../assets/Profile.svg?react";
import StatisticIcon from "../assets/Statistic.svg?react";
import { Fragment } from "react";

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
                 <React.Fragment key={item.path}>
                 {item.path === "/profile" && <hr className="hr-profile" color="#444" />}
                 <Link to={item.path} className="nav-items">
                     {icons[item.path]}
                     <span>{item.title}</span>
                 </Link>
             </React.Fragment>
            ))}
        </nav>
    )
}