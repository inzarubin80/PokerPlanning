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


export interface AddVoteParams {
    pokerID: string;
    taskID: number;
    estimate:string
}

export interface  GetVotingTask{
    TaskID: number;
    Estimate:string
}



interface VotingState {
    VotingTask: number | null;
    statusGetVotingTask: 'idle' | 'loading' | 'succeeded' | 'failed';
    errorGetVotingTask: string | null;
    statusAddVotingTask: 'idle' | 'loading' | 'succeeded' | 'failed';
    errorAddVotingTask: string | null;


    statusAddVoting: 'idle' | 'loading' | 'succeeded' | 'failed';
    errorAddVoting:  string | null;

    possibleEstimates:  string[];
    vote: string
    numberVoters: number
}

const initialState: VotingState = {

    VotingTask: null,
    statusGetVotingTask: 'idle',
    errorGetVotingTask: null,
    statusAddVotingTask: 'idle',
    errorAddVotingTask: null,
    statusAddVoting: 'idle',
    errorAddVoting: null,
    possibleEstimates: ["0", "1", "2", "3", "5", "8", "13", "21", "?"],
    vote : '',
    numberVoters: 0
    
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

export const fetchAddVote = createAsyncThunk(
    'vote/add',
    async (params: AddVoteParams, { rejectWithValue }) => {

        console.log('fetchAddVote', params)

        const {pokerID, taskID, estimate} = params

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
        setVotingTask: (state, action: PayloadAction<number>) => {
                state.VotingTask = action.payload;
                state.vote = ''
        },
      
        setNumberVoters: (state, action: PayloadAction<number>) => {
                state.numberVoters = action.payload;     
        },

        setVote: (state, action: PayloadAction<string>) => {
            state.vote = action.payload;     
       },
    

    },
    extraReducers: (builder) => {
        builder
            // 'votingTask/get'
            .addCase(fetchGetVotingTask.pending, (state) => {
                state.statusGetVotingTask = 'loading';
                state.errorGetVotingTask = '';
            })
            .addCase(fetchGetVotingTask.fulfilled, (state, action: PayloadAction<GetVotingTask>) => {
                state.statusGetVotingTask = 'succeeded';
                state.VotingTask = action.payload.TaskID;
                state.vote = action.payload.Estimate;
                
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
            })
            .addCase(fetchAddVotingTask.rejected, (state, action) => {
                state.statusAddVotingTask = 'failed';
                state.errorAddVotingTask = action.payload as string;
            })


              // 'vote/add'
              .addCase(fetchAddVote.pending, (state) => {
                state.statusAddVoting = 'loading';
                state.errorAddVoting = '';
            })
            .addCase(fetchAddVote.fulfilled, (state, action: PayloadAction<string>) => {
                state.statusAddVoting = 'succeeded';
                state.vote = action.payload
            })
            .addCase(fetchAddVote.rejected, (state, action) => {
                state.statusAddVoting = 'failed';
                state.errorAddVoting = action.payload as string;
            });



    },
});

export const { setVotingTask, setNumberVoters, setVote } = votingTaskSlice.actions;
export default votingTaskSlice.reducer;