import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAxios } from '../../service/http-common';
import { AxiosError } from 'axios';
import { VoteControlState, UserEstimate, VotingResult } from '../../model/model';

// Типы и интерфейсы
type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
type VotingActionType = 'start' | 'stop' | 'end' | '';
type VotingActionName = 'Начать голосование' | 'Остановить голосование' | 'Завершить голосование' | '';

interface VotingState {
  taskData: {
    id: number;
    currentVote: number;
    votersCount: number;
    startDate: string | null;
    duration: number;
    endDate: string | null;
    estimates: UserEstimate[];
    progress: number;
    durationSeconds: number;
    remainingSeconds: number;
    finalResult: number;
    votingAction: VotingActionType;
    votingActionName: VotingActionName;
  };
  status: Record<VotingAction, LoadingStatus>;
  error: Record<VotingAction, string | null>;
}

type VotingAction = 
  | 'fetchVotingControl' 
  | 'setVotingTask' 
  | 'fetchUserEstimates' 
  | 'submitVote' 
  | 'updateVotingState';

interface VotingTaskParams {
  pokerId: string;
  taskId: number;
}

interface VoteParams {
  pokerId: string;
  estimate: number;
}

interface VotingStateParams {
  pokerId: string;
  action: string;
  result: number;
}

// Константы
const SLICE_NAME = 'voting';
const DEFAULT_VOTING_DURATION = 30;
const INITIAL_STATUS = 'idle';
const INITIAL_ERROR = null;

const VOTING_ACTIONS: Record<VotingActionType, VotingActionName> = {
  'start': 'Начать голосование',
  'stop': 'Остановить голосование',
  'end': 'Завершить голосование',
  '': ''
};

// Начальное состояние
const initialState: VotingState = {
  taskData: {
    id: 0,
    currentVote: 0,
    votersCount: 0,
    duration: 0,
    endDate: null,
    startDate: null,
    estimates: [],
    progress: 0,
    durationSeconds: DEFAULT_VOTING_DURATION,
    remainingSeconds: 0,
    finalResult: 0,
    votingAction: '',
    votingActionName: '',
  },
  status: {
    fetchVotingControl: INITIAL_STATUS,
    setVotingTask: INITIAL_STATUS,
    fetchUserEstimates: INITIAL_STATUS,
    submitVote: INITIAL_STATUS,
    updateVotingState: INITIAL_STATUS,
  },
  error: {
    fetchVotingControl: INITIAL_ERROR,
    setVotingTask: INITIAL_ERROR,
    fetchUserEstimates: INITIAL_ERROR,
    submitVote: INITIAL_ERROR,
    updateVotingState: INITIAL_ERROR,
  },
};

// Вспомогательные функции
const isZeroDate = (date: string | null): boolean => {
  return !date || date === "0001-01-01T00:00:00Z";
};

const handleApiError = (error: unknown): string => {
  if (error instanceof AxiosError && error.response?.data?.message) {
    return error.response.data.message;
  }
  return error instanceof Error ? error.message : 'Неизвестная ошибка';
};

const getVotingAction = (
  taskId: number, 
  startDate: string | null, 
  endDate: string | null
): { action: VotingActionType, name: VotingActionName } => {
  if (taskId <= 0) return { action: '', name: '' };
  
  if (isZeroDate(startDate)) {
    return { action: 'start', name: VOTING_ACTIONS.start };
  }
  if (!isZeroDate(startDate) && isZeroDate(endDate)) {
    return { action: 'stop', name: VOTING_ACTIONS.stop };
  }
  if (!isZeroDate(startDate) && !isZeroDate(endDate)) {
    return { action: 'end', name: VOTING_ACTIONS.end };
  }
  
  return { action: '', name: '' };
};

const updateVotingData = (state: VotingState, payload: VoteControlState) => {
  const { TaskID, StartDate, EndDate } = payload;
  
  state.taskData.id = TaskID;
  state.taskData.endDate = EndDate;
  state.taskData.startDate = StartDate;
  
  const { action, name } = getVotingAction(TaskID, StartDate, EndDate);
  state.taskData.votingAction = action;
  state.taskData.votingActionName = name;
};

// Асинхронные действия
export const fetchVotingData = createAsyncThunk<VoteControlState, string>(
  `${SLICE_NAME}/fetchControl`,
  async (pokerId: string, { rejectWithValue }) => {
    try {
      const response = await authAxios.get(`/poker/${pokerId}/voting-control`);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchUserEstimations = createAsyncThunk<VotingResult, string>(
  `${SLICE_NAME}/fetchEstimates`,
  async (pokerId: string, { rejectWithValue }) => {
    try {
      const response = await authAxios.get(`/poker/${pokerId}/user-estimates`);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const setActiveVotingTask = createAsyncThunk<number, VotingTaskParams>(
  `${SLICE_NAME}/setTask`,
  async ({ pokerId, taskId }, { rejectWithValue }) => {
    try {
      await authAxios.post(`/poker/${pokerId}/voting-control/task/${taskId}`);
      return taskId;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const submitUserVote = createAsyncThunk<number, VoteParams>(
  `${SLICE_NAME}/submitVote`,
  async ({ pokerId, estimate }, { rejectWithValue }) => {
    try {
      await authAxios.post(`/poker/${pokerId}/vote`, estimate );
      return estimate;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateVotingStatus = createAsyncThunk<void, VotingStateParams>(
  `${SLICE_NAME}/updateState`,
  async ({ pokerId, action, result }, { rejectWithValue }) => {
    try {
      await authAxios.post(`/poker/${pokerId}/voting-control/${action}`, { result });
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Создание slice
const votingSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    updateVotingStatusLocal: (state, action: PayloadAction<VoteControlState>) => {
      updateVotingData(state, action.payload);
    },
    updateVotersCount: (state, action: PayloadAction<number>) => {
      state.taskData.votersCount = action.payload;
    },
    updateVotingResult: (state, action: PayloadAction<number>) => {
      state.taskData.finalResult = action.payload;
    },
    updateEstimations: (state, action: PayloadAction<VotingResult>) => {
      state.taskData.estimates = action.payload.UserEstimates;
      state.taskData.finalResult = action.payload.FinalResult;
    },
    resetVoting: () => initialState,
  },
  extraReducers: (builder) => {
    // Обработчики для fetchVotingData
    builder
      .addCase(fetchVotingData.pending, (state) => {
        state.status.fetchVotingControl = 'loading';
        state.error.fetchVotingControl = null;
      })
      .addCase(fetchVotingData.fulfilled, (state, action: PayloadAction<VoteControlState>) => {
        state.status.fetchVotingControl = 'succeeded';
        updateVotingData(state, action.payload);
      })
      .addCase(fetchVotingData.rejected, (state, action) => {
        state.status.fetchVotingControl = 'failed';
        state.error.fetchVotingControl = action.payload as string;
      });

    // Обработчики для fetchUserEstimations
    builder
      .addCase(fetchUserEstimations.pending, (state) => {
        state.status.fetchUserEstimates = 'loading';
        state.error.fetchUserEstimates = null;
      })
      .addCase(fetchUserEstimations.fulfilled, (state, action: PayloadAction<VotingResult>) => {
        state.status.fetchUserEstimates = 'succeeded';
        state.taskData.estimates = action.payload.UserEstimates;
        state.taskData.finalResult = action.payload.FinalResult;
      })
      .addCase(fetchUserEstimations.rejected, (state, action) => {
        state.status.fetchUserEstimates = 'failed';
        state.error.fetchUserEstimates = action.payload as string;
      });

    // Обработчики для setActiveVotingTask
    builder
      .addCase(setActiveVotingTask.pending, (state) => {
        state.status.setVotingTask = 'loading';
        state.error.setVotingTask = null;
      })
      .addCase(setActiveVotingTask.fulfilled, (state) => {
        state.status.setVotingTask = 'succeeded';
      })
      .addCase(setActiveVotingTask.rejected, (state, action) => {
        state.status.setVotingTask = 'failed';
        state.error.setVotingTask = action.payload as string;
      });

    // Обработчики для submitUserVote
    builder
      .addCase(submitUserVote.pending, (state) => {
        state.status.submitVote = 'loading';
        state.error.submitVote = null;
      })
      .addCase(submitUserVote.fulfilled, (state, action: PayloadAction<number>) => {
        state.status.submitVote = 'succeeded';
        state.taskData.currentVote = action.payload;
      })
      .addCase(submitUserVote.rejected, (state, action) => {
        state.status.submitVote = 'failed';
        state.error.submitVote = action.payload as string;
      });

    // Обработчики для updateVotingStatus
    builder
      .addCase(updateVotingStatus.pending, (state) => {
        state.status.updateVotingState = 'loading';
        state.error.updateVotingState = null;
      })
      .addCase(updateVotingStatus.fulfilled, (state) => {
        state.status.updateVotingState = 'succeeded';
      })
      .addCase(updateVotingStatus.rejected, (state, action) => {
        state.status.updateVotingState = 'failed';
        state.error.updateVotingState = action.payload as string;
      });
  },
});

export const { 
  updateVotingStatusLocal,
  updateVotersCount: updateVotersCountAction,
  updateEstimations: updateUserEstimatesAction,
  updateVotingResult: updateFinalResultAction,
  resetVoting: resetVotingAction,
} = votingSlice.actions;

export default votingSlice.reducer;