import { createSlice, createAsyncThunk, PayloadAction, Dispatch } from '@reduxjs/toolkit';
import { authAxios } from '../../service/http-common'; // Убедитесь, что путь к authAxios правильный
import { AxiosError } from 'axios';
import { VoteControlState, UserEstimate } from '../../model';

export interface SetVotingTaskParams {

    pokerID: string;
    taskID: number;
}

export interface AddVoteParams {
    pokerID: string;
    estimate: string
}

const isZeroDate = (date: string | null): boolean => {
    return (date == null) || (date == "0001-01-01T00:00:00Z");
};


interface VotingState {

    taskID: number;
    statusGetVotingTask: 'idle' | 'loading' | 'succeeded' | 'failed';
    errorGetVotingTask: string | null;

    statusSetVotingTask: 'idle' | 'loading' | 'succeeded' | 'failed';
    errorSetVotingTask: string | null;

    statusUserEstimates: 'idle' | 'loading' | 'succeeded' | 'failed';
    errorUserEstimates: string | null;

    statusSetVoting: 'idle' | 'loading' | 'succeeded' | 'failed';
    errorSetVoting: string | null;

    statusSetVotingState: 'idle' | 'loading' | 'succeeded' | 'failed';
    errorSetVotingState: string | null;
    possibleEstimates: string[];
    vote: string;
    numberVoters: number;
    startDate: string | null;
    duration: number;
    endDate: string | null;
    userEstimates: UserEstimate[];

    progress: number;
    durationVoiceSec: number;
    remainingSec: number


    action: 'start' | 'stop' | '';
    actionName: 'Начать голосование' | 'Закончить голосование' | 'Перезапустить голосование' | '';

}

interface Action {
    id: string;
    name: string;
}

const initialState: VotingState = {

    taskID: 0,

    statusGetVotingTask: 'idle',
    errorGetVotingTask: null,

    statusSetVotingTask: 'idle',
    errorSetVotingTask: null,

    statusSetVoting: 'idle',
    errorSetVoting: null,

    statusUserEstimates: 'idle',
    errorUserEstimates: null,

    statusSetVotingState: 'idle',
    errorSetVotingState: null,

    possibleEstimates: ["0", "1", "2", "3", "5", "8", "13", "21", "?"],
    vote: '',
    numberVoters: 0,
    duration: 0,
    endDate: null,
    startDate: null,
    userEstimates: [],

    progress: 0,
    durationVoiceSec: 30,
    remainingSec: 0,

    action: '',
    actionName: ''

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


        const { pokerID, estimate } = params

        try {
            const response = await authAxios.post(`/poker/${pokerID}/vote`, estimate);
            return estimate;
        } catch (error) {
            const errorMessage = handleAxiosError(error);
            return rejectWithValue(errorMessage);
        }
    }
);

export const setVotingState = createAsyncThunk(
    'votingState/set',
    async (params: { pokerID: string, action: string }, { rejectWithValue }) => {
        const { pokerID, action } = params;
        try {
            const response = await authAxios.post(`/poker/${pokerID}/voting-control/${action}`);
            return response.data;
        } catch (error) {
            const errorMessage = handleAxiosError(error);
            return rejectWithValue(errorMessage);
        }
    }
);



const calculateProgress = (startDate: string | null, durationVoiceSec: number) => {

    if (startDate == null) {
        return { remainingSec: 0, progress: 0 }
    }

    const timeStartDate = new Date(new Date(startDate).toISOString())
    const progresSec = (new Date(new Date().toISOString()).getTime() - timeStartDate.getTime()) / 1000;
    const remainingSec = durationVoiceSec - progresSec;
    const progress = (progresSec / durationVoiceSec) * 100;

    return { remainingSec, progress }; // Возвращаем объект

};

const updateVoteState = (state: VotingState, payload: VoteControlState) => {

    state.taskID = payload.TaskID;
    state.endDate = payload.EndDate;
    state.startDate = payload.StartDate;

    if (!isZeroDate(payload.StartDate) && isZeroDate(payload.EndDate)) {

        const calculate = calculateProgress(payload.StartDate, state.durationVoiceSec)
        state.remainingSec = calculate.remainingSec;
        state.progress = calculate.progress

    } else {
        state.remainingSec = 0;
        state.progress = 0;
    }

    if (state.taskID > 0 && isZeroDate(state.startDate)) {

        state.action = 'start'
        state.actionName = 'Начать голосование'

    } else if (state.taskID > 0 && !isZeroDate(state.startDate) && isZeroDate(state.endDate)) {

        state.action = 'stop'
        state.actionName = 'Закончить голосование'

    } else if (state.taskID > 0 && !isZeroDate(state.startDate) && !isZeroDate(state.endDate)) {

        state.action = 'start'
        state.actionName = 'Перезапустить голосование'

    } else {
        state.action = ''
        state.actionName = ''
    }
};


const votingTaskSlice = createSlice({
    name: 'VotingTask',
    initialState,
    reducers: {
        setVoteChange: (state, action: PayloadAction<VoteControlState>) => {
            updateVoteState(state, action.payload)
        },

        tickProgress: (state, action: PayloadAction<void>) => {
            const calculate = calculateProgress(state.startDate, state.durationVoiceSec)

            state.remainingSec = calculate.remainingSec;
            state.progress = calculate.progress
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
                updateVoteState(state, action.payload)

            }
            )

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
                state.errorUserEstimates = action.payload as string;
            })

            // 'votingState/set'
            .addCase(setVotingState.pending, (state) => {
                state.statusSetVotingState = 'loading';
                state.errorSetVotingState = '';
            })
            .addCase(setVotingState.fulfilled, (state, action: any) => {
                state.statusSetVotingState = 'succeeded';
            })
            .addCase(setVotingState.rejected, (state, action) => {
                state.statusSetVotingState = 'failed';
                state.errorSetVotingState = action.payload as string;
            });
    },
});

export const { setVoteChange, setNumberVoters, setUserEstimates, tickProgress } = votingTaskSlice.actions;
export default votingTaskSlice.reducer;