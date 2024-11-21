import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Grid2,
  Typography,
  Box,
} from '@mui/material';
import Voting from '../Voting'
import TaskList from '../TaskList'
import Comments from '../Comments'
import { Task } from '../../model'
import { CommentItem } from '../../model'
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, taskAdded, deleteTask, tasksUpdating} from '../../features/task/taskSlice';
import { AppDispatch, RootState } from '../../app/store';
import WebSocketClient from '../../api/WebSocketClient'


const App: React.FC = () => {

  const previousPokerIdRef = useRef<WebSocketClient | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.taskReducer.tasks);
  const status = useSelector((state: RootState) => state.taskReducer.statusFetchTasks);
  const error = useSelector((state: RootState) => state.taskReducer.errorFetchTasks);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [participants, setParticipants] = useState(1); // Добавлено состояние для количества участников
  const navigate = useNavigate();
  const { pokerId } = useParams<{ pokerId: string }>();

  useEffect(() => {

    if (!pokerId) {
      return;
    }

    const url = `ws://localhost:8080/ws/${pokerId}`

    if (!(previousPokerIdRef.current) || (previousPokerIdRef.current.getUrl() !== url) || !previousPokerIdRef.current.isOpen()) {
      dispatch(fetchTasks(pokerId));
      previousPokerIdRef.current = new WebSocketClient(url, socketOnMessage);
    }

    return () => {
      if (previousPokerIdRef.current) {
        console.log("closeConnection --useEffect");
        previousPokerIdRef.current.closeConnection()
      }
    };

  }, [pokerId]);

  const socketOnMessage = (msgEvent: any) => {
    const msg = JSON.parse(msgEvent.data);
    switch (msg.action) {
      case 'ADD_TASK':
        dispatch(taskAdded(msg.task));
        break;
      case 'UPDATE_TASK':
          dispatch(tasksUpdating(msg.task));
          break;     
      case 'REMOVE_TASK':
        dispatch(deleteTask(msg.task.id));
        break;
      default:
        console.warn("Unknown message type:", msg.type);
    }
  }

  const handleEditTask = (taskId: number) => {
    navigate(`/poker/${pokerId}/task/${taskId}`);
  };


  const handleDeleteTask = (taskId: number) => {
    //const updatedTasks = tasks.filter((t) => t.id !== taskId);
    //setTasks(updatedTasks);
  };

  const handleVote = (taskId: number) => {

  };

  const handleAddComment = (text: string) => {
    setComments([...comments, { id: comments.length + 1, text, author: 'Убойный кодер' }]);
  };

  const handleEndVoting = () => {

  };

  const handleSettingsToggle = () => {
    setShowSettings(!showSettings);
  };

  return (
    <Container maxWidth="lg">
      <Box mt={4}>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography variant="h4" gutterBottom>
            Покер планирования
          </Typography>
          <Box ml={2}>
            <Typography variant="subtitle1" color="textSecondary">
              Участники: {participants}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Grid2 container spacing={3}>

        <Voting
          selectedTask={selectedTask}
          averageEstimate={1}
          averageMethod={""}
          showSettings={showSettings}
          numberVoters={1}
          handleSettingsToggle={handleSettingsToggle}
          handleVote={handleVote}
          handleEndVoting={handleEndVoting} />

        <TaskList
          tasks={tasks}
          handleEditTask={handleEditTask}
          handleDeleteTask={handleDeleteTask}
          handleVote={handleVote}
          setEditingTask={() => { }} />

        <Comments
          comments={comments}
          handleAddComment={handleAddComment} />

      </Grid2>


    </Container>
  );
};

export default App;