import React, { useState } from 'react';
import { NAV_ITEMS } from '..'
import { NavLink } from 'react-router';
import HomeIcon from '../assets/home.svg?react';
import CoursesIcon from '../assets/Cours.svg?react';
import ProfileIcon from '../assets/Profile.svg?react';
import { useTranslation } from 'react-i18next';

export default function MainNavigation({ isCollapsed, toggleMenu }) {
  const { t } = useTranslation();
  const icons = {
    '/': (
      <span>
        <svg width="22" height="22" viewBox="0 0 18 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M18 8.15033V15.9668C18 18.1943 16.2091 20 14 20H4C1.79086 20 0 18.1943 0 15.9668V8.15033C0 6.93937 0.539645 5.7925 1.46986 5.02652L6.46986 0.909348C7.9423 -0.303114 10.0577 -0.303117 11.5301 0.909345L16.5301 5.02652C17.4604 5.7925 18 6.93937 18 8.15033ZM12.25 15.25V17.5C12.25 18.0523 11.8023 18.5 11.25 18.5H6.75C6.19772 18.5 5.75 18.0523 5.75 17.5V15.25C5.75 13.4551 7.20507 12 9 12C10.7949 12 12.25 13.4551 12.25 15.25Z" fill="#bfbfbf"/>
        </svg>
      </span>
    ),
    '/lesson': (
      <span>
        <svg width="22" height="22" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M9.25 2.37808C7.13095 0.922277 4.18953 0.259328 1.99433 0.0112717C0.896423 -0.112791 0 0.804023 0 1.93518V13.2C0 14.3311 0.896423 15.2483 1.99433 15.3723C4.18953 15.6204 7.13095 16.2833 9.25 17.7391V2.37808ZM10.75 17.7391C12.869 16.2833 15.8105 15.6204 18.0057 15.3723C19.1036 15.2483 20 14.3311 20 13.2V1.93518C20 0.804023 19.1036 -0.112791 18.0057 0.0112717C15.8105 0.259328 12.869 0.922278 10.75 2.37808V17.7391ZM2.25882 5.13996C2.32221 4.73063 2.70543 4.45019 3.11477 4.51358C4.41754 4.71534 5.88469 5.05257 7.27049 5.58846C7.65682 5.73786 7.8489 6.17215 7.6995 6.55849C7.55011 6.94482 7.11581 7.1369 6.72948 6.9875C5.47083 6.50078 4.11398 6.18621 2.8852 5.99591C2.47587 5.93252 2.19543 5.5493 2.25882 5.13996ZM3.11477 8.51358C2.70543 8.45019 2.32221 8.73063 2.25882 9.13996C2.19543 9.5493 2.47587 9.93252 2.8852 9.99591C3.50444 10.0918 4.15812 10.2196 4.81651 10.3857C5.21814 10.487 5.62587 10.2436 5.7272 9.84194C5.82853 9.44031 5.58509 9.03258 5.18346 8.93125C4.47445 8.75237 3.7745 8.61575 3.11477 8.51358Z" fill="#bfbfbf"/>
        </svg>
      </span>
    ),
    '/profile': <ProfileIcon />,
    '/statistic': (
      <span>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="currentColor"
            clipRule="evenodd"
            d="M1.75 11C1.75 5.89137 5.89137 1.75 11 1.75C16.0825 1.75 20.2077 5.84923 20.2497 10.9218C20.2531 11.336 20.5917 11.669 21.0059 11.6655C21.4201 11.6621 21.7531 11.3236 21.7496 10.9094C21.7009 5.01395 16.9068 0.25 11 0.25C5.06294 0.25 0.25 5.06294 0.25 11C0.25 16.9068 5.01395 21.7009 10.9094 21.7496C11.3236 21.7531 11.6621 21.4201 11.6655 21.0059C11.669 20.5917 11.336 20.2531 10.9218 20.2497C5.84923 20.2077 1.75 16.0825 1.75 11ZM11 6.75C8.65279 6.75 6.75 8.65279 6.75 11C6.75 12.7835 7.84882 14.3122 9.40922 14.9425C9.79328 15.0976 9.97885 15.5347 9.82371 15.9188C9.66857 16.3029 9.23145 16.4884 8.84739 16.3333C6.7395 15.4818 5.25 13.4157 5.25 11C5.25 7.82436 7.82436 5.25 11 5.25C13.4157 5.25 15.4818 6.7395 16.3333 8.84739C16.4884 9.23145 16.3029 9.66857 15.9188 9.82371C15.5347 9.97885 15.0976 9.79328 14.9425 9.40922C14.3122 7.84882 12.7835 6.75 11 6.75ZM13.6699 20.2614L11.0573 12.4235C10.7758 11.5792 11.5792 10.7758 12.4235 11.0573L20.2614 13.6699C21.2462 13.9982 21.2462 15.3911 20.2614 15.7193L17.3672 16.6841C17.0447 16.7916 16.7916 17.0447 16.6841 17.3672L15.7193 20.2614C15.3911 21.2462 13.9982 21.2462 13.6699 20.2614Z"
          />
        </svg>
      </span>
    ),
  };

  const filteredNavItems = NAV_ITEMS.filter((item) => item.path !== '/profile');

  return (
    <nav className="navigate">
      {filteredNavItems.map((item) => (
        <React.Fragment key={item.path}>
          {item.path === '/profile' && <hr className="hr-profile" color="#444" />}
          <NavLink
            to={item.path}
            className={({ isActive }) => `nav-items ${isActive ? 'active-item' : ''}`}
          >
            {icons[item.path]}
            <span className="nav-title">{t(item.title)}</span>
          </NavLink>
        </React.Fragment>
      ))}
      <div className="change-size" onClick={toggleMenu}>
        {isCollapsed ? (
          <svg width="28" height="28" viewBox="0 0 22 22" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7 15C7 11 11 9 15 9M15 9L13 12M15 9L12 7M5 21H17C19.2091 21 21 19.2091 21 17V5C21 2.79086 19.2091 1 17 1H5C2.79086 1 1 2.79086 1 5V17C1 19.2091 2.79086 21 5 21Z"
              stroke="#28303F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 22 22" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15 15C15 11 11 9 7 9M7 9L9 12M7 9L10 7M5 21H17C19.2091 21 21 19.2091 21 17V5C21 2.79086 19.2091 1 17 1H5C2.79086 1 1 2.79086 1 5V17C1 19.2091 2.79086 21 5 21Z"
              stroke="#28303F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </nav>
  );
}