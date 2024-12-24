import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createPoker } from '../../features/poker/pokerSlice'; // Импортируем действие из slice
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { RootState, AppDispatch } from '../../app/store'; // Убедитесь, что у вас есть тип RootState
// Тип для ошибки
interface ApiError {
  message: string;
  statusCode?: number;
}

function Home() {
  const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
  const { pokerId, loading, error } = useSelector((state: RootState) => state.poker);

  const handleCreatePoker = async () => {
    try {
      // Вызываем createPoker через dispatch и разворачиваем результат
      const response = await dispatch(createPoker()).unwrap();
      console.log('Poker created with ID:', response);
      navigate(`/poker/${response}`); // Переход на страницу с созданным покером
    } catch (err) {
      console.error('Failed to create poker:', err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Покер планирования
        </Typography>
        <Button
          size="large"
          variant="outlined"
          onClick={handleCreatePoker}
          disabled={loading}
        >
          {loading ? 'Создание...' : 'Создать'}
        </Button>
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Ошибка: {error}
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default Home;