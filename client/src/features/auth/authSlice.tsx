import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAxios, publicAxios } from '../../service/http-common'; 
import {LoginData} from "../../model/"

// Тип для состояния авторизации
interface AuthState {
  accessToken: string | null;
  userID: number;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem("accessToken") || null,
  userID: (() => {
    const storedUserID = localStorage.getItem("userID");
    return storedUserID && !isNaN(Number(storedUserID)) ? parseInt(storedUserID, 10) : 0;
  })(),
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
    localStorage.removeItem("userID"); 

    try {
      const response = await publicAxios(options);


      // Обновляем токен в состоянии
      dispatch(setLoginData(response.data));

      return response.data.accessToken;
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
    setLoginData: (state, action: PayloadAction<LoginData>) => {
    

      state.accessToken = action.payload.Token;
      state.userID = action.payload.UserID;

      if  (action.payload !== null)  {
        localStorage.setItem("accessToken", action.payload.Token); 
        localStorage.setItem("userID", action.payload.UserID.toString()); 

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
        state.accessToken = action.payload.accessToken;
        state.userID = action.payload.userID;
         
      })
      .addCase(logout.fulfilled, (state) => {
        state.accessToken = null;
        state.userID = 0;
        
        delete authAxios.defaults.headers.common['Authorization'];
      });
  },
});

// Экспортируем действия
export const { setLoginData } = authSlice.actions;

// Экспортируем редьюсер
export default authSlice.reducer;