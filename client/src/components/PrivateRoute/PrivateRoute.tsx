import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  accessToken: string | null;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ accessToken }) => {
  const location = useLocation();


  if (!accessToken) {
    
    localStorage.setItem('redirectUrl', location.pathname); //
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return <Outlet />;
};

export default PrivateRoute;