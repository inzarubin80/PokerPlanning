import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAxios, publicAxios } from '../../service/http-common';
import { LoginData } from "../../model"
import { AxiosError } from 'axios';
import { User, UserSettings } from '../../model';


// Тип для состояния авторизации
interface AuthState {
  accessToken: string | null;
  userID: number;
  userName: string;
  status: string;
  error: string;
  isEditing: boolean;
  EvaluationStrategy: string;
  MaximumScore: number;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem("accessToken") || null,
  userID: 0,
  userName: "",
  status: "",
  error: "",
  isEditing: false,
  EvaluationStrategy: "average",
  MaximumScore: 55,
};

// Функция для обработки ошибок Axios
const handleAxiosError = (error: unknown): string => {
  if (error instanceof AxiosError && error.response && error.response.data) {
    return error.response.data.message;
  }
  return 'Something went wrong';
};


export const getUser = createAsyncThunk(
  'user/getUser',
  async (params: void, { rejectWithValue }) => {
    try {
      const response = await authAxios.get(`/user`);
      return response.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      return rejectWithValue(errorMessage);
    }
  }
);


export const setUserName = createAsyncThunk(
  'set/userName',
  async (name: string, { rejectWithValue }) => {
    try {
      const response = await authAxios.post(`/user/name`, name);
      return response.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      return rejectWithValue(errorMessage);
    }
  }
);


export const setUserSettings = createAsyncThunk(
  'set/userSettings',
  async (userSettings: UserSettings, { rejectWithValue }) => {
    try {
      const response = await authAxios.post(`/user/settings`, userSettings);
      return userSettings;
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

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

      dispatch(setLoginData(response.data));
      return response.data;

    } catch (error) {
      dispatch(logout());
      throw error;
    }
  }
);


export const logout = createAsyncThunk('auth/logout', async () => {
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginData: (state, action: PayloadAction<LoginData>) => {
      state.accessToken = action.payload.Token;
      state.userID = action.payload.UserID;

      if (action.payload !== null) {
        localStorage.setItem("accessToken", action.payload.Token);

      }

      if (state.accessToken) {
        authAxios.defaults.headers.common['Authorization'] = `Bearer ${state.accessToken}`;
      } else {
        delete authAxios.defaults.headers.common['Authorization'];
      }
    },
    setIsEditing:(state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload
    },

    setUsername:(state, action: PayloadAction<string>) => {
      state.userName = action.payload
    },

  },

  extraReducers: (builder) => {
    builder

      .addCase(logout.fulfilled, (state) => {
        state.accessToken = null;
        state.userID = 0;
        localStorage.removeItem("accessToken");
        delete authAxios.defaults.headers.common['Authorization'];
      })

      .addCase(getUser.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(getUser.fulfilled, (state, action: PayloadAction<User>) => {
      
        state.status = 'succeeded';
        state.userID = action.payload.ID;
        state.userName = action.payload.Name;
        state.EvaluationStrategy = action.payload.EvaluationStrategy;
        state.MaximumScore = action.payload.MaximumScore;
           
      })
      .addCase(getUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })


      .addCase(setUserName.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      
      })
      .addCase(setUserName.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'succeeded';
        state.userName = action.payload.Name;
        state.isEditing = false
      })
      .addCase(setUserName.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      
      .addCase(setUserSettings.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      
      })
      .addCase(setUserSettings.fulfilled, (state, action: PayloadAction<UserSettings>) => {
        state.status = 'succeeded';
        state.EvaluationStrategy = action.payload.EvaluationStrategy;
        state.MaximumScore = action.payload.MaximumScore;
      })
      .addCase(setUserSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      ;



  },
});


export const { setLoginData, setIsEditing, setUsername } = authSlice.actions;

export default authSlice.reducer;