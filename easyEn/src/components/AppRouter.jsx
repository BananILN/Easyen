import { Routes, Route, Navigate } from 'react-router';
import HomePage from '../pages/HomePage';
import Lesson from '../pages/Lesson';
import Admin from '../pages/Admin';
import Test from '../pages/Test';
import { BaseLayout } from '../components/BaseLayout';
import { publicRoutes } from '../routes';
import { authRoutes } from '../routes';

const AppRouter = () => {
  const isAuth = false;

  return (
    <Routes>
      {/* Используем BaseLayout как общий макет для всех страниц */}
      <Route element={<BaseLayout />}>
            {isAuth && authRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
            ))}
            
            {publicRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
            ))}
            
            <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;