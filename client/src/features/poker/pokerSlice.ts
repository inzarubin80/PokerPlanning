import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAxios } from '../../service/http-common';

// Тип для состояния
interface PokerState {
  pokerId: string;
  isAdmin: boolean; // Добавлено поле для isAdmin
  createdAt: string | null; // Добавлено поле для даты создания
  loading: boolean;
  error: string | null;
}

// Начальное состояние
const initialState: PokerState = {
  pokerId: "",
  isAdmin: false, 
  createdAt: null, 
  loading: false,
  error: null,
};

// Функция для обработки ошибок Axios
const handleAxiosError = (error: any): string => {
  if (error.response) {
    return error.response.data.message || 'Ошибка сервера';
  } else if (error.request) {
    return 'Нет ответа от сервера';
  } else {
    return 'Произошла ошибка при выполнении запроса';
  }
};

// Асинхронное действие для создания покера
export const createPoker = createAsyncThunk<
  string, // Тип возвращаемого значения (ID покера)
  void, // Тип параметра (ничего)
  { rejectValue: string } // Тип ошибки
>('poker/create', async (_, { rejectWithValue }) => {
  try {
    const response = await authAxios.post<string>('/poker'); // Указываем тип ответа
    return response.data; // Возвращаем ID созданного покера
  } catch (error) {
    const errorMessage = handleAxiosError(error);
    return rejectWithValue(errorMessage); // Возвращаем обработанную ошибку
  }
});

// Асинхронное действие для получения данных покера
export const fetchPokerDetails = createAsyncThunk<
  { isAdmin: boolean; createdAt: string; id:string}, // Тип возвращаемого значения
  string, // Тип параметра (pokerId)
  { rejectValue: string } // Тип ошибки
>('poker/fetchDetails', async (pokerId, { rejectWithValue }) => {
  try {
    const response = await authAxios.get<{ isAdmin: boolean; createdAt: string; id:string }>(
      `/poker/${pokerId}`
    );
    return response.data; // Возвращаем данные покера
  } catch (error) {
    const errorMessage = handleAxiosError(error);
    return rejectWithValue(errorMessage);
  }
});

// Создаем slice
const pokerSlice = createSlice({
  name: 'poker',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Обработка состояния для createPoker
    builder
      .addCase(createPoker.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPoker.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.pokerId = action.payload; // Сохраняем ID созданного покера
      })
      .addCase(createPoker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Сохраняем ошибку
      });

    // Обработка состояния для fetchPokerDetails
    builder
      .addCase(fetchPokerDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPokerDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.isAdmin = action.payload.isAdmin; // Сохраняем isAdmin
        state.createdAt = action.payload.createdAt; // Сохраняем дату создания
        state.pokerId = action.payload.id;   
      })
      
      .addCase(fetchPokerDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Сохраняем ошибку
      });
  },
});

// Экспортируем редьюсер
export default pokerSlice.reducer;