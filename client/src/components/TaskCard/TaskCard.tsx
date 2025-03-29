import React from 'react';
import {
  Typography,
  IconButton,
  Card,
  CardContent,
  CardActions,
  useTheme,
  useMediaQuery,
  Box
} from '@mui/material';
import { Edit, Delete, ThumbUp } from '@mui/icons-material';
import { Task } from '../../model/model';

interface TaskCardProps {
  task: Task;
  isAdmin: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onVote: (id: number) => void;
}


const TaskCard: React.FC<TaskCardProps> = ({task, onEdit, onDelete, onVote, isAdmin }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Card sx={{ 
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: 150 // Минимальная высота карточки
    }}>
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6">ID {task.ID} {task.Title}</Typography>
        
        <Typography variant="body2" sx={{ 
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          mb: 1
        }}>
          {task.Description}
        </Typography>
        <Typography variant="subtitle2">Оценка: {task.Estimate}</Typography>
      </CardContent>

      {isAdmin && (
        <Box sx={{ 
          mt: 'auto', // Прижимаем к низу
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <CardActions sx={{
            display: 'flex',
            justifyContent: 'space-around',
            p: 1,
            bgcolor: 'action.hover'
          }}>
            <IconButton 
              size={isSmallScreen ? 'small' : 'medium'}
              aria-label="edit"
              onClick={() => onEdit(task.ID)}
              sx={{ 
                flex: isSmallScreen ? 1 : 0,
                minWidth: 'unset'
              }}
            >
              <Edit fontSize={isSmallScreen ? 'small' : 'medium'} />
              {isSmallScreen && <Typography variant="caption" sx={{ ml: 0.5 }}>Edit</Typography>}
            </IconButton>
            
            <IconButton 
              size={isSmallScreen ? 'small' : 'medium'}
              aria-label="delete"
              onClick={() => onDelete(task.ID)}
              sx={{ 
                flex: isSmallScreen ? 1 : 0,
                minWidth: 'unset'
              }}
            >
              <Delete fontSize={isSmallScreen ? 'small' : 'medium'} />
              {isSmallScreen && <Typography variant="caption" sx={{ ml: 0.5 }}>Delete</Typography>}
            </IconButton>
            
            <IconButton 
              size={isSmallScreen ? 'small' : 'medium'}
              aria-label="vote"
              onClick={() => onVote(task.ID)}
              sx={{ 
                flex: isSmallScreen ? 1 : 0,
                minWidth: 'unset'
              }}
            >
              <ThumbUp fontSize={isSmallScreen ? 'small' : 'medium'} />
              {isSmallScreen && <Typography variant="caption" sx={{ ml: 0.5 }}>Vote</Typography>}
            </IconButton>
          </CardActions>
        </Box>
      )}
    </Card>
  );
};

export default TaskCard;