import React from 'react';
import { Box, useMediaQuery, useTheme, Typography } from '@mui/material';
import { Link } from 'react-router-dom'; // Добавляем импорт Link
import UserCardButton from '../generic/UserCardButton';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

const Header: React.FC = ({ }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const activeUsersID = useSelector((state: RootState) => state.pokerReducer.room.activeUsersID);

    return (
        <Box
            sx={{
                p: 1,
                flexShrink: 0,
                position: 'sticky',
                top: 0,
                zIndex: 10,
                backgroundColor: 'background.paper',
                borderBottom: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
        >
            <Box display="flex" alignItems="center" gap={1}>
                <Link 
                    to="/" 
                    style={{ 
                        textDecoration: 'none', 
                        color: 'inherit' 
                    }}
                >
                    <Typography 
                        variant={isMobile ? 'subtitle1' : 'h6'} 
                        noWrap
                        sx={{
                            '&:hover': {
                                color: 'primary.main',
                                cursor: 'pointer'
                            }
                        }}
                    >
                        Покер планирования
                    </Typography>
                </Link>
            </Box>
          
            <Box display="flex" alignItems="center" gap={2}>
                <UserCardButton />
            </Box>
        </Box>
    )
}

export default Header;