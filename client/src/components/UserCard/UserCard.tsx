import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Box,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'; // Иконка карандаша
import SaveIcon from '@mui/icons-material/Save'; // Иконка сохранения
import CloseIcon from '@mui/icons-material/Close'; // Иконка отмены
import { AppDispatch, RootState } from '../../app/store';
import { useDispatch, useSelector } from 'react-redux';
import { logout, getUser, setIsEditing, setUserName, setUsername, setUserSettings } from '../../features/user/userSlice';


const UserCard: React.FC = () => {
  //const [username, setUsername] = useState<string>('');
  const [originalUsername, setOriginalUsername] = useState<string>(''); // Состояние для исходного имени
  const userName = useSelector((state: RootState) => state.userReducer.userName);
  const isEditing = useSelector((state: RootState) => state.userReducer.isEditing);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getUser());
  }, []);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setUsername(event.target.value));
  };

  // Обработчик сохранения имени
  const handleSaveName = () => {
    dispatch(setUserName(userName))
  };

  // Обработчик входа в режим редактирования
  const handleEditClick = () => {
    setOriginalUsername(userName); // Сохраняем текущее имя
    dispatch(setIsEditing(true)); // Включаем режим редактирования
  };

  // Обработчик отмены редактирования
  const handleCancelEdit = () => {
    dispatch(setUsername(originalUsername)); // Сбрасываем имя к исходному значению
    dispatch(setIsEditing(false)); // Выходим из режима редактирования
  };


  // Обработчик выхода из системы
  const handleLogout = () => {
    dispatch(logout());
  };

  // Генерация чисел Фибоначчи до указанного предела
  const generateFibonacciNumbers = (limit: number): number[] => {
    const fibNumbers: number[] = [1, 2];
    while (fibNumbers[fibNumbers.length - 1] + fibNumbers[fibNumbers.length - 2] <= limit) {
      fibNumbers.push(fibNumbers[fibNumbers.length - 1] + fibNumbers[fibNumbers.length - 2]);
    }
    return fibNumbers;
  };

  const fibonacciNumbers = generateFibonacciNumbers(1000);

  return (
    <Card
      sx={{
        maxWidth: 400,
        margin: 'auto',
        marginTop: 4,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <CardContent>
        {/* Заголовок */}
        <Typography
          variant="h5"
          gutterBottom
          align="center"
          sx={{ fontWeight: 'bold', color: 'primary.main' }}
        >
          Карточка пользователя
        </Typography>

        {/* Поле для ввода нового имени */}
        <Box
          display="flex"
          alignItems="center"
          sx={{ marginBottom: 3 }}
        >
          <TextField
            label="Имя пользователя"
            slotProps={{ inputLabel: { shrink: true } }}
            variant="outlined"
            fullWidth
            value={userName}
            onChange={handleNameChange}
            disabled={!isEditing}
            sx={{
              flexGrow: 1,
              marginRight: 1,
            }}

          />


          {isEditing ? (
            <>
              <IconButton
                onClick={handleSaveName}
                color="primary"
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  marginRight: 1,
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                <SaveIcon />
              </IconButton>
              <IconButton
                onClick={handleCancelEdit}
                color="secondary"
                sx={{
                  backgroundColor: 'error.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'error.dark',
                  },
                }}
              >
                <CloseIcon /> {/* Иконка "Закрыть" для отмены */}
              </IconButton>
            </>
          ) : (
            <IconButton
              onClick={handleEditClick}
              color="primary"
              sx={{
                backgroundColor: 'transparent',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <EditIcon />
            </IconButton>
          )}
        </Box>



        {/* Кнопка выхода из системы */}
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          fullWidth
          sx={{
            marginTop: 2,
            padding: 1.5,
            fontWeight: 'bold',
            boxShadow: 2,
            '&:hover': {
              boxShadow: 3,
            },
          }}
        >
          Выйти из приложения
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserCard;