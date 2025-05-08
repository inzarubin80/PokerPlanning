import React from 'react';
import { Box, useMediaQuery, useTheme, Typography } from '@mui/material';
import { Link } from 'react-router-dom'; // Добавляем импорт Link
import UserCardButton from '../generic/UserCardButton';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { getUser } from '../../features/user/userSlice';
import { useEffect } from 'react';


const Header: React.FC = ({ }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const activeUsersID = useSelector((state: RootState) => state.pokerReducer.room.activeUsersID);
  
    const dispatch = useDispatch<AppDispatch>();

      useEffect(() => {
        dispatch(getUser());
      }, [dispatch]);

    return (
        <Box
        sx={{
            p: 1,
            flexShrink: 0, // Важно!
            backgroundColor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            boxSizing: 'border-box', // Важно!
            height: { xs: 56, md: 64 }, // 56px на мобильных, 64px на десктопе
            minHeight: { xs: 56, md: 64 }, // Фиксированная минимальная высота

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