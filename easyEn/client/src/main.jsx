import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { UserProvider } from './context/UserContext.jsx'

console.log(import.meta.env.VITE_API_URL);



createRoot(document.getElementById('root')).render(
  <StrictMode>
     <AuthProvider>
    <UserProvider>
        <App />
    </UserProvider>
    </AuthProvider>
  </StrictMode>,
)
