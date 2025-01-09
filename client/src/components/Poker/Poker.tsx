import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Grid2,
  Typography,
  Box,
} from '@mui/material';
import Voting from '../Voting/Voting'
import TaskList from '../TaskList/TaskList'
import Comments from '../Comments/Comments'

import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, taskAdded, taskRemoved, tasksUpdating, deleteTask } from '../../features/task/taskSlice';
import { getUser } from '../../features/user/userSlice';
import { addComment, commentAdded, getComments, SaveCommentParams } from '../../features/comment/commentSlice';
import { setVoteChange, fetchSetVotingTask, fetchVotingControl, setNumberVoters, setUserEstimates, getUserEstimates } from '../../features/voting/votingSlice';
import { fetchPokerDetails, setActiveUsers, setUsers } from '../../features/poker/pokerSlice';
import { AppDispatch, RootState } from '../../app/store';
import WebSocketClient from '../../api/WebSocketClient'
import UserCardBUtton from '../generic/UserCardButton'


const App: React.FC = () => {

  const previousPokerIdRef = useRef<WebSocketClient | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const accessToken = useSelector((state: RootState) => state.userReducer.accessToken);

  const tasks = useSelector((state: RootState) => state.taskReducer.tasks);
  const taskID = useSelector((state: RootState) => state.volumeReducer.taskID);

  const activeUsersID = useSelector((state: RootState) => state.pokerReducer.activeUsersID);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();
  const { pokerId } = useParams<{ pokerId: string }>();

  useEffect(() => {

    if (!pokerId) {
      return;
    }

    dispatch(getUser());
    dispatch(fetchTasks(pokerId));
    dispatch(getComments(pokerId));
    dispatch(fetchVotingControl(pokerId));
    dispatch(fetchPokerDetails(pokerId));
    dispatch(getUserEstimates(pokerId));

  }, [pokerId]);


  useEffect(() => {

    if (!pokerId) {
      return;
    }

    const wsClient = new WebSocketClient(`ws://localhost:8080/ws/${pokerId}?accessToken=${accessToken}`, socketOnMessage);
    return () => {
      wsClient.closeConnection()
    };

  }, [pokerId, accessToken]);


  const socketOnMessage = (msgEvent: any) => {


    const newMessages = msgEvent.data.split("\n").map((message: string) => {
      try {
        return JSON.parse(message);
      } catch (e) {
        console.error("Ошибка парсинга сообщения:", message, e);
        return null; // Если не удалось, возвращаем null
      }
    });


    for (let i = 0; i < newMessages.length; i++) {
      const msg = newMessages[i];
      switch (msg.Action) {
        case 'ADD_TASK':
          dispatch(taskAdded(msg.Task));
          break;
        case 'UPDATE_TASK':
          dispatch(tasksUpdating(msg.Task));
          break;
        case 'REMOVE_TASK':
          dispatch(taskRemoved(msg.taskID));
          break;
        case 'ADD_COMMENT':
          dispatch(commentAdded(msg.Comment));
          break;
        case 'VOTE_STATE_CHANGE':
          dispatch(setVoteChange(msg.State));
          break;
        case 'CHANGE_NUMBER_VOTERS':
          dispatch(setNumberVoters(msg.Count));
          break;
        case 'ADD_VOTING':
          dispatch(setUserEstimates(msg.Estimates));
          break;

        case 'CHANGE_ACTIVE_USERS_POKER':
          dispatch(setActiveUsers(msg.Users));
          break;

        case 'ADD_POKER_USER':
          dispatch(setUsers(msg.Users));
          break;

        default:
          console.warn("Unknown message type:", msg);
      }
    }
  }

  //setActiveUsers

  const handleEditTask = (taskId: number) => {
    navigate(`/poker/${pokerId}/task/${taskId}`);
  };


  const handleDeleteTask = (taskId: number) => {
    if (taskId && pokerId) {
      dispatch(deleteTask({ pokerID: pokerId, taskID: taskId }));
    }
  };

  const handleSetVotingTask = (taskID: number) => {
    if (pokerId) {
      dispatch(fetchSetVotingTask({ pokerID: pokerId, taskID }));
    }
  };

  const handleAddComment = (saveCommentParams: SaveCommentParams) => {
    if (!pokerId) {
      return
    }
    saveCommentParams.pokerID = pokerId
    dispatch(addComment(saveCommentParams))
  };

  const handleEndVoting = () => {

  };

  const handleSettingsToggle = () => {
    setShowSettings(!showSettings);
  };

  //maxWidth="lg" 

  return (
    <Container maxWidth={false}>


      <Box mt={4} mb={4}> {/* Добавлен marginBottom для отступа от элементов ниже */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {/* Центрированный текст */}
          <Box
            display="flex"
            flexGrow={1}
            justifyContent="center"
            alignItems="center"
            sx={{ gap: 2 }} // Добавляем отступ между элементами
          >
            <Typography variant="h4" gutterBottom>
              Покер планирования
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Участники: {activeUsersID.length}
            </Typography>
          </Box>

          <UserCardBUtton />

        </Box>
      </Box>

      <Grid2 container spacing={1} style={{ height: 'calc(100vh - 120px)', display: 'flex' }}>


        <Grid2 size={taskID > 0 ? { xs: 5 } : { xs: 6 }} style={{ display: 'flex', flexDirection: 'column' }}>
          <TaskList
            tasks={tasks}
            handleEditTask={handleEditTask}
            handleDeleteTask={handleDeleteTask}
            handleSetVotingTask={handleSetVotingTask}
            setEditingTask={() => { }} />

        </Grid2>

        <Grid2 size={taskID > 0 ? { xs: 4 } : { xs: 6 }} style={{ display: 'flex', flexDirection: 'column' }}>
          <Voting
            // selectedTask={selectedTask}
            averageEstimate={1}
            averageMethod={""}
            showSettings={showSettings}
            handleSettingsToggle={handleSettingsToggle}
            handleEndVoting={handleEndVoting} />
        </Grid2>



        {taskID > 0 && <Grid2 size={{ xs: 3 }} style={{ display: 'flex', flexDirection: 'column' }}>
          <Comments

            handleAddComment={handleAddComment} />
        </Grid2>}

      </Grid2>


    </Container>
  );
};

export default App;