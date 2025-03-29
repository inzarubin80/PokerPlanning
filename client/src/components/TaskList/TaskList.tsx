import React from 'react';
import { Paper, Typography, Button, Box, List } from '@mui/material';
import { Add } from '@mui/icons-material';
import TaskCard from '../TaskCard/TaskCard';
import { Task } from '../../model/model';

interface TaskListProps {
  tasks: Task[];
  isAdmin: boolean;
  handleEditTask: (id: number) => void;
  handleDeleteTask: (id: number) => void;
  handleSetVotingTask: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  handleEditTask, 
  handleDeleteTask, 
  handleSetVotingTask, 
  isAdmin 
}) => {
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      height="100%" // Занимаем всю доступную высоту
      sx={{
        overflow: 'hidden', // Скрываем переполнение основного контейнера
      }}
    >
      {/* Контейнер для списка задач с возможностью прокрутки */}
      <Box
        flex={1} // Занимает все доступное пространство
        overflow="auto"
      >
        <List disablePadding sx={{ p: 2 }}>
          {tasks.map((task: Task) => (
            <Box key={task.ID.toString()} mb={2}>
              <TaskCard
                task={task}
                isAdmin={isAdmin}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onVote={handleSetVotingTask}
              />
            </Box>
          ))}
        </List>
      </Box>

      {/* Кнопка добавления (только для админа), прижатая к низу */}
      {isAdmin && (
        <Box 
          p={2} 
          borderTop={1} 
          borderColor="divider"
          flexShrink={0} // Запрещаем сжатие
          sx={{
            backgroundColor: 'background.paper', // Фон для кнопки
            position: 'sticky',
            bottom: 0,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => handleEditTask(-1)}
            fullWidth
          >
            Добавить задачу
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TaskList;