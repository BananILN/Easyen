import { createContext, useContext, useState,useCallback } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) =>{
  const [isAuth, setIsAuth] = useState(() => !!localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  const login = useCallback((userData) => {
    setIsAuth(true);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setIsAuth(false);
    setUser(null);
  }, []);

    return (
        <AuthContext.Provider value={{ isAuth,user, login, logout }}>
          {children}
        </AuthContext.Provider>
      );
}