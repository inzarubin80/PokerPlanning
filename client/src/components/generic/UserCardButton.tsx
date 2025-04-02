import React from 'react';
import { Box, Avatar } from '@mui/material';
import { useNavigate } from "react-router-dom";
import {  useSelector } from 'react-redux';
import {  RootState } from '../../app/store';

function stringToColor(string: string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }


    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }  
    return color;
  }
  
  
function stringAvatar(name?: string | null) {
  // Если name не передано или оно пустое, возвращаем дефолтные значения
  if (!name?.trim()) {
    return {
      sx: {
        bgcolor: '#cccccc', // Серый цвет как fallback
      },
      children: '?', // Заглушка, если имя не определено
    };
  }

  const nameParts = name.trim().split(' ').filter(Boolean); // Удаляем пустые строки

  let children = '';
  if (nameParts.length === 1) {
    children = nameParts[0][0]; // Одно слово → первая буква
  } else if (nameParts.length >= 2) {
    children = nameParts[0][0] + nameParts[1][0]; // Два слова → первые буквы
  }

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: children.toUpperCase(),
  };
}

const UserCardButton = () => {
    const navigate = useNavigate();
     const userName = useSelector((state: RootState) => state.userReducer.userName);

    return (
        <Box>
             <Avatar {...stringAvatar(userName)} onClick={() => navigate('/user')}/>
        </Box>
    );
};

export default UserCardButton;