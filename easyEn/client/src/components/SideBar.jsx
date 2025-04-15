import Logo from '../assets/Language.svg?react';
import { NavLink } from 'react-router';


export default function SideBar({ children, isCollapsed }) {
  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <NavLink to={"/"}>
      <div className="logo">
        <Logo />
        <span className="logo-title">Try out</span>
      </div>
      </NavLink>
      <div className="hr-logo-cont">
        <hr className="hr-logo" color="#424245" />
      </div>
      {children}
    </div>
  );
}