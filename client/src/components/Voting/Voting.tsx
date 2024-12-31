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
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    LinearProgress,
} from '@mui/material';

import { Settings, ExpandMore } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { fetchAddVote, setVotingState, tickProgress } from '../../features/voting/voting';
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

    const tasks: Task[] = useSelector((state: RootState) => state.taskReducer.tasks);
    const votingTask: number | null = useSelector((state: RootState) => state.volumeTaskReducer.taskID);
    const userEstimates: UserEstimate[] = useSelector((state: RootState) => state.volumeTaskReducer.userEstimates);
    const userID: number = useSelector((state: RootState) => state.auth.userID);
    const possibleEstimates: string[] = useSelector((state: RootState) => state.volumeTaskReducer.possibleEstimates);
    const isAdmin: boolean = useSelector((state: RootState) => state.poker.isAdmin);

    const startDate: string | null = useSelector((state: RootState) => state.volumeTaskReducer.startDate);
    const endDate: string | null = useSelector((state: RootState) => state.volumeTaskReducer.endDate);

    const progress: number = useSelector((state: RootState) => state.volumeTaskReducer.progress);
    const remainingSec: number = useSelector((state: RootState) => state.volumeTaskReducer.remainingSec);

    const action: string = useSelector((state: RootState) => state.volumeTaskReducer.action);
    const actionName: string = useSelector((state: RootState) => state.volumeTaskReducer.actionName);


    const dispatch: AppDispatch = useDispatch();
    const { pokerId } = useParams<{ pokerId: string }>();

    const selectedTask: Task | undefined = useMemo(
        () => tasks.find(item => item.ID === votingTask),
        [tasks, votingTask]
    );

    const currentEstimate: UserEstimate | undefined = useMemo(
        () => userEstimates.find(item => item.UserID === userID),
        [userEstimates, userID]
    );

    const onTimerComplete = () => {
        handleSetStateVoting();
    };

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (action === 'stop') {
            timer = setInterval(() => {
                if (progress >= 100) {
                    clearInterval(timer!); // Очищаем интервал
                    onTimerComplete(); // Вызываем завершение таймера
                } else {
                    dispatch(tickProgress()); // Обновляем прогресс
                }
            }, 10); // Интервал в 1 секунду
        }

        return () => {
            if (timer) clearInterval(timer); // Очищаем интервал при размонтировании
        };
    }, [action, progress, onTimerComplete, tickProgress]); // Зависимости

    if (!pokerId) {
        return <div>pokerId is missing in the URL</div>;
    }

    // Обработчик добавления голоса
    const handleAddVote = (taskID: number, estimate: string) => {
        dispatch(fetchAddVote({
            estimate,
            pokerID: pokerId
        }));
    };

    const handleSetStateVoting = () => {
        if (action == '') {
            return
        }

        dispatch(setVotingState({ pokerID: pokerId, action: action }))
    };

    return (
        <Paper elevation={3}>

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
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6"> ID {selectedTask.ID} {selectedTask.Title}</Typography>
                            </CardContent>

                            <CardActions sx={{ justifyContent: 'center', gap: 3, flexWrap: 'wrap', padding: 2 }}>
                                {action == 'stop' && possibleEstimates.map((estimate: string) => (
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


                        <Box mt={2}>
                            <Card variant="outlined">
                                {/* Шапка карточки */}
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    p={2}
                                    borderBottom="1px solid rgba(0, 0, 0, 0.12)"
                                    flexDirection="column"
                                    rowGap={2}

                                >
                                    <Typography variant="subtitle1">
                                        Проголосовало: {userEstimates.length || 0}
                                    </Typography>

                                    {action === 'stop' && (
                                        <Box sx={{ width: '100%' }}>
                                            <LinearProgress variant="determinate" value={progress} />
                                        </Box>
                                    )}
                                </Box>

                                {/* Основная часть карточки с прокручиваемым списком */}
                                <Box
                                    p={0}
                                    sx={{
                                        //  maxHeight: 100, // Ограничение высоты списка
                                        overflowY: 'auto', // Включение вертикальной прокрутки
                                    }}
                                >
                                    <List dense> {/* Список более компактный благодаря dense */}
                                        {userEstimates.map((userEstimate: UserEstimate) => (
                                            <ListItem key={userEstimate.UserID.toString()} sx={{ py: 0.5 }}> {/* Уменьшаем отступы */}
                                                <ListItemAvatar>
                                                    <Avatar src="/path/to/user-icon.png" /> {/* Картинка пользователя */}
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={`User ${userEstimate.UserID}`} // Упрощенный текст
                                                    secondary={`Оценка: ${userEstimate.Estimate}`} // Дополнительная информация
                                                    primaryTypographyProps={{ variant: 'body2' }} // Меньший размер текста
                                                    secondaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            </Card>
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
                    {action !== '' && <Button variant="contained" color="primary" onClick={() => handleSetStateVoting()}>
                        {actionName}
                    </Button>}
                </Box>
            </Box>
        </Paper>
    );
};

export default Voting;