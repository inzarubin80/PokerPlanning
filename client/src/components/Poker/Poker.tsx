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
import { Task } from '../../model'
import { CommentItem } from '../../model'
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, taskAdded, taskRemoved, tasksUpdating, deleteTask } from '../../features/task/taskSlice';
import { addComment, commentAdded, getComments, SaveCommentParams } from '../../features/comment/commentSlice';
import { setVoteChange, fetchSetVotingTask, fetchVotingControl, setNumberVoters, setUserEstimates, getUserEstimates} from '../../features/voting/voting';
import {fetchPokerDetails} from '../../features/poker/pokerSlice';
import { AppDispatch, RootState } from '../../app/store';
import WebSocketClient from '../../api/WebSocketClient'
import { SettingsVoice } from '@mui/icons-material';



const App: React.FC = () => {

  const previousPokerIdRef = useRef<WebSocketClient | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const tasks = useSelector((state: RootState) => state.taskReducer.tasks);
  const status = useSelector((state: RootState) => state.taskReducer.statusFetchTasks);
  const error = useSelector((state: RootState) => state.taskReducer.errorFetchTasks);

  const comments = useSelector((state: RootState) => state.commentReducer.comments);
  const statusFetchComments = useSelector((state: RootState) => state.commentReducer.statusFetchComments);
  const errorFetchComments = useSelector((state: RootState) => state.commentReducer.errorFetchComments);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [participants, setParticipants] = useState(1);
  const navigate = useNavigate();
  const { pokerId } = useParams<{ pokerId: string }>();

  useEffect(() => {

    if (!pokerId) {
      return;
    }

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
          dispatch(taskAdded(msg.task));
          break;
        case 'UPDATE_TASK':
          dispatch(tasksUpdating(msg.task));
          break;
        case 'REMOVE_TASK':
          dispatch(taskRemoved(msg.task_id));
          break;
        case 'ADD_COMMENT':
          dispatch(commentAdded(msg.comment));
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

        default:
          console.warn("Unknown message type:", msg);
      }
    }
  }

  
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
      <Grid2 container spacing={1} style={{ height: 'calc(100vh - 120px)', display: 'flex' }}>

        <Grid2 size={{ xs: 3 }} style={{ display: 'flex', flexDirection: 'column' }}>
          <Voting
            // selectedTask={selectedTask}
            averageEstimate={1}
            averageMethod={""}
            showSettings={showSettings}
            handleSettingsToggle={handleSettingsToggle}
            handleEndVoting={handleEndVoting} />
        </Grid2>

        <Grid2 size={{ xs: 5 }} style={{ display: 'flex', flexDirection: 'column' }}>
          <Comments
            comments={comments}
            handleAddComment={handleAddComment} />
        </Grid2>

        <Grid2 size={{ xs: 4 }} style={{ display: 'flex', flexDirection: 'column' }}>
          <TaskList
            tasks={tasks}
            handleEditTask={handleEditTask}
            handleDeleteTask={handleDeleteTask}
            handleSetVotingTask={handleSetVotingTask}
            setEditingTask={() => { }} />

        </Grid2>
      </Grid2>


    </Container>
  );
};

export default App;