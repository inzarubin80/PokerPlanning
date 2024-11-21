
import React, { useState } from 'react';
import {
  Grid2,
  Paper,
  Typography,
  Button,
  Box,
  List,
} from '@mui/material';
import { Task } from '../../model'
import { Add } from '@mui/icons-material';
import TaskCard from '../TaskCard'

interface TaskListProps {
  tasks: Task[];
  handleEditTask: (id: number) => void
  handleDeleteTask: (id: number) => void
  handleVote: (id: number) => void
  setEditingTask: (task: Task | null) => void
}

const TaskList: React.FC<TaskListProps> = ({ tasks, handleEditTask, handleDeleteTask, handleVote, setEditingTask }) => (
  <Grid2 size={{ xs: 6 }}>
    <Paper elevation={3}>
      <Box p={2}>
        <Typography variant="h6">Список задач</Typography>
        <List>
          {tasks.map((task: Task) => (
            <Box key={task.id.toString()} mb={2}>
              <TaskCard
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onVote={handleVote}
              />
            </Box>
          ))}
        </List>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleEditTask(-1)}
        >
          Добавить задачу
        </Button>
      </Box>
    </Paper>
  </Grid2>)


export default TaskList

