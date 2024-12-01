// src/components/PrivateRoute.tsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext, AuthContextType } from '../../context/AuthContext/AuthContext';

const PrivateRoute: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext) as AuthContextType;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;