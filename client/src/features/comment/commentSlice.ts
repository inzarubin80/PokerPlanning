import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CommentItem } from '../../model';

import {authAxios} from '../../service/http-common'
import { AxiosError } from 'axios'; 


interface ErrorResponse {
  error: boolean;
  message: string;
}

export interface SaveCommentParams {
  pokerID: string;
  comment: CommentItem;
  callback:()=>void|null
}

interface CommentState {
  comments: CommentItem[],
  statusFetchComments: string,
  statusAddComment: string | null,
  errorAddComment: string| null,
  errorFetchComments: string | null,
}

const initialState: CommentState = {
  comments: [],
  statusFetchComments: 'idle',
  errorFetchComments: null,
  statusAddComment:'idle',
  errorAddComment: null
};



export const getComments = createAsyncThunk(
  'comment/getComments',
  async (pokerID: string) => {
    try {
      const response = await authAxios.get(`/poker/${pokerID}/comments`);
      return response.data;
    } catch (error: unknown) {
      // Проверяем, является ли ошибка экземпляром AxiosError
      if (error instanceof AxiosError && error.response && error.response.data) {
        throw new Error(error.response.data.message);
      }
      throw error; // Если это не AxiosError, передаем ошибку дальше
    }
  }
);

export const addComment = createAsyncThunk(
  'comment/addComment',
  async (params: SaveCommentParams) => {
    const { pokerID, comment, callback } = params;
    try {
      const response = await authAxios.post(`/poker/${pokerID}/comments`, comment);
      if (callback) {
        callback();
      }
      return response.data;
    } catch (error: unknown) {
      // Проверяем, является ли ошибка экземпляром AxiosError
      if (error instanceof AxiosError && error.response && error.response.data) {
        throw new Error(error.response.data.message);
      }
      throw error; // Если это не AxiosError, передаем ошибку дальше
    }
  }
);


const commentSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {

    commentAdded: (state, action: PayloadAction<CommentItem>) => {
      const updatedComment = action.payload;
      const index = state.comments.findIndex((comment) => comment.ID === updatedComment.ID);
      if (index !== -1) {
        state.comments[index] = updatedComment;
      } else {
        state.comments.push(updatedComment)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      //'comment/getComments'
      .addCase(getComments.pending, (state) => {
        state.statusFetchComments = 'loading';
        state.errorFetchComments = ''
      })
      .addCase(getComments.fulfilled, (state, action: PayloadAction<CommentItem[]>) => {
        state.statusFetchComments = 'succeeded';
        state.comments = action.payload;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.statusFetchComments = 'failed';
        state.errorFetchComments = action.error.message ?? 'Something went wrong';
      })

      //'comment/addComment'
      .addCase(addComment.pending, (state) => {
        state.statusAddComment= 'loading';
        state.errorAddComment = ''
      })
      .addCase(addComment.fulfilled, (state, action: PayloadAction<CommentItem[]>) => {
        state.statusAddComment = 'succeeded';
      })
      .addCase(addComment.rejected, (state, action) => {
        state.statusAddComment = 'failed';
        state.errorAddComment = action.error.message ?? 'Something went wrong';
      })
      
      ;
  },
});

export const { commentAdded } = commentSlice.actions;
export default commentSlice.reducer;