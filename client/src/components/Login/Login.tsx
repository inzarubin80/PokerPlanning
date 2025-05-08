import React from 'react';
import { Box, Container, Typography, useTheme, useMediaQuery } from '@mui/material';
import YandexAuthButton from '../AuthButton/AuthButton';
import { useLocation } from 'react-router-dom';
import TeamCollaborationImg from '../../images/TeamCollaboration.svg';

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
                minHeight="95vh"
                py={isMobile ? 4 : 6}
                px={isMobile ? 2 : 4}
                textAlign="center"
            >
                {/* Заголовок с акцентом */}
                <Typography
                    variant={isMobile ? "h4" : "h3"}
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                        mb: 2,
                        fontSize: isMobile ? '2rem' : '3rem',
                        textAlign: 'center',
                        lineHeight: 1.2
                    }}
                >
                    Покер планирования
                </Typography>

                {/* Подзаголовок с преимуществами */}
                <Typography
                    variant="subtitle1"
                    sx={{
                        mb: 4,
                        color: theme.palette.text.secondary,
                        fontSize: isMobile ? '1rem' : '1.25rem',
                        maxWidth: 500
                    }}
                >
                    Упростите оценку задач<br />
                    и сделайте планирование спринта<br />
                    <Box component="span" fontWeight="600" color={theme.palette.primary.main}>
                        быстрым, честным и увлекательным!
                    </Box>
                </Typography>

                {/* Изображение */}
                <Box
                    component="img"
                    src={TeamCollaborationImg}
                    alt="Команда работает вместе"
                    sx={{
                        width: '100%',
                        maxWidth: 600,
                        height: 'auto',
                        mb: 4,
                        filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.1))'
                    }}
                />

                {/* Кнопка авторизации */}
                <Box sx={{ 
                    width: '100%', 
                    maxWidth: 300, 
                    mt: 2,
                    transition: 'transform 0.3s',
                    '&:hover': {
                        transform: 'scale(1.03)'
                    }
                }}>
                    <YandexAuthButton isMobile={isMobile} />
                </Box>

                {/* Дополнительный мотивационный текст */}
                <Typography
                    variant="caption"
                    sx={{
                        display: 'block',
                        mt: 3,
                        color: theme.palette.text.secondary,
                        fontStyle: 'italic'
                    }}
                >
                    Первая сессия займет всего 20 минут, а результат удивит вашу команду!
                </Typography>
            </Box>
        </Container>
    );
};

export default Login;