import {Route, Routes, Navigate} from 'react-router'
import { authRoutes, publicRoutes } from '../routes'
import HomePage from '../pages/HomePage'
import  Lesson  from '../pages/Lesson';
import  Admin  from '../pages/Admin';
import Test  from '../pages/Test';

const AppRouter = () => {
    const isAuth = false;
  
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lesson/:id" element={<Lesson />} />
        <Route path="/lesson" element={<Navigate to="/lesson/1" replace />} />
        <Route path="/test" element={<Test />} />
        
        {isAuth && <Route path="/admin" element={<Admin />} />}
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  };
  
  export default AppRouter;