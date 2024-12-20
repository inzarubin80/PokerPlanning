import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAxios } from '../../service/http-common'; // Убедитесь, что путь к authAxios правильный
import { AxiosError } from 'axios';

interface ErrorResponse {
    error: boolean;
    message: string;
}

export interface AddVotingTaskParams {
    pokerID: string;
    taskID: number;
}

interface VolomeState {
    VotingTask: number | null;
    statusGetVotingTask: 'idle' | 'loading' | 'succeeded' | 'failed';
    errorGetVotingTask: string | null;

    statusAddVotingTask: 'idle' | 'loading' | 'succeeded' | 'failed';
    errorAddVotingTask: string | null;
}

const initialState: VolomeState = {
    VotingTask: null,
    statusGetVotingTask: 'idle',
    errorGetVotingTask: null,
    statusAddVotingTask: 'idle',
    errorAddVotingTask: null
};

// Функция для обработки ошибок Axios
const handleAxiosError = (error: unknown): string => {
    if (error instanceof AxiosError && error.response && error.response.data) {
        return error.response.data.message;
    }
    return 'Something went wrong';
};

export const fetchGetVotingTask = createAsyncThunk(
    'votingTask/get',
    async (pokerID: string, { rejectWithValue }) => {
        try {
            const response = await authAxios.get(`/poker/${pokerID}/votingtask`);
            return response.data;
        } catch (error) {
            const errorMessage = handleAxiosError(error);
            return rejectWithValue(errorMessage);
        }
    }
);

export const fetchAddVotingTask = createAsyncThunk(
    'votingTask/add',
    async (params: AddVotingTaskParams, { rejectWithValue }) => {
        const { pokerID, taskID } = params;
        try {
            const response = await authAxios.post(`/poker/${pokerID}/votingtask/${taskID}`);
            return taskID;
        } catch (error) {
            const errorMessage = handleAxiosError(error);
            return rejectWithValue(errorMessage);
        }
    }
);

const votingTaskSlice = createSlice({
    name: 'VotingTask',
    initialState,
    reducers: {
        setVotingTask: (state, action: PayloadAction<number>) => {
            state.VotingTask = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // 'votingTask/get'
            .addCase(fetchGetVotingTask.pending, (state) => {
                state.statusGetVotingTask = 'loading';
                state.errorGetVotingTask = '';
            })
            .addCase(fetchGetVotingTask.fulfilled, (state, action: PayloadAction<number>) => {
                state.statusGetVotingTask = 'succeeded';
                state.VotingTask = action.payload;
            })
            .addCase(fetchGetVotingTask.rejected, (state, action) => {
                state.statusGetVotingTask = 'failed';
                state.errorGetVotingTask = action.payload as string;
            })

            // 'votingTask/add'
            .addCase(fetchAddVotingTask.pending, (state) => {
                state.statusAddVotingTask = 'loading';
                state.errorAddVotingTask = '';
            })
            .addCase(fetchAddVotingTask.fulfilled, (state, action: PayloadAction<number>) => {
                state.statusAddVotingTask = 'succeeded';
                // state.VotingTask = action.payload; // Если нужно обновлять VotingTask после добавления
            })
            .addCase(fetchAddVotingTask.rejected, (state, action) => {
                state.statusAddVotingTask = 'failed';
                state.errorAddVotingTask = action.payload as string;
            });
    },
});

export const { setVotingTask } = votingTaskSlice.actions;
export default votingTaskSlice.reducer;