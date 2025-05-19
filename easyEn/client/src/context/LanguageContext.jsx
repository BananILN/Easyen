import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import { updateProfile } from '../http/ProfileApi';
import i18n from '../utils/i18n';

export const LanguageContext = createContext();

export default function LanguageProvider({ children }) {
  const { user } = useContext(UserContext);
  const [language, setLanguage] = useState(() => localStorage.getItem('i18nextLng') || 'en');

 
  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('i18nextLng', language); 
    if (user && user.UserID) {
      updateProfile(user.UserID, { language }).catch(err => console.error('Не удалось обновить язык:', err));
    }
  }, [language, user]);

  
  useEffect(() => {
    if (user && user.language && user.language !== language) {
      setLanguage(user.language);
    }
  }, [user]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}