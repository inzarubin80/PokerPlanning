import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAxios } from '../../service/http-common';
import { User, Poker, PokerSettings } from '../../model/model';
import FibonacciNumbers from '../../utils/FibonacciNumbers';

// Типы
interface PokerState {
  pokerId: string;
  isAdmin: boolean;
  createdAt: string | null;
  loading: boolean;
  error: string | null;
  users: User[];
  activeUsersID: number[];
  maximumScore: number;
  evaluationStrategy: string;
  possibleEstimates: number[];
}

// Константы
const SLICE_NAME = 'poker';
const INITIAL_ERROR = null;
const INITIAL_LOADING = false;

// Начальное состояние
const initialState: PokerState = {
  pokerId: '',
  isAdmin: false,
  createdAt: null,
  loading: INITIAL_LOADING,
  error: INITIAL_ERROR,
  users: [],
  activeUsersID: [],
  maximumScore: 0,
  evaluationStrategy: '',
  possibleEstimates: [],
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

export const getPokerUsers = createAsyncThunk(
  `${SLICE_NAME}/getUsers`,
  async (params: { pokerID: string; action: string }, { rejectWithValue }) => {
    const { pokerID, action } = params;
    try {
      const response = await authAxios.post(
        `/poker/${pokerID}/voting-control/${action}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(handleAxiosError(error));
    }
  }
);

// Создание slice
const pokerSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setActiveUsers: (state, action: PayloadAction<number[]>) => {
      state.activeUsersID = action.payload;
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    resetPokerState: () => initialState,
  },
  extraReducers: (builder) => {
    // Общие обработчики состояний
    const handlePending = (state: PokerState) => {
      state.loading = true;
      state.error = INITIAL_ERROR;
    };

    const handleRejected = (state: PokerState, action: any) => {
      state.loading = INITIAL_LOADING;
      state.error = action.payload as string;
    };

    // Обработчики для createPoker
    builder
      .addCase(createPoker.pending, handlePending)
      .addCase(createPoker.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = INITIAL_LOADING;
        state.pokerId = action.payload;
      })
      .addCase(createPoker.rejected, handleRejected);

    // Обработчики для fetchPokerDetails
    builder
      .addCase(fetchPokerDetails.pending, handlePending)
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

        state.loading = INITIAL_LOADING;
        state.isAdmin = IsAdmin;
        state.createdAt = CreatedAt;
        state.pokerId = ID;
        state.activeUsersID = ActiveUsersID;
        state.users = Users;
        state.maximumScore = MaximumScore;
        state.evaluationStrategy = EvaluationStrategy;
        state.possibleEstimates = calculatePossibleEstimates(MaximumScore);
      })
      .addCase(fetchPokerDetails.rejected, handleRejected);

    // Обработчики для getPokerUsers могут быть добавлены здесь
  },
});

export const { setActiveUsers, setUsers, resetPokerState } = pokerSlice.actions;
export default pokerSlice.reducer;