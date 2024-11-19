import React from 'react';
import { List, ListItemText, ListItemIcon, Checkbox, ListItemButton } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import {Task} from '../../model'

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
            key={task.id.toString()}
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
                primary={task.id.toString() + " " + task.title}
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