
import React from 'react';
import { Box, useMediaQuery, useTheme, Typography } from '@mui/material';
import UserCardButton from '../generic/UserCardButton';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

const Header: React.FC = ({ }) => {
  
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const activeUsersID = useSelector((state: RootState) => state.pokerReducer.activeUsersID);

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
          <Typography variant={isMobile ? 'subtitle1' : 'h6'} noWrap>
            Покер планирования
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ({activeUsersID.length})
          </Typography>
        </Box>
        {!isMobile && <Typography variant="caption" color="text.secondary">
          Обратная связь: inzarubin80@yandex.ru
        </Typography>}
        <Box display="flex" alignItems="center" gap={2}>
           <UserCardButton />
        </Box>

      </Box>
    )

}

export default Header;
