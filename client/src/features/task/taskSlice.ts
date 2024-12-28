import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../model';
import { authAxios } from '../../service/http-common';
import { AxiosError } from 'axios';

interface ErrorResponse {
  error: boolean;
  message: string;
}

interface TaskState {
  curentTask: Task | null;
  tasks: Task[];

  statusFetchTasks: 'idle' | 'loading' | 'succeeded' | 'failed';
  errorFetchTasks: string | null;

  statusGetTask: 'idle' | 'loading' | 'succeeded' | 'failed';
  errorGetTask: string | null;

  statusSaveTask: 'idle' | 'loading' | 'succeeded' | 'failed';
  errorSaveTask: string | null;

  statusDeleteTask: 'idle' | 'loading' | 'succeeded' | 'failed';
  errorDeleteTask: string | null;


  
}

const initialState: TaskState = {
  tasks: [],
  statusFetchTasks: 'idle',
  statusGetTask: 'idle',
  statusSaveTask: 'idle',
  statusDeleteTask: 'idle',

  errorFetchTasks: null,
  errorGetTask: null,
  errorSaveTask: null,
  errorDeleteTask: null,
  curentTask: null,
};

interface GetTaskParams {
  pokerID: string;
  taskID: string;
}

interface SaveTaskParams {
  pokerID: string;
  task: Task;
  callback: () => void | null;
}

interface DeleteTaskParams {
  pokerID: string;
  taskID: number;
}

// Функция для обработки ошибок Axios
const handleAxiosError = (error: unknown): string => {
  if (error instanceof AxiosError && error.response && error.response.data) {
    return error.response.data.message;
  }
  return 'Something went wrong';
};

export const getTask = createAsyncThunk(
  'tasks/getTask',
  async (params: GetTaskParams, { rejectWithValue }) => {
    const { pokerID, taskID } = params;
    try {
      const response = await authAxios.get(`/poker/${pokerID}/tasks/${taskID}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (pokerID: string, { rejectWithValue }) => {
    try {
      const response = await authAxios.get(`/poker/${pokerID}/tasks`);
      return response.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (params: SaveTaskParams, { rejectWithValue }) => {
    const { pokerID, task, callback } = params;
    try {
      const response = await authAxios.post(`/poker/${pokerID}/tasks`, task);
      if (callback) callback();
      return response.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (params: SaveTaskParams, { rejectWithValue }) => {
    const { pokerID, task, callback } = params;
    try {
      const response = await authAxios.put(`/poker/${pokerID}/tasks/${task.ID}`, task);
      if (callback) callback();
      return response.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (params: DeleteTaskParams, { rejectWithValue }) => {
    const { pokerID, taskID } = params;
    try {
      await authAxios.delete(`/poker/${pokerID}/tasks/${taskID}`);
      return taskID;
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    taskAdded: (state, action: PayloadAction<Task>) => {

      const updatedTask = action.payload;
      const index = state.tasks.findIndex((task) => task.ID === updatedTask.ID);
      if (index !== -1) {
        state.tasks[index] = updatedTask;
      } else {
        state.tasks.push(updatedTask);
      }
    },

    tasksUpdating: (state, action: PayloadAction<Task>) => {
      const updatedTask = action.payload;

      const index = state.tasks.findIndex((task) => task.ID === updatedTask.ID);
      if (index !== -1) {
        state.tasks[index] = updatedTask;
      }
    },

    changeCurrentTask: (state, action: PayloadAction<Task>) => {
      state.curentTask = action.payload;
    },

    taskRemoved: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter((task) => task.ID !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // 'tasks/fetchTasks'
      .addCase(fetchTasks.pending, (state) => {
        state.statusFetchTasks = 'loading';
        state.errorFetchTasks = '';
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.statusFetchTasks = 'succeeded';
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.statusFetchTasks = 'failed';
        state.errorFetchTasks = action.payload as string;
      })

      // 'tasks/addTask'
      .addCase(addTask.pending, (state) => {
        state.statusSaveTask = 'loading';
        state.errorSaveTask = '';
      })
      .addCase(addTask.fulfilled, (state) => {
        state.statusSaveTask = 'succeeded';
      })
      .addCase(addTask.rejected, (state, action) => {
        state.statusSaveTask = 'failed';
        state.errorSaveTask = action.payload as string;
      })

      // 'tasks/updateTask'
      .addCase(updateTask.pending, (state) => {
        state.statusSaveTask = 'loading';
        state.errorSaveTask = '';
      })
      .addCase(updateTask.fulfilled, (state) => {
        state.statusSaveTask = 'succeeded';
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.statusSaveTask = 'failed';
        state.errorSaveTask = action.payload as string;
      })

      // 'tasks/deleteTask'
      .addCase(deleteTask.pending, (state) => {
        state.statusDeleteTask = 'loading';
        state.errorDeleteTask = '';
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.statusDeleteTask = 'succeeded';
        state.tasks = state.tasks.filter((task) => task.ID !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.statusDeleteTask = 'failed';
        state.errorDeleteTask = action.payload as string;
      })

      // 'tasks/getTask'
      .addCase(getTask.pending, (state) => {
        state.statusGetTask = 'loading';
        state.curentTask = null;
        state.errorGetTask = '';
      })
      .addCase(getTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.statusGetTask = 'succeeded';
        state.curentTask = action.payload;
      })
      .addCase(getTask.rejected, (state, action) => {
        state.statusGetTask = 'failed';
        state.errorGetTask = action.payload as string;
      });
  },
});

export const { taskAdded, taskRemoved, changeCurrentTask, tasksUpdating } = taskSlice.actions;
export default taskSlice.reducer;