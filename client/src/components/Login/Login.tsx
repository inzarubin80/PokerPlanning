import React from 'react';
import { Box, Container, Typography, useTheme, useMediaQuery } from '@mui/material';
import YandexAuthButton from '../AuthButton/AuthButton';
import { useLocation } from 'react-router-dom';

const Login: React.FC = () => {
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Container maxWidth="sm" sx={{ px: isMobile ? 2 : 3 }}>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="100vh"
                py={isMobile ? 8 : 20}
                px={isMobile ? 2 : 4}
            >
                <Typography 
                    variant={isMobile ? "h4" : "h3"}
                    component="h1" 
                    gutterBottom 
                    sx={{ 
                        whiteSpace: 'nowrap',
                        fontSize: isMobile ? '1.75rem' : '2.5rem',
                        textAlign: 'center'
                    }}
                >
                    Покер планирования
                </Typography>
                
                <Box sx={{ width: '100%', maxWidth: 300, mt: isMobile ? 2 : 4 }}>
                    <YandexAuthButton isMobile={isMobile} />
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
