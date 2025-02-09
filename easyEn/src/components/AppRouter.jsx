import {Route, Routes, Navigate} from 'react-router'
import { authRoutes, publicRoutes } from '../routes'


export const AppRouter = ({ isAuth }) => {
    return (
        <Routes>
            {/* Public Routes */}
            {publicRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
            ))}
            
            {/* Auth Routes */}
            {isAuth && authRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
            ))}

            {/* Перенаправление на главную страницу при неправильном пути */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};