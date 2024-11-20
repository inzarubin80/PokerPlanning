import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography } from '@mui/material';
import TaskForm from '../TaskForm';
import TaskList from '../TaskList';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, taskAdded, updateTask, deleteTask, addTask} from '../../features/task/taskSlice';
import { AppDispatch, RootState } from '../../app/store';
import { Task } from '../../model'
import WebSocketClient from '../../api/WebSocketClient'



const TaskManager: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.taskReducer.tasks);
  const status = useSelector((state: RootState) => state.taskReducer.status);
  const error = useSelector((state: RootState) => state.taskReducer.error);
  const { pokerId } = useParams<{ pokerId: string }>();
  const previousPokerIdRef = useRef<WebSocketClient | null>(null);
  
  const socketOnMessage = (msgEvent: any) => {
    const msg = JSON.parse(msgEvent.data);
    switch (msg.action) {
      case 'ADD_TASK':
        dispatch(taskAdded(msg.task));
        break;
      case 'REMOVE_TASK':
        dispatch(deleteTask(msg.task.id));
        break;
      default:
        console.warn("Unknown message type:", msg.type);
    }
  }

  useEffect(() => {

    if (!pokerId) {
      return;
    }

    console.log("useEffect pokerId", pokerId)

    const url = `ws://localhost:8080/ws/${pokerId}`

    if (!(previousPokerIdRef.current) || (previousPokerIdRef.current.getUrl() !== url) || !previousPokerIdRef.current.isOpen())  {
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


  

  const handleAddTask = (newTask:Task) => {
    if (pokerId) {
      newTask.poker_id  = pokerId;
    }
    dispatch(addTask(newTask));
    };


  const handleUpdateTask = (task: Task) => {
    const updatedTask = { ...task, title: 'Updated Task' };
    dispatch(updateTask(updatedTask));
  };

  const handleDeleteTask = (taskId: number) => {
    dispatch(deleteTask(taskId));
  };


  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Task Manager
      </Typography>
    
      <TaskForm addTask={handleAddTask} />
      <TaskList tasks={tasks} toggleTask={() => { }} /> *

    </Container>
  );
};

export default TaskManager;