import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/system';

const StyledButton = styled(Button)({
  borderRadius: '0',
  backgroundColor: '#fff',
  color: '#000',
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
});

const YandexIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
        <path d="M2.04 12c0-5.523 4.476-10 10-10 5.522 0 10 4.477 10 10s-4.478 10-10 10c-5.524 0-10-4.477-10-10z" fill="#FC3F1D"/><path d="M13.32 7.666h-.924c-1.694 0-2.585.858-2.585 2.123 0 1.43.616 2.1 1.881 2.959l1.045.704-3.003 4.487H7.49l2.695-4.014c-1.55-1.111-2.42-2.19-2.42-4.015 0-2.288 1.595-3.85 4.62-3.85h3.003v11.868H13.32V7.666z" fill="#fff"/>
    </svg>
  );


const YandexAuthButton: React.FC = () => {
  
  const clientId = process.env.REACT_APP_YANDEX_OAUTH_CLIENT_ID;
  const authUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${clientId}`;


  const handleAuth = () => {
    window.location.href = authUrl;
  };

  return (
    <StyledButton
    variant="contained"
    startIcon={<YandexIcon />}
    size="medium"
    onClick={handleAuth}
  >
    Войти с Яндекс
  </StyledButton>
  );
};

export default YandexAuthButton;