import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface ErrorResponse {
    error: boolean;
    message: string;
}

export interface AddVotingTaskParams {
    pokerID: string;
    taskID: number;
}

interface VolomeState {
    VotingTask: number | null
    statusGetVotingTask: 'idle' | 'loading' | 'succeeded' | 'failed';
    errorGetVotingTask: string | null;

    statusAddVotingTask: 'idle' | 'loading' | 'succeeded' | 'failed';
    errorAddVotingTask: string | null;
}

const initialState: VolomeState = {
    VotingTask: null,
    statusGetVotingTask: 'idle',
    errorGetVotingTask: null,
    statusAddVotingTask:'idle',
    errorAddVotingTask: null
};

export const fetchGetVotingTask = createAsyncThunk(
    'votingTask/get',
    async (pokerID: string) => {
        const response = await fetch(`/api/poker/${pokerID}/votingtask`);
        if (!response.ok) {
            const errorData: ErrorResponse = await response.json();
            throw new Error(errorData.message);
        }
        const data = await response.json();
        return data;
    }
);

export const fetchAddVotingTask = createAsyncThunk('votingTask/add', async (params: AddVotingTaskParams) => {
    const { pokerID, taskID } = params;
    const response = await fetch(`/api/poker/${pokerID}/votingtask/${taskID}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(errorData.message);
    }
    return taskID;
});


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
            //'votingTask/get'
            .addCase(fetchGetVotingTask.pending, (state) => {
                state.statusGetVotingTask = 'loading';
                state.errorGetVotingTask = ''
            })
            .addCase(fetchGetVotingTask.fulfilled, (state, action: PayloadAction<number>) => {
                state.statusGetVotingTask = 'succeeded';
                state.VotingTask = action.payload;
            })
            .addCase(fetchGetVotingTask.rejected, (state, action) => {
                state.statusGetVotingTask = 'failed';
                state.errorGetVotingTask = action.error.message ?? 'Something went wrong';
            })

            //'votingTask/add'

            .addCase(fetchAddVotingTask.pending, (state) => {
                state.statusAddVotingTask = 'loading';
                state.errorAddVotingTask = ''
            })
            .addCase(fetchAddVotingTask.fulfilled, (state, action: PayloadAction<number>) => {
                state.statusAddVotingTask = 'succeeded';
                //state.VotingTask = action.payload;
            })
            .addCase(fetchAddVotingTask.rejected, (state, action) => {
                state.statusAddVotingTask = 'failed';
                state.errorAddVotingTask = action.error.message ?? 'Something went wrong';
            });
    },
});

export const { setVotingTask} = votingTaskSlice.actions;
export default votingTaskSlice.reducer;