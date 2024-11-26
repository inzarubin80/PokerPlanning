import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../model';

interface ErrorResponse {
  error: boolean;
  message: string;
}

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
  curentTask:Task|null
  tasks: Task[];
  
  statusFetchTasks: 'idle' | 'loading' | 'succeeded' | 'failed';
  errorFetchTasks: string | null;
  
  statusGetTask:'idle' | 'loading' | 'succeeded' | 'failed';
  errorGetTask: string | null;
  
  statusSaveTask: 'idle' | 'loading' | 'succeeded' | 'failed';
  errorSaveTask: string | null;
  
  statusDeleteTask: 'idle' | 'loading' | 'succeeded' | 'failed';
  errorDeleteTask: string | null;
  
}

const initialState: TaskState = {
  tasks: [],
  statusFetchTasks: 'idle',
  statusGetTask:'idle',
  statusSaveTask:'idle',
  statusDeleteTask:'idle',
  
  errorFetchTasks: null,
  errorGetTask:null,
  errorSaveTask:null,
  
  errorDeleteTask:null,
  curentTask:null,

};

interface GetTaskParams {
  pokerID: string;
  taskID: string;
}

interface SaveTaskParams {
  pokerID: string;
  task: Task;
  callback:()=>void|null
}

interface DeleteTaskParams {
  pokerID: string;
  taskID: number;
}


export const getTask = createAsyncThunk(
  'tasks/getTask',
  async (params: GetTaskParams) => {
    const { pokerID, taskID } = params;
    const response = await fetch(`/api/poker/${pokerID}/tasks/${taskID}`);
    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message);
    }
    const data = await response.json();
    return data;
  }
);

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (pokerID: string) => {
  const response = await fetch(`/api/poker/${pokerID}/tasks`);
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.message);
  }
  const data = await response.json();
  return data;
});


export const addTask = createAsyncThunk('tasks/addTask', async (params: SaveTaskParams) => {
  
  const { pokerID, task, callback} = params;

  const response = await fetch(`/api/poker/${pokerID}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.message);
  }  else if (callback) {
    callback()
  }
  const data = await response.json();
  return data;
});

export const updateTask = createAsyncThunk('tasks/updateTask', async (params: SaveTaskParams) => {
  const { pokerID, task, callback } = params;
 
  const response = await fetch(`/api/poker/${pokerID}/tasks/${task.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.message);
  } else if (callback) {
    callback()
  }
  const data = await response.json();
  return data;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (params: DeleteTaskParams) => {
  const { pokerID, taskID } = params;
  const response = await fetch(`/api/poker/${pokerID}/tasks/${taskID}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.message);
  }
  return taskID;
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    
    taskAdded: (state, action: PayloadAction<Task>) => {
      const updatedTask = action.payload;
      const index = state.tasks.findIndex((task) => task.id === updatedTask.id);
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        } else {
          state.tasks.push(updatedTask)
        }
    },

    tasksUpdating: (state, action: PayloadAction<Task>) => {
      const updatedTask = action.payload;
        const index = state.tasks.findIndex((task) => task.id === updatedTask.id);
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
    },

    changeCurrentTask: (state, action: PayloadAction<Task>) => {
      state.curentTask = action.payload;
    },

    taskRemoved: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },


  },
  extraReducers: (builder) => {
    builder
    
      //'tasks/fetchTasks'
      .addCase(fetchTasks.pending, (state) => {
        state.statusFetchTasks = 'loading';
        state.errorFetchTasks = ''
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.statusFetchTasks = 'succeeded';
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.statusFetchTasks = 'failed';
        state.errorFetchTasks = action.error.message ?? 'Something went wrong';
      })

      //'tasks/addTask'
      .addCase(addTask.rejected, (state, action) => {
        console.log("addTask.rejected", action);
        state.statusSaveTask = 'failed';
        state.errorSaveTask  = action.error.message ?? 'Something went wrong';
      })
      .addCase(addTask.pending, (state) => {
        state.statusSaveTask = 'loading';
        state.errorSaveTask  = ''
      })
      .addCase(addTask.fulfilled, (state) => {
        state.statusSaveTask = 'succeeded';
      })

      //'tasks/updateTask'
      .addCase(updateTask.rejected, (state, action) => {
        state.statusSaveTask = 'failed';
        state.errorSaveTask = action.error.message ?? 'Something went wrong';
      })
      
      .addCase(updateTask.pending, (state) => {
        state.statusSaveTask = 'loading';
        state.errorSaveTask  = ''
      })

      .addCase(updateTask.fulfilled, (state) => {
        state.statusSaveTask = 'succeeded';
      })

      //'tasks/deleteTask'
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.statusDeleteTask = 'succeeded';
   
      })

      .addCase(deleteTask.pending, (state, action) => {
        state.statusDeleteTask = 'loading';
        state.errorDeleteTask  = ''
      })

      .addCase(deleteTask.rejected, (state, action) => {
        state.statusDeleteTask = 'failed';
        state.errorDeleteTask  = action.error.message ?? 'Something went wrong';
      })


      //'tasks/getTask'
      .addCase(getTask.pending, (state) => {
        state.statusGetTask = 'loading';
        state.curentTask = null
        state.errorGetTask = ''
      })
      .addCase(getTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.statusGetTask = 'succeeded';
        state.curentTask = action.payload;
      })
      .addCase(getTask.rejected, (state, action) => {
        state.statusGetTask = 'failed';
        state.errorGetTask = action.error.message ?? 'Something went wrong';
      })


      ;
  },
});

export const { taskAdded, taskRemoved, changeCurrentTask,tasksUpdating} = taskSlice.actions;
export default taskSlice.reducer;