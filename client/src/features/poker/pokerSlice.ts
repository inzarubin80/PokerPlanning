import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAxios } from '../../service/http-common';
import { User, Poker, PokerSettings, LastSessionPoker } from '../../model/model';
import FibonacciNumbers from '../../utils/FibonacciNumbers';

// Типы
interface PokerSessionState {
  sessions: LastSessionPoker[];
  hasMore: boolean;
  page: number;
  loading: boolean;
  error: string | null;
}

interface PokerRoomState {
  id: string;
  name: string;
  isAdmin: boolean;
  createdAt: string | null;
  users: User[];
  activeUsersID: number[];
  maximumScore: number;
  evaluationStrategy: string;
  possibleEstimates: number[];
  loading: boolean;
  error: string | null;
}

interface PokerState {
  room: PokerRoomState;
  session: PokerSessionState;
}

// Константы
const SLICE_NAME = 'poker';
const INITIAL_ERROR = null;
const INITIAL_LOADING = false;
const INITIAL_PAGE = 1;
const PAGE_SIZE = 3;

// Начальное состояние
const initialRoomState: PokerRoomState = {
  id: '',
  name: '',
  isAdmin: false,
  createdAt: null,
  users: [],
  activeUsersID: [],
  maximumScore: 0,
  evaluationStrategy: '',
  possibleEstimates: [],
  loading: INITIAL_LOADING,
  error: INITIAL_ERROR,
};

const initialSessionState: PokerSessionState = {
  sessions: [],
  hasMore: true,
  page: INITIAL_PAGE,
  loading: INITIAL_LOADING,
  error: INITIAL_ERROR,
};

const initialState: PokerState = {
  room: initialRoomState,
  session: initialSessionState,
};

// Вспомогательные функции
const handleAxiosError = (error: any): string => {
  if (error.response) {
    return error.response.data.message || 'Ошибка сервера';
  }
  if (error.request) {
    return 'Нет ответа от сервера';
  }
  return 'Произошла ошибка при выполнении запроса';
};

const calculatePossibleEstimates = (maximumScore: number): number[] => {
  return FibonacciNumbers(maximumScore);
};

// Асинхронные действия
export const createPoker = createAsyncThunk<
  string,
  PokerSettings,
  { rejectValue: string }
>(`${SLICE_NAME}/create`, async (params, { rejectWithValue }) => {
  try {
    const response = await authAxios.post<string>('/poker', params);
    return response.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const fetchPokerDetails = createAsyncThunk<
  Poker,
  string,
  { rejectValue: string }
>(`${SLICE_NAME}/fetchDetails`, async (pokerId, { rejectWithValue }) => {
  try {
    const response = await authAxios.get<Poker>(`/poker/${pokerId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const getLastSessionPoker = createAsyncThunk<
  LastSessionPoker[],
  void,
  { rejectValue: string }
>(`${SLICE_NAME}/getLastSessions`, async (_, { rejectWithValue }) => {
  try {
    
    //const response = await authAxios.get(`/poker/sessions?page=1&limit=${PAGE_SIZE}`);
    const response = await authAxios.get(`/sessions/1/${PAGE_SIZE}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const loadMoreSessions = createAsyncThunk<
   LastSessionPoker[],
  void,
  { state: { pokerReducer: PokerState }, rejectValue: string }
>(`${SLICE_NAME}/loadMoreSessions`, async (_, { getState, rejectWithValue }) => {
  try {
    const { page } = getState().pokerReducer.session;
    const nextPage = page + 1;
    const response = await authAxios.get(`/sessions/${nextPage}/${PAGE_SIZE}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const getPokerUsers = createAsyncThunk<
  User[],
  { pokerID: string; action: string },
  { rejectValue: string }
>(`${SLICE_NAME}/getUsers`, async ({ pokerID, action }, { rejectWithValue }) => {
  try {
    const response = await authAxios.post(`/poker/${pokerID}/voting-control/${action}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

// Создание slice
const pokerSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setActiveUsers: (state, action: PayloadAction<number[]>) => {
      state.room.activeUsersID = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.room.name = action.payload;
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.room.users = action.payload;
    },
    resetPokerState: () => initialState,
    resetSessions: (state) => {
      state.session = initialSessionState;
    },
  },
  extraReducers: (builder) => {
    // Общие обработчики состояний
    const handlePending = (state: PokerState) => {
      state.session.loading = true;
      state.session.error = INITIAL_ERROR;
    };

    const handleRejected = (state: PokerState, action: any) => {
      state.session.loading = INITIAL_LOADING;
      state.session.error = action.payload as string;
    };

    // Обработчики для сессий
    builder
      .addCase(getLastSessionPoker.pending, (state) => {
        state.session.loading = true;
        state.session.error = INITIAL_ERROR;
      })
      .addCase(getLastSessionPoker.fulfilled, (state, action) => {
        state.session.loading = false;
        state.session.sessions = action.payload;
        state.session.hasMore = (action.payload.length >= PAGE_SIZE);
        state.session.page = INITIAL_PAGE;
      })
      .addCase(getLastSessionPoker.rejected, (state, action) => {
        state.session.loading = false;
        state.session.error = action.payload as string;
      })
      .addCase(loadMoreSessions.pending, (state) => {
        state.session.loading = true;
        state.session.error = INITIAL_ERROR;
      })
      .addCase(loadMoreSessions.fulfilled, (state, action) => {
        state.session.loading = false;
        state.session.sessions = [...state.session.sessions, ...action.payload];
        state.session.hasMore = (action.payload.length >= PAGE_SIZE);
        state.session.page += 1;
      })
      .addCase(loadMoreSessions.rejected, (state, action) => {
        state.session.loading = false;
        state.session.error = action.payload as string;
      });

    // Обработчики для комнаты
    builder
      .addCase(createPoker.pending, (state) => {
        state.room = initialRoomState;
        state.room.loading = true;
        state.room.error = INITIAL_ERROR;
      })
      .addCase(createPoker.fulfilled, (state, action: PayloadAction<string>) => {
        state.room.loading = INITIAL_LOADING;
        state.room.id = action.payload;
      })
      .addCase(createPoker.rejected, handleRejected)
      .addCase(fetchPokerDetails.pending, (state) => {
        state.room.loading = true;
        state.room.error = INITIAL_ERROR;
      })
      .addCase(fetchPokerDetails.fulfilled, (state, action: PayloadAction<Poker>) => {
        const {
          IsAdmin,
          CreatedAt,
          ID,
          ActiveUsersID,
          Users,
          MaximumScore,
          EvaluationStrategy,
        } = action.payload;

        state.session.loading = INITIAL_LOADING;
        state.room = {
          ...state.room,
          isAdmin: IsAdmin,
          createdAt: CreatedAt,
          id: ID,
          activeUsersID: ActiveUsersID,
          users: Users,
          maximumScore: MaximumScore,
          evaluationStrategy: EvaluationStrategy,
          possibleEstimates: calculatePossibleEstimates(MaximumScore),
        };
      })
      .addCase(fetchPokerDetails.rejected, handleRejected)
      .addCase(getPokerUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.room.users = action.payload;
      });
  },
});

export const { 
  setActiveUsers, 
  setUsers, 
  resetPokerState, 
  setName,
  resetSessions,
} = pokerSlice.actions;

export default pokerSlice.reducer;