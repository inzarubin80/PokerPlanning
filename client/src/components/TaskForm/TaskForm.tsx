
import React, { useState, useEffect, useMemo } from 'react';
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
  const possibleEstimates: number[] = useSelector((state: RootState) => state.volumeTaskReducer.possibleEstimates);


  const possibleEstimatesTask: number[] = useMemo(()=>{return [0, ...possibleEstimates]}, [possibleEstimates])



  useEffect(() => {
    if (taskId == "-1" && pokerId) {
      const initialTask: Task = {
        ID: -1,
        PokerID: pokerId,
        Title: '',
        Description: '',
        StoryPoint: 0,
        Status: '',
        Completed: false,
        Estimate: 0
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

    if (curentTask.ID == -1) {
      dispatch(addTask({task:curentTask, pokerID:pokerId, callback}))
    } else {
      dispatch(updateTask({task:curentTask, pokerID:pokerId, callback}))
    }
  };

  const handleSetTitle = (title: string) => {
    if (curentTask) {
      dispatch(changeCurrentTask({ ...curentTask, Title: title }))
    }
  };

  const handleSetDescription = (description: string) => {
    if (curentTask) {
      dispatch(changeCurrentTask({ ...curentTask, Description: description }))
    }
  };

  const handleSetEstimate = (estimate: number) => {
    if (curentTask) {
      dispatch(changeCurrentTask({ ...curentTask, Estimate: estimate }))
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
                value={curentTask?.Title}
                onChange={(e) => handleSetTitle(e.target.value)}
                fullWidth
                required
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                label="Описание"
                value={curentTask?.Description}
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
                value={curentTask?.Estimate}
                onChange={(e) => handleSetEstimate(parseInt(e.target.value))}
                fullWidth
                select
                SelectProps={{
                  native: true,
                }}
                required
              >
                  {possibleEstimatesTask.map(item   => (<option key={item.toString()} value={item.toString()}>{item}</option>))}
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