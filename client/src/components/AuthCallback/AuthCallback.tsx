import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setLoginData } from '../../features/user/userSlice';
import { AppDispatch } from '../../app/store';
import { useDispatch } from 'react-redux';
import {baseURL} from '../../service/http-common'


const AuthCallback: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const intervalRef = React.useRef("");
  
  interface PostData {
    AuthorizationCode: string;
    ProviderKey: string;
  }

  useEffect(() => {
    const handleAuthCallback = async () => {
      const queryParams = new URLSearchParams(location.search);
      const code = queryParams.get('code');
      const provider = queryParams.get('provider'); 

      if (code && intervalRef.current !== code) {
        intervalRef.current = code;

        if (code && provider) {
          const data: PostData = {
            AuthorizationCode: code,
            ProviderKey: provider,
          };

          try {
            const response = await fetch(`${baseURL}//user/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              credentials: 'include', // Отправляем куки
              body: JSON.stringify(data),
            });

            const result = await response.json();
            dispatch(setLoginData(result));
           
            const fromLocal = localStorage.getItem('redirectUrl');
            localStorage.removeItem('redirectUrl')
            const from = fromLocal || '/'; 
            navigate(from);
         
          } catch (error) {
            console.error('Error during login:', error);
          }
        } else {
          console.error('Missing code or provider in query params');
        }
      }
    };

    handleAuthCallback();
  }, [location.search, navigate, dispatch]);

  return (
    <div>
      <p>Обработка авторизации...</p>
    </div>
  );
};

export default AuthCallback;