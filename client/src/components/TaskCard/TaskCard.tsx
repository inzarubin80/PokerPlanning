
import React  from 'react';
import {
  Typography,
  IconButton,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { Edit, Delete, ThumbUp} from '@mui/icons-material';
import { Task } from '../../model'

interface TaskCardProps {
  task: Task;
  onEdit: (id:number)=>void
  onDelete: (id:number)=>void
  onVote: (id:number)=>void
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onVote }) => (
    <Card>
      <CardContent>
        <Typography variant="h6"> ID: {task.id} - {task.title}</Typography>
        <Typography variant="body2">{task.description}</Typography>
        <Typography variant="subtitle2">Оценка: {task.estimate}</Typography>
      </CardContent>
      <CardActions>
        <IconButton edge="end" aria-label="edit" onClick={() => onEdit(task.id)}>
          <Edit />
        </IconButton>
        <IconButton edge="end" aria-label="delete" onClick={() => onDelete(task.id)}>
          <Delete />
        </IconButton>
        <IconButton edge="end" aria-label="vote" onClick={() => onVote(task.id)}>
          <ThumbUp />
        </IconButton>
      </CardActions>
    </Card>
  );

  export default TaskCard