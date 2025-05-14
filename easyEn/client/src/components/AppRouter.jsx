import { Routes, Route, Navigate } from 'react-router';
import { BaseLayout } from '../components/BaseLayout';
import { publicRoutes } from '../routes';
import { authRoutes } from '../routes';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { memo } from 'react';
import Appearance from './Appearance';
import PersonalInfo from './PersonalInfo';


const AppRouter = memo(() => {
  const { isAuth } = useContext(AuthContext);
  
  return (
    <Routes>
      <Route element={<BaseLayout />}>
      {isAuth &&
          authRoutes.map(({ path, Component }) => {
            if (path === "/profile") {
              
              return (
                <Route key={path} path={path} element={<Component />}>
                 <Route index element={<PersonalInfo />} /> 
                  <Route path="personal-info" element={<PersonalInfo />} />
                  <Route path="appearance" element={<Appearance />} />
                </Route>
              );
            }
            return <Route key={path} path={path} element={<Component />} />;
          })}
        
        {publicRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
});
export default AppRouter;