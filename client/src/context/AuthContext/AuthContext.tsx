// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';

export interface AuthContextType {
  isAuthenticated: boolean;
  updateAuthStatus: (status: boolean) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated')==='true');

  useEffect(() => {
    checkAuthStatus();
  });

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`/api/user/session`);
      const data = await response.json();
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      localStorage.removeItem('isAuthenticated');
    }
  };

  const updateAuthStatus = (status: boolean) => {
    setIsAuthenticated(status);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, updateAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};