import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Container, Box, useMediaQuery, useTheme, Typography } from '@mui/material';
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

// Components
import DesktopView from './DesktopView';
import MobileView from './MobileView';
import UserCardButton from '../generic/UserCardButton';

// Redux actions
import { fetchTasks, updateTaskLocally, removeTaskLocally, deleteTask } from '../../features/task/taskSlice';
import { getUser } from '../../features/user/userSlice';
import { getComments, commentAdded } from '../../features/comment/commentSlice';
import { fetchVotingData, fetchUserEstimations, updateVotingStatusLocal, updateVotersCountAction, updateUserEstimatesAction, setActiveVotingTask } from '../../features/voting/votingSlice';
import { fetchPokerDetails, setUsers, setActiveUsers } from '../../features/poker/pokerSlice';

// Types and utilities
import { AppDispatch, RootState } from '../../app/store';
import WebSocketClient from '../../api/WebSocketClient';

const getWebSocketUrl = (pokerId: string, accessToken: string | null): string => {
  const isProduction = process.env.NODE_ENV === 'production';
  const protocol = isProduction ? process.env.REACT_APP_WS_PROTOCOL || 'wss' : 'ws';
  const domain = isProduction ? process.env.REACT_APP_WS_DOMAIN || 'api.poker-planning.ru' : 'localhost:8090';

  return `${protocol}://${domain}/ws/${pokerId}?accessToken=${accessToken}`;
};

const PokerPlanningApp: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pokerId } = useParams<{ pokerId: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const taskData = useSelector((state: RootState) => state.volumeReducer.taskData);
  const tasks = useSelector((state: RootState) => state.taskReducer.tasks);

  const wsClientRef = useRef<WebSocketClient | null>(null);

  // Selectors
  const accessToken = useSelector((state: RootState) => state.userReducer.accessToken);
  const activeUsersID = useSelector((state: RootState) => state.pokerReducer.activeUsersID);
  const isAdmin = useSelector((state: RootState) => state.pokerReducer.isAdmin);

  const votingTask = useSelector((state: RootState) => state.volumeReducer.taskData.id);
  const navigate = useNavigate();

  const handleDeleteTask = useCallback((taskId: number) => {
    if (taskId && pokerId) {
      dispatch(deleteTask({ pokerID: pokerId, taskID: taskId }));
    }
  }, [dispatch, pokerId]);

  const handleEditTask = useCallback((taskId: number) => {
    navigate(`/poker/${pokerId}/task/${taskId}`);
  }, [navigate, pokerId]);

  // WebSocket message handler
  const handleWebSocketMessage = useCallback((msgEvent: MessageEvent) => {
    const messages = msgEvent.data.split("\n")
      .map((message: string) => {
        try {
          return JSON.parse(message);
        } catch (e) {
          console.error("Error parsing message:", message, e);
          return null;
        }
      })
      .filter(Boolean);

    messages.forEach((msg: any) => {
      switch (msg.Action) {
        case 'ADD_TASK':
          dispatch(updateTaskLocally(msg.Task));
          break;
        case 'UPDATE_TASK':
          dispatch(updateTaskLocally(msg.Task));
          break;
        case 'REMOVE_TASK':
          dispatch(removeTaskLocally(msg.taskID));
          break;
        case 'ADD_COMMENT':
          dispatch(commentAdded(msg.Comment));
          break;
        case 'VOTE_STATE_CHANGE':
          dispatch(updateVotingStatusLocal(msg.State));
          if (pokerId) dispatch(getComments(pokerId));
          break;
        case 'CHANGE_NUMBER_VOTERS':
          dispatch(updateVotersCountAction(msg.Count));
          break;
        case 'ADD_VOTING':
          dispatch(updateUserEstimatesAction(msg.VotingResult));
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
    });
  }, [dispatch, pokerId]);

  const handleSetVotingTask = useCallback((taskID: number) => {
    if (pokerId) {
      dispatch(setActiveVotingTask({ pokerId, taskId: taskID }));
    }
  }, [dispatch, pokerId, isMobile]);

  // Initialize app data
  useEffect(() => {
    if (!pokerId) return;

    dispatch(getUser());
    dispatch(fetchTasks(pokerId));
    dispatch(getComments(pokerId));
    dispatch(fetchVotingData(pokerId));
    dispatch(fetchPokerDetails(pokerId));
    dispatch(fetchUserEstimations(pokerId));
  }, [pokerId, dispatch]);

  // WebSocket connection management
  useEffect(() => {
    if (!pokerId || !accessToken) return;

    const wsUrl = getWebSocketUrl(pokerId, accessToken);
    wsClientRef.current = new WebSocketClient(wsUrl, handleWebSocketMessage);

    return () => {
      wsClientRef.current?.closeConnection();
      wsClientRef.current = null;
    };
  }, [pokerId, accessToken, handleWebSocketMessage]);

  if (!pokerId) {
    return <div>Invalid poker session ID</div>;
  }

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Main content with centering wrapper */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: '#f5f5f5'
        }}
      >
        {isMobile ? (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              maxWidth: '100%',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <MobileView
              pokerId={pokerId}
              isAdmin={isAdmin}
              handleDeleteTask={handleDeleteTask}
              handleEditTask={handleEditTask}
              handleSetVotingTask={handleSetVotingTask}
              taskId={taskData.id}
              tasks={tasks}
              votingTask={votingTask}
            />
          </Box>
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              maxWidth: '95vw',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <DesktopView
              pokerId={pokerId}
              isAdmin={isAdmin}
              handleDeleteTask={handleDeleteTask}
              handleEditTask={handleEditTask}
              handleSetVotingTask={handleSetVotingTask}
              taskId={taskData.id}
              tasks={tasks}
              votingTask={votingTask}
            />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default PokerPlanningApp;
