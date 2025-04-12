import Logo from '../assets/Language.svg?react';

export default function SideBar({ children, isCollapsed }) {
  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="logo">
        <Logo />
        <span className="logo-title">Try out</span>
      </div>
      <div className="hr-logo-cont">
        <hr className="hr-logo" color="#424245" />
      </div>
      {children}
    </div>
  );
}