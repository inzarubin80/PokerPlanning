import React from 'react';
import { Box, IconButton } from '@mui/material';
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const UserCardButton = () => {
    const navigate = useNavigate();

    return (
        <Box>
            <IconButton
                onClick={() => navigate('/user')}
                sx={{
                    backgroundColor: '#e0e0e0', // Серый цвет фона
                    boxShadow: 1,
                    transition: 'transform 0.2s',
                    '&:hover': {
                        backgroundColor: '#bdbdbd', // Темно-серый цвет при наведении
                        transform: 'scale(1.1)',
                    },
                }}
            >
                <AccountCircleIcon fontSize="large" />
            </IconButton>
        </Box>
    );
};

export default UserCardButton;