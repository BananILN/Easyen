import { Link } from "react-router";
import ProfileIcon from "../assets/Profile.svg?react";

export default function Header() {
    return (
        <header className="header">
            <Link to="/profile" className="header-profile">
                <ProfileIcon />
                <span>Профиль</span>
            </Link>
        </header>
    );
}