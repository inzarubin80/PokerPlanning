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
import { fetchAddVote } from '../../features/voting/voting';
import { useParams } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// Тип для задачи
interface Task {
    id: number;
    title: string;
    description: string;
}

// Тип для пропсов компонента Voting
interface VotingProps {
    handleSettingsToggle: () => void;
    averageEstimate: number;
    handleEndVoting: () => void;
    averageMethod: string;
    showSettings: boolean;
}

const Voting: React.FC<VotingProps> = ({
    averageEstimate,
    averageMethod,
    showSettings,
    handleSettingsToggle,
    handleEndVoting,
}) => {
    // Логика таймера
    const [progress, setProgress] = useState(100); // Начальное значение прогресса (100%)
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    // Получение данных из Redux
    const tasks: Task[] = useSelector((state: RootState) => state.taskReducer.tasks);
    const votingTask: number | null = useSelector((state: RootState) => state.volumeTaskReducer.VotingTask);
    const vote: string | null = useSelector((state: RootState) => state.volumeTaskReducer.vote);
    const possibleEstimates: string[] = useSelector((state: RootState) => state.volumeTaskReducer.possibleEstimates);
    const numberVoters: number = useSelector((state: RootState) => state.volumeTaskReducer.numberVoters);

    const dispatch: AppDispatch = useDispatch();
    const { pokerId } = useParams<{ pokerId: string }>();

    // Выбор текущей задачи
    const selectedTask: Task | undefined = useMemo(
        () => tasks.find(item => item.id === votingTask),
        [tasks, votingTask]
    );

    // Обработчик завершения таймера
    const onTimerComplete = () => {
        setIsTimerRunning(false);
        handleEndVoting();
    };

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (isTimerRunning) {
            timer = setInterval(() => {
                setProgress((prevProgress) => {
                    if (prevProgress <= 0) {
                        clearInterval(timer!);
                        onTimerComplete(); // Завершение голосования, когда таймер доходит до 0
                        return 0;
                    }
                    return prevProgress - 1; // Уменьшаем прогресс на 1% каждую секунду
                });
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isTimerRunning, onTimerComplete]);

    if (!pokerId) {
        return <div>pokerId is missing in the URL</div>;
    }

    // Обработчик добавления голоса
    const handleAddVote = (taskID: number, estimate: string) => {
        console.log("handleAddVote");
        dispatch(fetchAddVote({
            estimate,
            pokerID: pokerId,
            taskID,
        }));
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
                                    {selectedTask.title}
                                </Typography>
                                <Typography variant="body1" sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                    {selectedTask.description}
                                </Typography>
                            </CardContent>

                            <CardActions sx={{ justifyContent: 'center', gap: 3, flexWrap: 'wrap', padding: 2 }}>
                                {possibleEstimates.map((estimate: string) => (
                                    <Button
                                        key={estimate}
                                        variant={estimate === vote ? 'contained' : 'outlined'}
                                        color="primary"
                                        onClick={() => handleAddVote(selectedTask.id, estimate)}
                                    >
                                        {estimate}
                                    </Button>
                                ))}
                            </CardActions>
                        </Card>

                        {/* Voting Stats */}
                        <Box mt={2}>
                            <Typography variant="subtitle1" align="center">
                                Проголосовало: {numberVoters || 0}
                            </Typography>

                            {/* Timer */}

                            <Box p={2} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
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
                            </Box>

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
                    <Button variant="contained" color="primary" onClick={() => setIsTimerRunning(true)}>
                        Завершить голосование
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default Voting;