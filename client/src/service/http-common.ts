import axios, { AxiosInstance } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { store } from '../app/store'; 
import { refreshAccessToken, logout } from '../features/user/userSlice'; 

const baseURL = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_API_BASE_URL || '/api'
  : '/api';

const authAxios: AxiosInstance = axios.create({ baseURL: baseURL , timeout: 30000});
const publicAxios: AxiosInstance = axios.create({ baseURL: baseURL , timeout: 30000});

createAuthRefreshInterceptor(authAxios, (failedRequest) => {
  return store.dispatch(refreshAccessToken()).then((response: any) => {
    if (failedRequest) {
      failedRequest.response.config.headers.Authorization = `Bearer ${response.payload.Token}`;
    }
    return Promise.resolve();
  }).catch(() => {
    store.dispatch(logout());
    return Promise.reject();
  });
});

authAxios.interceptors.request.use(
  (config) => {
    const accessToken = store.getState().userReducer.accessToken;
    if (accessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { authAxios, publicAxios };