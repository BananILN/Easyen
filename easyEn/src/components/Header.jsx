import { NavLink } from "react-router-dom";
import ProfileIcon from "../assets/Profile.svg?react";
import { NAV_ITEMS } from "..";

export default function Header() {

        const profile = NAV_ITEMS.find(item => item.path ==="/profile");
    return (
        <header className="header">
           {profile && (
                <NavLink
                    to={profile.path}
                    className={({ isActive }) => `header-profile ${isActive ? "active-item" : ""}`}
                >
                    <ProfileIcon />
                    {profile.title} 
                </NavLink>
            )}
          
        </header>
    );
}