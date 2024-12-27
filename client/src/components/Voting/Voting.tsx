import React, { useMemo, useState, useEffect } from 'react';
import {
    Paper,
    Typography,
    Button,
    IconButton,
    Box,
    Card,
    CardContent,
    CardActions,
} from '@mui/material';
import { Settings } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { fetchAddVote, setVotingState } from '../../features/voting/voting';
import { useParams } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Task, UserEstimate } from "../../model"

// Тип для пропсов компонента Voting
interface VotingProps {
    handleSettingsToggle: () => void;
    averageEstimate: number;
    handleEndVoting: () => void;
    averageMethod: string;
    showSettings: boolean;
}

interface Action {
    id: string;
    name: string;
}

const isZeroDate = (date: string | null): boolean => {
    return (date == null) || (date == "0001-01-01T00:00:00Z");
};



const Voting: React.FC<VotingProps> = ({
    handleSettingsToggle,
    handleEndVoting,
}) => {
    // Логика таймера
    const [progress, setProgress] = useState(100); // Начальное значение прогресса (100%)
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    // Получение данных из Redux
    const tasks: Task[] = useSelector((state: RootState) => state.taskReducer.tasks);
    const votingTask: number | null = useSelector((state: RootState) => state.volumeTaskReducer.taskID);
    const userEstimates: UserEstimate[] = useSelector((state: RootState) => state.volumeTaskReducer.userEstimates);
    const userID: number = useSelector((state: RootState) => state.auth.userID);
    const possibleEstimates: string[] = useSelector((state: RootState) => state.volumeTaskReducer.possibleEstimates);
    const isAdmin: boolean = useSelector((state: RootState) => state.poker.isAdmin);

    const startDate: string | null = useSelector((state: RootState) => state.volumeTaskReducer.startDate);
    const endDate: string | null = useSelector((state: RootState) => state.volumeTaskReducer.endDate);

    const dispatch: AppDispatch = useDispatch();
    const { pokerId } = useParams<{ pokerId: string }>();

    // Выбор текущей задачи
    const selectedTask: Task | undefined = useMemo(
        () => tasks.find(item => item.ID === votingTask),
        [tasks, votingTask]
    );

    const currentEstimate: UserEstimate | undefined = useMemo(
        () => userEstimates.find(item => item.UserID === userID),
        [userEstimates, userID]
    );

    const possibleActions: Action | null = useMemo(() => {
        if (votingTask > 0 && isZeroDate(startDate)) {
            return {
                id: 'START_VOTING',
                name: 'Начать голосование'
            };
        } else if (votingTask > 0 && !isZeroDate(startDate) && isZeroDate(endDate)) {
            return {
                id: 'STOP_VOTING',
                name: 'Закончить голосование'
            };
        } else if (votingTask > 0 && !isZeroDate(startDate) && !isZeroDate(endDate)) {
            return {
                id: 'START_VOTING',
                name: 'Перезапустить голосование'
            };
        } else {
            return null;
        }
    }, [votingTask, startDate, endDate]);


    const onTimerComplete = () => {
        handleSetStateVoting();
    };

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        if (possibleActions?.id == 'STOP_VOTING') {
            timer = setInterval(() => {
                setProgress((prevProgress) => {
                    if (prevProgress <= 0) {
                        clearInterval(timer!);
                        onTimerComplete();
                        return 0;
                    }
                    return prevProgress - 1;
                });
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [possibleActions, onTimerComplete]);

    if (!pokerId) {
        return <div>pokerId is missing in the URL</div>;
    }

    // Обработчик добавления голоса
    const handleAddVote = (taskID: number, estimate: string) => {

        dispatch(fetchAddVote({
            estimate,
            pokerID: pokerId,
            taskID,
        }));
    };

    const handleSetStateVoting = () => {
        if (possibleActions == null) {
            return
        }

        if (possibleActions.id == 'STOP_VOTING') {
            setProgress(100)
        }

        dispatch(setVotingState({ pokerID: pokerId, action: possibleActions.id }))
    };

    return (
        <Paper elevation={3}>
            {/* Header */}
            <Box
                position="sticky"
                top={0}
                bgcolor="grey.200"
                zIndex={1}
                p={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                height={"4vh"}
            >
                <Typography variant="h6">Голосование</Typography>
                <IconButton onClick={handleSettingsToggle}>
                    <Settings />
                </IconButton>
            </Box>

            {/* Main Content */}
            <Box display="flex" height="80vh" flexDirection="column" justifyContent="space-between">
                {selectedTask ? (
                    <Box p={1} overflow="auto">
                        {/* Task and Voting Buttons in a Card */}
                        <Card variant="outlined" sx={{ mb: 2 }}>
                            <CardContent>
                                {/* Task Details */}
                                <Typography variant="h6" gutterBottom sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                    {selectedTask.Title}
                                </Typography>
                                <Typography variant="body1" sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                    {selectedTask.Description}
                                </Typography>
                            </CardContent>

                            <CardActions sx={{ justifyContent: 'center', gap: 3, flexWrap: 'wrap', padding: 2 }}>
                                {possibleEstimates.map((estimate: string) => (
                                    <Button
                                        key={estimate}
                                        variant={currentEstimate && estimate === currentEstimate?.Estimate ? 'contained' : 'outlined'}
                                        color="primary"
                                        onClick={() => handleAddVote(selectedTask.ID, estimate)}
                                    >
                                        {estimate}
                                    </Button>
                                ))}
                            </CardActions>
                        </Card>

                        {/* Voting Stats */}
                        <Box mt={2}>
                            <Typography variant="subtitle1" align="center">
                                Проголосовало: {userEstimates.length || 0}
                            </Typography>

                            {/* Timer */}

                            {possibleActions?.id == 'STOP_VOTING' && <Box p={2} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                                <Box sx={{ width: 250, height: 250 }}>
                                    <CircularProgressbar
                                        value={progress}
                                        text={`${progress} сек.`}
                                        styles={buildStyles({
                                            textColor: 'black',
                                            pathColor: 'blue',
                                            trailColor: 'grey',
                                        })}
                                    />
                                </Box>
                            </Box>}

                        </Box>
                    </Box>
                ) : (
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        height="100%"
                        p={2}
                    >
                        <Typography variant="body1" align="center">
                            Выберите задачу для голосования
                        </Typography>
                    </Box>
                )}

                {/* Start Voting Button */}
                <Box p={2} display="flex" flexDirection="column" justifyContent="flex-start">
                    {possibleActions && <Button variant="contained" color="primary" onClick={() => handleSetStateVoting()}>
                        {possibleActions.name}
                    </Button>}
                </Box>
            </Box>
        </Paper>
    );
};

export default Voting;