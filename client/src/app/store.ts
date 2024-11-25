import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import taskReducer from '../features/task/taskSlice';
import commentReducer from '../features/comment/commentSlice';

export const store = configureStore({
  reducer: {
    taskReducer: taskReducer,
    commentReducer: commentReducer
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
