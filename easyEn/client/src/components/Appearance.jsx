import React, { useContext, useState } from 'react';
import { ThemeContext } from "../context/ThemeContext";
import { LanguageContext } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import './Appearance.css';

export default function Appearance() {
  const { theme, setTheme } = useContext(ThemeContext) || { theme: 'light', setTheme: () => {} };
  const { language, setLanguage } = useContext(LanguageContext);
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const { t } = useTranslation();

  const handleThemeClick = (themeValue) => {
    setSelectedTheme(themeValue);
    setTheme(themeValue);
  };

  const handleLanguageClick = (lang) => {
    setSelectedLanguage(lang);
    setLanguage(lang);
  };

  return (
    <div className="user-info appearance-container">
      <h1 className="appearance-title">{t('appearance_title')}</h1>
      <p className="appearance-description">{t('appearance_description')}</p>
      <div className="theme-button-group">
        <div
          className={`theme-button ${selectedTheme === 'light' ? 'theme-button-selected' : ''}`}
          onClick={() => handleThemeClick('light')}
        >
          <div className="theme-icon-wrapper">
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_1552_23422)">
                <path d="M12.8021 17.6712C15.8535 17.6712 18.3271 15.1976 18.3271 12.1462C18.3271 9.09483 15.8535 6.62122 12.8021 6.62122C9.75072 6.62122 7.2771 9.09483 7.2771 12.1462C7.2771 15.1976 9.75072 17.6712 12.8021 17.6712Z" stroke="var(--icon-color, rgb(196, 195, 195))" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12.8021 1.09619V2.79619" stroke="var(--icon-color, rgb(196, 195, 195))" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12.8021 21.4962V23.1962" stroke="var(--icon-color, rgb(196, 195, 195))" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23.8521 12.1462H22.1521" stroke="var(--icon-color, rgb(196, 195, 195))" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.45211 12.1462H1.75211" stroke="var(--icon-color, rgb(196, 195, 195))" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.6221 4.32605L19.4151 5.53305" stroke="var(--icon-color, rgb(196, 195, 195))" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.18909 18.7594L4.98209 19.9664" stroke="var(--icon-color, rgb(196, 195, 195))" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.6221 19.9664L19.4151 18.7594" stroke="var(--icon-color, rgb(196, 195, 195))" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.18909 5.53305L4.98209 4.32605" stroke="var(--icon-color, rgb(196, 195, 195))" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              <defs><clipPath id="clip0_1552_23422"><rect width="23.8" height="23.8" fill="white" transform="translate(0.9021 0.246216)"/></clipPath></defs>
            </svg>
            <span className="theme-label">{t('theme_light')}</span>
          </div>
        </div>
        <div
          className={`theme-button ${selectedTheme === 'dark' ? 'theme-button-selected' : ''}`}
          onClick={() => handleThemeClick('dark')}
        >
          <div className="theme-icon-wrapper">
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_1552_23490)">
                <path d="M20.7021 18.6623C18.7273 18.6502 16.7912 18.1132 15.0924 17.1062C13.3936 16.0992 11.9931 14.6585 11.0346 12.9318C10.0761 11.2052 9.59408 9.25464 9.63793 7.28026C9.68178 5.30589 10.2499 3.3787 11.2841 1.69629C8.55933 2.17464 6.11017 3.65017 4.41374 5.83545C2.71731 8.02074 1.8951 10.7593 2.10728 13.5176C2.31946 16.2759 3.55083 18.8565 5.56152 20.7566C7.57221 22.6567 10.2182 23.7403 12.9841 23.7963C14.8764 23.8011 16.7379 23.3169 18.388 22.3906C20.0381 21.4643 21.4208 20.1273 22.4021 18.5093C21.84 18.6022 21.2718 18.6533 20.7021 18.6623V18.6623Z" stroke="var(--icon-color, rgb(196, 195, 195))" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              <defs><clipPath id="clip0_1552_23490"><rect width="23.8" height="23.8" fill="white" transform="translate(0.302124 0.846313)"/></clipPath></defs>
            </svg>
            <span className="theme-label">{t('theme_dark')}</span>
          </div>
        </div>
        <div
          className={`theme-button ${selectedTheme === 'blue' ? 'theme-button-selected' : ''}`}
          onClick={() => handleThemeClick('blue')}
        >
          <div className="theme-icon-wrapper">
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_1552_21808)">
                <path d="M21.5933 1.49634H7.99326C7.05437 1.49634 6.29326 2.25745 6.29326 3.19634V16.7963C6.29326 17.7352 7.05437 18.4963 7.99326 18.4963H21.5933C22.5321 18.4963 23.2933 17.7352 23.2933 16.7963V3.19634C23.2933 2.25745 22.5321 1.49634 21.5933 1.49634Z" stroke="var(--icon-color, rgb(196, 195, 195))" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1.19326 21.8964C1.19326 22.3472 1.37237 22.7796 1.69118 23.0984C2.00999 23.4173 2.44239 23.5964 2.89326 23.5964" stroke="var(--icon-color, rgb(196, 195, 195))" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.99326 23.5963H10.5433" stroke="var(--icon-color, rgb(196, 195, 195))" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.6433 23.5963H18.1933" stroke="var(--icon-color, rgb(196, 195, 195))" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1.19326 14.2463V16.7963" stroke="var(--icon-color, rgb(196, 195, 195))" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1.19326 6.59631V9.14631" stroke="var(--icon-color, rgb(196, 195, 195))" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              <defs><clipPath id="clip0_1552_21808"><rect width="23.8" height="23.8" fill="white" transform="translate(0.343262 0.646362)"/></clipPath></defs>
            </svg>
            <span className="theme-label">{t('theme_blue')}</span>
          </div>
        </div>
      </div>
      <h2 className="language-title">{t('language_title')}</h2>
      <div className="language-button-group">
        <div
          className={`language-button ${selectedLanguage === 'ru' ? 'language-button-selected' : ''}`}
          onClick={() => handleLanguageClick('ru')}
        >
          <div className="language-icon-wrapper">
            <svg width="25" height="25" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_4_7266)">
                <path d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z" fill="#F0F0F0"/>
                <path d="M496.077 345.043C506.368 317.31 512 287.314 512 256C512 224.686 506.368 194.69 496.077 166.957H15.923C5.633 194.69 0 224.686 0 256C0 287.314 5.633 317.31 15.923 345.043L256 367.304L496.077 345.043Z" fill="#0052B4"/>
                <path d="M256 512C366.071 512 459.906 442.528 496.077 345.043H15.9231C52.0941 442.528 145.929 512 256 512Z" fill="#D80027"/>
              </g>
              <defs><clipPath id="clip0_4_7266"><rect width="512" height="512" fill="white"/></clipPath></defs>
            </svg>
            <span className="language-label">{t('language_ru')}</span>
          </div>
        </div>
        <div
          className={`language-button ${selectedLanguage === 'en' ? 'language-button-selected' : ''}`}
          onClick={() => handleLanguageClick('en')}
        >
          <div className="language-icon-wrapper">
            <svg width="25" height="25" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_4_7321)">
                <path d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z" fill="#F0F0F0"/>
                <path d="M52.92 100.142C32.811 126.305 17.648 156.46 8.81897 189.219H141.997L52.92 100.142Z" fill="#0052B4"/>
                <path d="M503.181 189.219C494.352 156.461 479.188 126.306 459.08 100.143L370.005 189.219H503.181Z" fill="#0052B4"/>
                <path d="M8.81897 322.784C17.649 355.542 32.812 385.697 52.92 411.859L141.994 322.784H8.81897Z" fill="#0052B4"/>
                <path d="M411.858 52.9211C385.695 32.8121 355.541 17.6491 322.782 8.81909V141.996L411.858 52.9211Z" fill="#0052B4"/>
                <path d="M100.142 459.079C126.305 479.188 156.46 494.351 189.218 503.181V370.005L100.142 459.079Z" fill="#0052B4"/>
                <path d="M189.217 8.81909C156.459 17.6491 126.304 32.8121 100.142 52.9201L189.217 141.995V8.81909Z" fill="#0052B4"/>
                <path d="M322.783 503.181C355.541 494.351 385.696 479.188 411.858 459.08L322.783 370.005V503.181Z" fill="#0052B4"/>
                <path d="M370.005 322.784L459.08 411.86C479.188 385.698 494.352 355.542 503.181 322.784H370.005Z" fill="#0052B4"/>
                <path d="M509.833 222.609H289.393H289.392V2.167C278.461 0.744 267.317 0 256 0C244.681 0 233.539 0.744 222.609 2.167V222.607V222.608H2.167C0.744 233.539 0 244.683 0 256C0 267.319 0.744 278.461 2.167 289.391H222.607H222.608V509.833C233.539 511.256 244.681 512 256 512C267.317 512 278.461 511.257 289.391 509.833V289.393V289.392H509.833C511.256 278.461 512 267.319 512 256C512 244.683 511.256 233.539 509.833 222.609Z" fill="#D80027"/>
                <path d="M322.783 322.784L437.019 437.02C442.273 431.768 447.285 426.277 452.067 420.585L354.265 322.783H322.783V322.784Z" fill="#D80027"/>
                <path d="M189.217 322.784H189.215L74.98 437.019C80.232 442.273 85.723 447.285 91.415 452.067L189.217 354.263V322.784Z" fill="#D80027"/>
                <path d="M189.217 189.219V189.217L74.981 74.98C69.727 80.232 64.715 85.723 59.933 91.415L157.736 189.218H189.217V189.219Z" fill="#D80027"/>
                <path d="M322.783 189.219L437.02 74.9811C431.768 69.7271 426.277 64.7151 420.585 59.9341L322.783 157.737V189.219Z" fill="#D80027"/>
              </g>
              <defs><clipPath id="clip0_4_7321"><rect width="512" height="512" fill="white"/></clipPath></defs>
            </svg>
            <span className="language-label">{t('language_en')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}