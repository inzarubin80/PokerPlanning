import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import taskReducer from '../features/task/taskSlice';
import commentReducer from '../features/comment/commentSlice';
import volumeTaskReducer from '../features/voting/voting';
import authReducer from '../features/auth/authSlice';
import pokerReducer from '../features/poker/pokerSlice';

export const store = configureStore({
  reducer: {
    taskReducer: taskReducer,
    commentReducer: commentReducer,
    volumeTaskReducer: volumeTaskReducer,
    auth: authReducer,
    poker: pokerReducer
  },
});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
