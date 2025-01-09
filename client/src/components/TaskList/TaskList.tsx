import React, { useState } from 'react';
import {
  Grid2,
  Paper,
  Typography,
  Button,
  Box,
  List,
} from '@mui/material';
import { Task } from '../../model/model'
import { Add } from '@mui/icons-material';
import TaskCard from '../TaskCard/TaskCard'

interface TaskListProps {
  tasks: Task[];
  handleEditTask: (id: number) => void
  handleDeleteTask: (id: number) => void
  handleSetVotingTask: (id: number) => void
  setEditingTask: (task: Task | null) => void
}

const TaskList: React.FC<TaskListProps> = ({ tasks, handleEditTask, handleDeleteTask, handleSetVotingTask, setEditingTask }) => {
  
  return(
  <Paper elevation={3}>
    <Box position="sticky" top={0}  bgcolor="grey.200" zIndex={1} p={2} display="flex" justifyContent="center" height={"4vh"}>
      <Typography variant="h6">Задачи</Typography>
    </Box>
    <Box display="flex" height="80vh" flexDirection="column" justifyContent="space-between">
      <Box p={1} overflow="auto">
        <List>
          {tasks.map((task: Task) => (
            <Box key={task.ID.toString()} mb={2}>
              <TaskCard
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onVote={handleSetVotingTask}
              />
            </Box>
          ))}
        </List>
      </Box>
      <Box p={2} display="flex" flexDirection="column" justifyContent="flex-start">
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleEditTask(-1)}
       
        >
          Добавить задачу
        </Button>
      </Box>
    </Box>
  </Paper>
)
}

export default TaskList