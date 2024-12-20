import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAxios, publicAxios } from '../../service/http-common'; 

// Тип для состояния авторизации
interface AuthState {
  accessToken: string | null;
}

// Начальное состояние
const initialState: AuthState = {
  accessToken: localStorage.getItem("accessToken"),
};

// Async Thunk для обновления токена
export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (_, { dispatch, getState }) => {
    const options = {
      method: 'POST',
      url: `/user/refresh`,
    };

    localStorage.removeItem("accessToken"); 

    try {
      const response = await publicAxios(options);
      const newAccessToken = response.data.Token;

      // Обновляем токен в состоянии
      dispatch(setAccessToken(newAccessToken));

      return newAccessToken;
    } catch (error) {
      // Если обновление токена не удалось, выполняем логаут
      dispatch(logout());
      throw error;
    }
  }
);

// Async Thunk для логаута
export const logout = createAsyncThunk('auth/logout', async () => {
  return null;
});

// Слайс для авторизации
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;

      if  (action.payload !== null)  {
        localStorage.setItem("accessToken", action.payload); 
      }
      

      // Обновляем заголовок Authorization в authAxios
      if (state.accessToken) {
        authAxios.defaults.headers.common['Authorization'] = `Bearer ${state.accessToken}`;
      } else {
        delete authAxios.defaults.headers.common['Authorization'];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload;
        
      })
      .addCase(logout.fulfilled, (state) => {
        state.accessToken = null;
        delete authAxios.defaults.headers.common['Authorization'];
      });
  },
});

// Экспортируем действия
export const { setAccessToken } = authSlice.actions;

// Экспортируем редьюсер
export default authSlice.reducer;