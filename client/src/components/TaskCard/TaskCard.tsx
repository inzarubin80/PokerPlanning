
import React  from 'react';
import {
  Typography,
  IconButton,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { Edit, Delete, ThumbUp} from '@mui/icons-material';
import { Task } from '../../model/model'

interface TaskCardProps {
  task: Task;
  onEdit: (id:number)=>void
  onDelete: (id:number)=>void
  onVote: (id:number)=>void
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onVote }) => (
    <Card>
      <CardContent>
        <Typography variant="h6"> ID {task.ID} {task.Title}</Typography>
        <Typography variant="body2">{task.Description}</Typography>
        <Typography variant="subtitle2">Оценка: {task.Estimate}</Typography>
      </CardContent>
      <CardActions>
        <IconButton edge="end" aria-label="edit" onClick={() => onEdit(task.ID)}>
          <Edit />
        </IconButton>
        <IconButton edge="end" aria-label="delete" onClick={() => onDelete(task.ID)}>
          <Delete />
        </IconButton>
        <IconButton edge="end" aria-label="vote" onClick={() => onVote(task.ID)}>
          <ThumbUp />
        </IconButton>
      </CardActions>
    </Card>
  );

  export default TaskCard