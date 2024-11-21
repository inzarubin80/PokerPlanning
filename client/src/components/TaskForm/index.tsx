
import React, { useState, useEffect } from 'react';
import { Task } from '../../model';
import {
  Button,
  TextField,
  Grid2,
  Container,
  Typography,
  Paper,
  Box,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useNavigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getTask, changeCurrentTask, addTask, updateTask } from '../../features/task/taskSlice';
import { AppDispatch, RootState } from '../../app/store';

interface TaskFormProps {

}

const TaskForm: React.FC<TaskFormProps> = ({ }) => {

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const curentTask = useSelector((state: RootState) => state.taskReducer.curentTask);
  const status = useSelector((state: RootState) => state.taskReducer.statusSaveTask);
  const error = useSelector((state: RootState) => state.taskReducer.errorSaveTask);
  const { pokerId, taskId } = useParams<{ pokerId?: string; taskId?: string }>();

  useEffect(() => {
    if (taskId == "-1" && pokerId) {
      const initialTask: Task = {
        id: -1,
        poker_id: pokerId,
        title: '',
        description: '',
        story_point: 0,
        status: '',
        completed: false,
        estimate: 'xs'
      };

      dispatch(changeCurrentTask(initialTask))

    } else if (taskId && pokerId && taskId !== "-1") {
      dispatch(getTask({ taskID: taskId, pokerID: pokerId }))
    }
  }, []);


  const callback = ()=> {
    navigate(-1);
  }

  const handleSubmit = (e: React.FormEvent) => {

    if (!pokerId) {
      return;
    }

    if (!curentTask) {
      return
    }

    e.preventDefault();

    if (curentTask.id == -1) {
      dispatch(addTask({task:curentTask, pokerID:pokerId, callback}))
    } else {
      dispatch(updateTask({task:curentTask, pokerID:pokerId, callback}))
    }
  };

  const handleSetTitle = (title: string) => {
    if (curentTask) {
      dispatch(changeCurrentTask({ ...curentTask, title: title }))
    }
  };

  const handleSetDescription = (description: string) => {
    if (curentTask) {
      dispatch(changeCurrentTask({ ...curentTask, description: description }))
    }
  };

  const handleSetEstimate = (estimate: string) => {
    if (curentTask) {
      dispatch(changeCurrentTask({ ...curentTask, estimate: estimate }))
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          {(taskId != "-1") ? 'Редактировать задачу' : 'Создать новую задачу'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                label="Заголовок"
                value={curentTask?.title}
                onChange={(e) => handleSetTitle(e.target.value)}
                fullWidth
                required
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                label="Описание"
                value={curentTask?.description}
                onChange={(e) => handleSetDescription(e.target.value)}
                fullWidth
                multiline
                rows={4}
                required
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                label="Оценка"
                value={curentTask?.estimate}
                onChange={(e) => handleSetEstimate(e.target.value as Task['estimate'])}
                fullWidth
                select
                SelectProps={{
                  native: true,
                }}
                required
              >
                <option value="xs">XS</option>
                <option value="s">S</option>
                <option value="m">M</option>
              </TextField>
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <Box display="flex" justifyContent="flex-end">
                <Button type="submit" variant="contained" color="primary">
                  Сохранить
                </Button>
              </Box>
            </Grid2>
          </Grid2>
        </form>
      </Paper>
    </Container>
  );
};

export default TaskForm;