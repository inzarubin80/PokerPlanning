// src/components/PrivateRoute.tsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface PrivateRouteProps {
  accessToken: string|null;
}


const PrivateRoute: React.FC<PrivateRouteProps> = ({accessToken}) => {
  console.log("isAuthenticated", accessToken)
  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;