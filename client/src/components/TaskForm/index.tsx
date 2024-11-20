import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';
import {Task} from '../../model'


interface TaskFormProps {
  addTask: (task: Task) => void;
}


const initialTask: Task = {
  id: 0,
  poker_id: '',
  title: '',
  description: '',
  story_point: 0,
  status: '',
  completed: false
};

const TaskForm: React.FC<TaskFormProps> = ({ addTask }) => {
  const [task, setTask] = useState(initialTask);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.title.trim()) {
      addTask(task);
      setTask(initialTask);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Task Title"
            name="title"
            value={task.title}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Task Description"
            name="description"
            value={task.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Add Task
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default TaskForm;