import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../model/model';
import { authAxios } from '../../service/http-common';
import { AxiosError } from 'axios';

// ===== Типы =====
type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

interface TaskState {
  currentTask: Task | null;
  tasks: Task[];
  status: {
    fetch: StatusType;
    get: StatusType;
    save: StatusType;
    delete: StatusType;
  };
  error: {
    fetch: string | null;
    get: string | null;
    save: string | null;
    delete: string | null;
  };
}

interface GetTaskParams {
  pokerID: string;
  taskID: string;
}

interface SaveTaskParams {
  pokerID: string;
  task: Task;
  callback?: () => void;
}

interface DeleteTaskParams {
  pokerID: string;
  taskID: number;
}

// ===== Начальное состояние =====
const initialState: TaskState = {
  currentTask: null,
  tasks: [],
  status: {
    fetch: 'idle',
    get: 'idle',
    save: 'idle',
    delete: 'idle',
  },
  error: {
    fetch: null,
    get: null,
    save: null,
    delete: null,
  },
};

// ===== Утилиты =====
const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message;
  }
  return 'Unknown error occurred';
};

// ===== Асинхронные операции =====
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (pokerID: string, { rejectWithValue }) => {
    try {
      const response = await authAxios.get(`/poker/${pokerID}/tasks`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getTask = createAsyncThunk(
  'tasks/getTask',
  async ({ pokerID, taskID }: GetTaskParams, { rejectWithValue }) => {
    try {
      const response = await authAxios.get(`/poker/${pokerID}/tasks/${taskID}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const saveTask = createAsyncThunk(
  'tasks/saveTask',
  async ({ pokerID, task, callback }: SaveTaskParams, { rejectWithValue }) => {
    try {
      const method = task.ID === -1 ? 'post' : 'put';
      const url = task.ID !== -1
        ? `/poker/${pokerID}/tasks/${task.ID}`
        : `/poker/${pokerID}/tasks`;
      const response = await authAxios[method](url, task);
      callback?.();
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async ({ pokerID, taskID }: DeleteTaskParams, { rejectWithValue }) => {
    try {
      await authAxios.delete(`/poker/${pokerID}/tasks/${taskID}`);
      return taskID;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// ===== Слайс =====
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setCurrentTask: (state, action: PayloadAction<Task>) => {
      state.currentTask = action.payload;
    },
    updateTaskLocally: (state, action: PayloadAction<Task>) => {
      const task = action.payload;
      const index = state.tasks.findIndex(t => t.ID === task.ID);
      index !== -1 ? state.tasks[index] = task : state.tasks.push(task);
    },
    removeTaskLocally: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter(task => task.ID !== action.payload);
    },
  },
  extraReducers: (builder) => {
    const handleStatus = (
      state: TaskState,
      key: keyof TaskState['status'],
      status: StatusType,
      error: string | null = null
    ) => {
      state.status[key] = status;
      if (error !== null) state.error[key] = error;
    };

    builder
      .addCase(fetchTasks.pending, (state) => handleStatus(state, 'fetch', 'loading'))
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        handleStatus(state, 'fetch', 'succeeded');
      })
      .addCase(fetchTasks.rejected, (state, action) => 
        handleStatus(state, 'fetch', 'failed', action.payload as string))

      .addCase(getTask.pending, (state) => {
        state.currentTask = null;
        handleStatus(state, 'get', 'loading');
      })
      .addCase(getTask.fulfilled, (state, action) => {
        state.currentTask = action.payload;
        handleStatus(state, 'get', 'succeeded');
      })
      .addCase(getTask.rejected, (state, action) => 
        handleStatus(state, 'get', 'failed', action.payload as string))

      .addCase(saveTask.pending, (state) => handleStatus(state, 'save', 'loading'))
      .addCase(saveTask.fulfilled, (state) => handleStatus(state, 'save', 'succeeded'))
      .addCase(saveTask.rejected, (state, action) => 
        handleStatus(state, 'save', 'failed', action.payload as string))

      .addCase(deleteTask.pending, (state) => handleStatus(state, 'delete', 'loading'))
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task.ID !== action.payload);
        handleStatus(state, 'delete', 'succeeded');
      })
      .addCase(deleteTask.rejected, (state, action) => 
        handleStatus(state, 'delete', 'failed', action.payload as string));
  },
});

export const { setCurrentTask, updateTaskLocally, removeTaskLocally } = taskSlice.actions;
export default taskSlice.reducer;