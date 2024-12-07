import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext, AuthContextType } from '../../context/AuthContext/AuthContext';

const YandexAuthCallback: React.FC = () => {
  
    const { updateAuthStatus } = useContext(AuthContext) as AuthContextType;
    const navigate = useNavigate();
    const location = useLocation();
    const intervalRef = React.useRef("");

  useEffect(() => {

    const queryParams = new URLSearchParams(location.search);
    const code = `${queryParams.get('code')}`;
    
    if ((code) && (intervalRef.current != code)) {
      
      intervalRef.current = code

      console.log('code***********', code)

      fetch(`/api/user/login/${code}`)
        .then((response) => response.json())
        .then((data: { success: boolean; message?: string }) => {
          // Обработка ответа от API
          console.log("data", data)
          if (data.success) {
            updateAuthStatus(true)
            navigate('/');
          } else {
            // Обработка ошибки авторизации
            console.error('Ошибка авторизации:', data.message);
            navigate('/login');
          }
        })
        .catch((error: Error) => {
          console.error('Ошибка при отправке кода в API:', error);
          navigate('/login');
        });
    } else {
      // Если код не найден, перенаправляем на страницу входа
      navigate('/login');
    }
  }, [location.search]);

  return (
    <div>
      <p>Обработка авторизации...</p>
    </div>
  );
};

export default YandexAuthCallback;