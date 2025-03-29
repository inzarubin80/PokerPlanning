import React, { useEffect } from 'react';
import { Task } from '../../model/model';
import {
  Button,
  TextField,
  Grid,
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTask, setCurrentTask, saveTask } from '../../features/task/taskSlice';
import { AppDispatch, RootState } from '../../app/store';

interface TaskFormProps {}



const initialTask: Task = {
  ID: -1, // Добавляем временный ID для новой задачи
  PokerID: '',
  Title: '',
  Description: '',
  StoryPoint: 0,
  Status: '',
  Completed: false,
  Estimate: 0
};

const TaskForm: React.FC<TaskFormProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { pokerId, taskId } = useParams<{ pokerId: string; taskId: string }>();
  
  const { currentTask, status, error, statusSave } = useSelector((state: RootState) => ({
    currentTask: state.taskReducer.currentTask,
    status: state.taskReducer.status.get,
    error: state.taskReducer.error.get,
    statusSave: state.taskReducer.status.save
  }));

 
  useEffect(() => {
    if (!pokerId) return;

    if (taskId === "-1") {
      dispatch(setCurrentTask({ 
        ...initialTask, 
        PokerID: pokerId,
        ID: -1 // Явно указываем временный ID
      }));
    } else if (taskId) {
      dispatch(getTask({ pokerID: pokerId, taskID: taskId }));
    }
  }, [dispatch, pokerId, taskId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTask || !pokerId) return;
    
    dispatch(saveTask({
      pokerID: pokerId,
      task: currentTask,
      callback: () => navigate(-1)
    }));
  };

  const handleFieldChange = (field: keyof Task) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!currentTask) return;
      
      const value = field === 'Estimate' 
        ? parseInt(e.target.value) || 0
        : e.target.value;
      
      dispatch(setCurrentTask({ 
        ...currentTask, 
        [field]: value 
      }));
    };

  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'failed') {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {taskId === "-1" ? 'Создать новую задачу' : 'Редактировать задачу'}
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Заголовок"
                value={currentTask?.Title || ''}
                onChange={handleFieldChange('Title')}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Описание"
                value={currentTask?.Description || ''}
                onChange={handleFieldChange('Description')}
                fullWidth
                multiline
                rows={4}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Оценка"
                type="number"
                value={currentTask?.Estimate || 0}
                onChange={handleFieldChange('Estimate')}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={statusSave === 'loading'}
                >
                  Сохранить
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default TaskForm;