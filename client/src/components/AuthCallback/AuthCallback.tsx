import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext, AuthContextType} from '../../context/AuthContext/AuthContext';

const AuthCallback: React.FC = () => {

  const {publicAxios, setAccessToken } = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();
  const location = useLocation();
  const intervalRef = React.useRef("");

  interface PostData {
    authorization_code: string;
    provider_key: string;
  }

  useEffect(() => {
    const handleAuthCallback = async () => {
      const queryParams = new URLSearchParams(location.search);
      const code = queryParams.get('code');
      const provider = queryParams.get('provaider');


      if ((code) && (intervalRef.current != code)) {
      intervalRef.current = code
      if (code && provider) {
        const data: PostData = {
          authorization_code: code,
          provider_key: provider,
        };

        try {
          const response = await fetch(`/api/user/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            credentials: 'include', // Отправляем куки
            body: JSON.stringify(data),
          });
        const result = await response.json();
        setAccessToken(result.Token)
        } catch (error) {
        }
      } else {
        console.error('Missing code or provider in query params');
      }
    }
     navigate('/');
    };
    handleAuthCallback();
  }, [location.search, navigate, setAccessToken]);

  return (
    <div>
      <p>Обработка авторизации...</p>
    </div>
  );
};

export default AuthCallback;