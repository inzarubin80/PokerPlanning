import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import TaskList from '../TaskList/TaskList';
import Voting from '../Voting/Voting';
import Comments from '../Comments/Comments';
import { Task } from '../../model/model';

interface MobileViewProps {
  pokerId: string;
  isAdmin: boolean;
  taskId:number 
  tasks: Task[]
  handleEditTask: (id: number) => void;
  handleDeleteTask: (id: number) => void;
  handleSetVotingTask: (id: number) => void;
}

const MobileView: React.FC<MobileViewProps> = ({ pokerId, isAdmin, taskId, tasks, handleEditTask, handleDeleteTask, handleSetVotingTask}) => {
  const [activeView, setActiveView] = useState<'tasks' | 'voting' | 'comments'>('tasks');
  const [showSettings, setShowSettings] = useState(false);

  const handleSettingsToggle = () => {
    setShowSettings(prev => !prev);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      overflow: 'hidden'
    }}>
      {/* Mobile navigation */}
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 1, 
          p: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
          flexShrink: 0,
          backgroundColor: 'background.paper'
        }}
      >
        <Button 
          variant={activeView === 'tasks' ? 'contained' : 'outlined'} 
          onClick={() => setActiveView('tasks')}
          size="small"
          fullWidth
          
       

        >
          Задачи
        </Button>
        <Button 
          variant={activeView === 'voting' ? 'contained' : 'outlined'} 
          onClick={() => setActiveView('voting')}
          size="small"
          fullWidth
          disabled={taskId<= 0}
          color="secondary"
        
        >
          Голосование
        </Button>
        <Button 
          variant={activeView === 'comments' ? 'contained' : 'outlined'} 
          onClick={() => setActiveView('comments')}
          size="small"
          fullWidth
          disabled={taskId<= 0}
          color={"info"}
        >
          Комментарии
        </Button>
      </Box>
      
      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {activeView === 'tasks' && (
          <TaskList
            tasks={tasks}
            isAdmin={isAdmin}
            handleEditTask={handleEditTask}
            handleDeleteTask={handleDeleteTask}
            handleSetVotingTask={handleSetVotingTask}
          />
        )}
        {activeView === 'voting' && (
          <Voting
            averageEstimate={1}
            averageMethod={""}
            isAdmin={isAdmin}
            handleSettingsToggle={handleSettingsToggle}
          />
        )}
        {activeView === 'comments' && (
          <Comments pokerID={pokerId}/>
        )}
      </Box>
      
    </Box>
  );
};

export default MobileView;