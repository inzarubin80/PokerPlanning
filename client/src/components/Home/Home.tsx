import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createPoker } from '../../features/poker/pokerSlice'; // Импортируем действие из slice
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { RootState, AppDispatch } from '../../app/store'; // Убедитесь, что у вас есть тип RootState
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {setUserSettings, getUser} from '../../features/user/userSlice';
import generateFibonacciNumbers from '../../utils/FibonacciNumbers'

// Тип для ошибки
interface ApiError {
  message: string;
  statusCode?: number;
}

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { pokerId, loading, error } = useSelector((state: RootState) => state.pokerReducer);

  const evaluationStrategy = useSelector((state: RootState) => state.userReducer.EvaluationStrategy);
  const maximumScore = useSelector((state: RootState) => state.userReducer.MaximumScore);
  


  const handleCreatePoker = async () => {
    try {
      // Вызываем createPoker через dispatch и разворачиваем результат
      const response = await dispatch(createPoker()).unwrap();
      navigate(`/poker/${response}`); // Переход на страницу с созданным покером
    } catch (err) {
      console.error('Failed to create poker:', err);
    }
  };


  const fibonacciNumbers = generateFibonacciNumbers(1000);


    const handleStrategyChange = (event: any) => {
      dispatch(setUserSettings({ID:-1, EvaluationStrategy:event.target.value, MaximumScore:maximumScore}))
    };
  
    const handleMaxScoreChange = (event: any) => {
      dispatch(setUserSettings({ID:-1, EvaluationStrategy:evaluationStrategy, MaximumScore:event.target.value}))  
    };

    useEffect(() => {
      dispatch(getUser());
    }, []);
    
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Покер планирования
        </Typography>

        <FormControl sx={{ width: '70%', marginBottom: 3 }}> {/* Уменьшили ширину до 70% */}
          <InputLabel>Стратегия оценки</InputLabel>
          <Select
            value={evaluationStrategy}
            onChange={(e) => handleStrategyChange(e)}
            label="Стратегия оценки"
          >
            <MenuItem value="average">Среднее</MenuItem>
            <MenuItem value="maximum">Максимум</MenuItem>
            <MenuItem value="minimum">Минимум</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ width: '70%', marginBottom: 3 }}> {/* Уменьшили ширину до 70% */}
          <InputLabel>Максимальная оценка</InputLabel>
          <Select
            value={maximumScore}
            onChange={(e) => handleMaxScoreChange(e)}
            label="Максимальная оценка"
          >
            {fibonacciNumbers.map((number) => (
              <MenuItem key={number} value={number}>
                {number}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          size="large"
          variant="outlined"
          onClick={handleCreatePoker}
          disabled={loading}
          sx={{ width: '70%', mt: 2 }} 
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