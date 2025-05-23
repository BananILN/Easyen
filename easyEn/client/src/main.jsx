import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { UserProvider } from './context/UserContext.jsx'
import  ThemeProvider  from './context/ThemeContext.jsx'
import LanguageProvider from './context/LanguageContext.jsx'

console.log(import.meta.env.VITE_API_URL);



createRoot(document.getElementById('root')).render(
  <StrictMode>
     <AuthProvider>
      <UserProvider>
        <ThemeProvider>
          <LanguageProvider>
             <App />
          </LanguageProvider>
        </ThemeProvider>
      </UserProvider>
    </AuthProvider>
  </StrictMode>,
)
