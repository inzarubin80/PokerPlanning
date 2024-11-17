import React from 'react';
import { List, ListItemText, ListItemIcon, Checkbox, ListItemButton } from '@mui/material';
import ListItem from '@mui/material/ListItem';

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  toggleTask: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, toggleTask }) => {
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {tasks.map((task) => {
        const labelId = `checkbox-list-label-${task.id}`;

        return (
          <ListItem
            key={task.id}
            disablePadding
          >
            <ListItemButton role={undefined} onClick={() => toggleTask(task.id)} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={task.completed}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={task.title}
                secondary={task.description}
                style={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                }}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default TaskList;