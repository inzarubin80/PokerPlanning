import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAxios } from '../../service/http-common'; // Убедитесь, что путь к authAxios правильный
import { AxiosError } from 'axios';
import { VoteControlState, UserEstimate } from '../../model';



export interface SetVotingTaskParams {
    pokerID: string;
    taskID: number;
}

export interface AddVoteParams {
    pokerID: string;
    taskID: number;
    estimate: string
}


interface VotingState {

    taskID: number;
    statusGetVotingTask: 'idle' | 'loading' | 'succeeded' | 'failed';
    errorGetVotingTask: string | null;
    statusSetVotingTask: 'idle' | 'loading' | 'succeeded' | 'failed';
    errorSetVotingTask: string | null;

    statusUserEstimates:  'idle' | 'loading' | 'succeeded' | 'failed';
    errorUserEstimates:  string | null;


    statusSetVoting: 'idle' | 'loading' | 'succeeded' | 'failed';
    errorSetVoting: string | null;

    possibleEstimates: string[];
    vote: string;
    numberVoters: number;

    startDate: string | null;
    duration: number;
    endDate: string | null;

    userEstimates: UserEstimate[]


}

const initialState: VotingState = {

    taskID: 0,
    statusGetVotingTask: 'idle',
    errorGetVotingTask: null,
    statusSetVotingTask: 'idle',
    errorSetVotingTask: null,
    statusSetVoting: 'idle',
    errorSetVoting: null,
    possibleEstimates: ["0", "1", "2", "3", "5", "8", "13", "21", "?"],
    vote: '',
    numberVoters: 0,
    duration: 0,
    endDate: null,
    startDate: null,
    userEstimates: [],

    statusUserEstimates:  'idle',
    errorUserEstimates:  null,

};

// Функция для обработки ошибок Axios
const handleAxiosError = (error: unknown): string => {
    if (error instanceof AxiosError && error.response && error.response.data) {
        return error.response.data.message;
    }
    return 'Something went wrong';
};

export const fetchVotingControl = createAsyncThunk(
    'votingTask/get',
    async (pokerID: string, { rejectWithValue }) => {
        try {
            const response = await authAxios.get(`/poker/${pokerID}/voting-control`);
            return response.data;
        } catch (error) {
            const errorMessage = handleAxiosError(error);
            return rejectWithValue(errorMessage);
        }
    }
);


export const getUserEstimates = createAsyncThunk(
    'userEstimates/get',
    async (pokerID: string, { rejectWithValue }) => {
        try {
            const response = await authAxios.get(`/poker/${pokerID}/user-estimates`);
            return response.data;
        } catch (error) {
            const errorMessage = handleAxiosError(error);
            return rejectWithValue(errorMessage);
        }
    }
);


export const fetchSetVotingTask = createAsyncThunk(
    'votingTask/add',
    async (params: SetVotingTaskParams, { rejectWithValue }) => {
        const { pokerID, taskID } = params;
        try {
            const response = await authAxios.post(`/poker/${pokerID}/voting-control/task/${taskID}`);
            return taskID;
        } catch (error) {
            const errorMessage = handleAxiosError(error);
            return rejectWithValue(errorMessage);
        }
    }
);

export const fetchAddVote = createAsyncThunk(
    'vote/add',
    async (params: AddVoteParams, { rejectWithValue }) => {


        const { pokerID, taskID, estimate } = params

        try {
            const response = await authAxios.post(`/poker/${pokerID}/vote`, estimate);
            return estimate;
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
        setVoteChange: (state, action: PayloadAction<{ TaskID: number, StartDate: string, Duration: number, EndDate: string }>) => {
            
            state.taskID = action.payload.TaskID;
            state.endDate =action.payload.EndDate;
            state.startDate = action.payload.StartDate;
        },

        setNumberVoters: (state, action: PayloadAction<number>) => {
            state.numberVoters = action.payload;
        },

        setUserEstimates: (state, action: PayloadAction<UserEstimate[]>) => {
            state.userEstimates = action.payload;
        },


    },
    extraReducers: (builder) => {
        builder
            // 'votingTask/get'
            .addCase(fetchVotingControl.pending, (state) => {
                state.statusGetVotingTask = 'loading';
                state.errorGetVotingTask = '';
            })
            .addCase(fetchVotingControl.fulfilled, (state, action: PayloadAction<VoteControlState>) => {
                state.statusGetVotingTask = 'succeeded';
                state.taskID = action.payload.TaskID;
                state.endDate = action.payload.EndDate;
                state.startDate = action.payload.StartDate;

            })
            .addCase(fetchVotingControl.rejected, (state, action) => {
                state.statusGetVotingTask = 'failed';
                state.errorGetVotingTask = action.payload as string;
            })

            // 'votingTask/add'
            .addCase(fetchSetVotingTask.pending, (state) => {
                state.statusSetVotingTask = 'loading';
                state.errorSetVotingTask = '';
            })
            .addCase(fetchSetVotingTask.fulfilled, (state, action: PayloadAction<number>) => {
                state.statusSetVotingTask = 'succeeded';
            })
            .addCase(fetchSetVotingTask.rejected, (state, action) => {
                state.statusSetVotingTask = 'failed';
                state.errorSetVotingTask = action.payload as string;
            })


            // 'vote/add'
            .addCase(fetchAddVote.pending, (state) => {
                state.statusSetVoting = 'loading';
                state.errorSetVoting = '';
            })
            .addCase(fetchAddVote.fulfilled, (state, action: PayloadAction<string>) => {
                state.statusSetVoting = 'succeeded';
                state.vote = action.payload
            })
            .addCase(fetchAddVote.rejected, (state, action) => {
                state.statusSetVoting = 'failed';
                state.errorSetVoting = action.payload as string;
            })

             // 'userEstimates/get'
             .addCase(getUserEstimates.pending, (state) => {
                state.statusUserEstimates = 'loading';
                state.errorUserEstimates = '';
            })
            .addCase(getUserEstimates.fulfilled, (state, action: PayloadAction<UserEstimate[]>) => {
                state.statusUserEstimates = 'succeeded';
                state.userEstimates = action.payload
            })
            .addCase(getUserEstimates.rejected, (state, action) => {
                state.statusUserEstimates = 'failed';
                state.errorUserEstimates  = action.payload as string;
            });
    },
});

export const { setVoteChange, setNumberVoters, setUserEstimates } = votingTaskSlice.actions;
export default votingTaskSlice.reducer;