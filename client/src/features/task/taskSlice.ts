import { createSlice, createAsyncThunk, PayloadAction, $CombinedState } from '@reduxjs/toolkit';
import { Task } from '../../model'
import axios from "../../service/http-common";

interface Comment {
  id: number;
  taskID: number;
  text: string;
}

interface Message {
  type: string;
  task?: Task;
}

interface TaskState {
  tasks: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  status: 'idle',
  error:   null,
};


export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (pokerID: string) => {
  const response = await axios.get<Task[]>(`/poker/${pokerID}/tasks`);
  return response.data;
});


export const addTask = createAsyncThunk('tasks/addTask', async (task: Omit<Task, 'id'>) => {
  const response = await axios.post<Task>(`/poker/${task.poker_id}/task`, task);
  return response.data;
});

export const updateTask = createAsyncThunk('tasks/updateTask', async (task: Task) => {
  const response = await axios.put<Task>(`/tasks/${task.id}`, task);
  return response.data;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (taskId: number) => {
  await axios.post(`/tasks/delete`, { id: taskId });
  return taskId;
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    taskAdded: (state, action: PayloadAction<Task>) => {
    
      const newState = state.tasks.filter(item=>item.id!==action.payload.id)
      state.tasks = [...newState, action.payload]
   
    },
    taskRemoved: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
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
      
      .addCase(addTask.rejected, (state, action) => {
        state.error = action.error.message ?? 'Something went wrong';
      })

      .addCase(addTask.pending, (state) => {
        state.status = 'loading';
      })

      .addCase(addTask.fulfilled, (state) => {
        state.status = 'succeeded';
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
      });
  },
});

export const { taskAdded, taskRemoved } = taskSlice.actions;
export default taskSlice.reducer;





