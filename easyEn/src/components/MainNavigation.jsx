import React from 'react';
import { NAV_ITEMS } from "..";
import { NavLink } from "react-router";
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
   
    const filteredNavItems = NAV_ITEMS.filter(item => item.path !== "/profile");
    return(
        <nav className="navigate"  >
            {filteredNavItems.map(item => (
                 <React.Fragment key={item.path}>
                 {item.path === "/profile" && <hr className="hr-profile" color="#444" />}
                 <NavLink to={item.path} className={({isActive}) => `nav-items ${isActive ? 'active-item' : ""}`}>
                     {icons[item.path]}
                     {item.title}
                 </NavLink>
             </React.Fragment>
            ))}
        </nav>
    )
}