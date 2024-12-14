import React, { createContext, useState, useEffect, ReactNode } from 'react';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import axios, { AxiosInstance } from 'axios';

export interface AuthContextType {
  accessToken: string | null;
  authAxios: AxiosInstance;
  publicAxios: AxiosInstance;
  setAccessToken:(accessToken:string)=>void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

  const [accessToken, setAccessToken] = useState<string | null>("");

  const logOut = async () => {
    setAccessToken(null);
  };

  const getApiUrl = () => {
    return '/api';
  };

  const authAxios = axios.create({ baseURL: getApiUrl() });
  const publicAxios = axios.create({ baseURL: getApiUrl() });

  const refreshAuthLogic = (failedRequest: any = null) => {
    const options = {
      method: 'GET',
      url: `/api/user/refresh`,
    };

    return axios(options)
      .then(async (tokenRefreshResponse) => {
        if (failedRequest) {
          failedRequest.response.config.headers.Authorization = `Bearer ${tokenRefreshResponse.data.accessToken}`;
        }
        setAccessToken(tokenRefreshResponse.data.accessToken);
        return Promise.resolve();
      })
      .catch((e) => {
        if (failedRequest) {
          logOut();
        }
        return Promise.reject(e);
      });
  };

  createAuthRefreshInterceptor(authAxios, refreshAuthLogic, {});
  authAxios.interceptors.request.use(
    (config) => {
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  return (
    <AuthContext.Provider value={{ accessToken, authAxios, publicAxios, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );

};