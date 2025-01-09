import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import taskReducer from '../features/task/taskSlice';
import commentReducer from '../features/comment/commentSlice';
import volumeTaskReducer from '../features/voting/votingSlice';
import userReducer from '../features/user/userSlice';
import pokerReducer from '../features/poker/pokerSlice';

export const store = configureStore({
  reducer: {
    taskReducer: taskReducer,
    commentReducer: commentReducer,
    volumeReducer: volumeTaskReducer,
    userReducer: userReducer,
    pokerReducer: pokerReducer
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
