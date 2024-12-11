// src/components/PrivateRoute.tsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface PrivateRouteProps {
  isAuthenticated: boolean;
}


const PrivateRoute: React.FC<PrivateRouteProps> = ({isAuthenticated}) => {
  console.log("isAuthenticated", isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;