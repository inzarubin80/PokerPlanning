import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

const API_URL = 'api';
const pokerID = '';

interface Task {
  id: number;
  title: string;
}

interface Comment {
  id: number;
  taskID: number;
  text: string;
}

interface Message {
  type: string;
  task?: Task;
  comment?: Comment;
}

interface TaskState {
  tasks: Task[];
  comments: Comment[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  comments: [],
  status: 'idle',
  error: null,
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (pokerID: string) => {
  const response = await axios.get<Task[]>(`${API_URL}/poker/${pokerID}/tasks`);
  return response.data;
});


export const addTask = createAsyncThunk('tasks/addTask', async (task: Omit<Task, 'id'>) => {
  const response = await axios.post<Task>(`${API_URL}/tasks`, task);
  return response.data;
});

export const updateTask = createAsyncThunk('tasks/updateTask', async (task: Task) => {
  const response = await axios.put<Task>(`${API_URL}/tasks/${task.id}`, task);
  return response.data;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (taskId: number) => {
  await axios.post(`${API_URL}/tasks/delete`, { id: taskId });
  return taskId;
});

export const fetchComments = createAsyncThunk('tasks/fetchComments', async () => {
  const response = await axios.get<Comment[]>(`${API_URL}/comments`);
  return response.data;
});

export const addComment = createAsyncThunk('tasks/addComment', async (comment: Omit<Comment, 'id'>) => {
  const response = await axios.post<Comment>(`${API_URL}/comments`, comment);
  return response.data;
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    taskAdded: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    taskRemoved: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    commentAdded: (state, action: PayloadAction<Comment>) => {
      state.comments.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Something went wrong';
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const updatedTask = action.payload;
        const index = state.tasks.findIndex((task) => task.id === updatedTask.id);
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
        const taskId = action.payload;
        state.tasks = state.tasks.filter((task) => task.id !== taskId);
      })
      .addCase(fetchComments.fulfilled, (state, action: PayloadAction<Comment[]>) => {
        state.comments = action.payload;
      })
      .addCase(addComment.fulfilled, (state, action: PayloadAction<Comment>) => {
        state.comments.push(action.payload);
      });
  },
});

export const { taskAdded, taskRemoved, commentAdded } = taskSlice.actions;
export default taskSlice.reducer;

let socket: Socket | null = null;

export const connectWebSocket = (PokerID:string) => (dispatch: any) => {
  socket = io(`${API_URL}/ws/poker/${PokerID}`);
  socket.on('message', (message: Message) => {
    if (message.type === 'ADD_TASK') {
      dispatch(taskAdded(message.task!));
    } else if (message.type === 'REMOVE_TASK') {
      dispatch(taskRemoved(message.task!.id));
    } else if (message.type === 'ADD_COMMENT') {
      dispatch(commentAdded(message.comment!));
    }
  });
};

export const disconnectWebSocket = () => () => {
  if (socket) {
    socket.disconnect();
  }
};