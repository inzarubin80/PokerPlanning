import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import YandexAuthButton from '../AuthButton/AuthButton';
import { Google, Facebook, GitHub, Twitter } from '@mui/icons-material';


const Login: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
        minHeight="100vh"
        p={20}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          style={{ whiteSpace: 'nowrap' }}
        >
          Покер планирования
        </Typography>
        
        <YandexAuthButton />



      </Box>
    </Container>
  );
};

export default Login;