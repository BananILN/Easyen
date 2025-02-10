import { createContext, useContext, useState } from "react";
import { UserContext } from "./UserContext.jsx";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) =>{
    const [isAuth, setIsAuth] = useState(true)
    const { updateUser } = useContext(UserContext)

    const login = () => {
        setIsAuth(true);
        updateUser({ name: 'John Doe', email: 'john@example.com' }); 
      };
    
      const logout = () => {
        setIsAuth(false);
        updateUser(null); 
      };
    return (
        <AuthContext.Provider value={{ isAuth, login, logout }}>
          {children}
        </AuthContext.Provider>
      );
}