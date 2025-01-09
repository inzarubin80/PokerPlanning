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
    List,
    ListItem,
    ListItemText,
    LinearProgress,
    Rating,
    TextField,
} from '@mui/material';

import { styled } from '@mui/material/styles';
import { Settings } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { fetchAddVote, setVotingState, tickProgress, setFinalResult} from '../../features/voting/votingSlice';
import { useParams } from 'react-router-dom';
import 'react-circular-progressbar/dist/styles.css';
import { Task, UserEstimate } from "../../model"
import FavoriteIcon from '@mui/icons-material/StarOutline';
import FavoriteBorderIcon from '@mui/icons-material/StarOutline';

const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
        color: '#ff6d75',
    },
    '& .MuiRating-iconHover': {
        color: '#ff3d47',
    },
});

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
    const votingTask: number | null = useSelector((state: RootState) => state.volumeReducer.taskID);
    const userEstimates: UserEstimate[] = useSelector((state: RootState) => state.volumeReducer.userEstimates);
    const userID: number = useSelector((state: RootState) => state.userReducer.userID);
    const possibleEstimates: number[] = useSelector((state: RootState) => state.volumeReducer.possibleEstimates);
    const progress: number = useSelector((state: RootState) => state.volumeReducer.progress);
    const action: string = useSelector((state: RootState) => state.volumeReducer.action);
    const actionName: string = useSelector((state: RootState) => state.volumeReducer.actionName);
    const activeUsersID = useSelector((state: RootState) => state.pokerReducer.activeUsersID);
    const users = useSelector((state: RootState) => state.pokerReducer.users);
    const finalResult: number = useSelector((state: RootState) => state.volumeReducer.finalResult);   
    const dispatch: AppDispatch = useDispatch();
    const { pokerId } = useParams<{ pokerId: string }>();

    const selectedTask: Task | undefined = useMemo(
        () => tasks.find(item => item.ID === votingTask),
        [tasks, votingTask]
    );

    const userEstimatesRes: UserEstimate[] = useMemo(
        () => {
            let userEstimatesRes = [...userEstimates]
            for (let i = 0; i < activeUsersID.length; i++) {
                if (!userEstimatesRes.find(item => item.UserID == activeUsersID[i])) {
                    userEstimatesRes.push(
                        {
                            Estimate: -1,
                            UserID: activeUsersID[i],
                            PokerID: "",
                            ID: -1
                        }
                    )
                }
            }
            return [...userEstimatesRes].sort((a, b) => a.Estimate - b.Estimate);
        },
        [activeUsersID, users, userEstimates]
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
                    clearInterval(timer!);
                    onTimerComplete();
                } else {
                    dispatch(tickProgress());
                }
            }, 10);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [action, progress, onTimerComplete, tickProgress]);

    if (!pokerId) {
        return <div>pokerId is missing in the URL</div>;
    }

    const handleAddVote = (taskID: number, estimate: number) => {
        dispatch(fetchAddVote({
            estimate,
            pokerID: pokerId
        }));
    };

    const handleSetStateVoting = () => {
        if (action == '') {
            return;
        }
        dispatch(setVotingState({ pokerID: pokerId, action: action, result:finalResult }));
    };

    const handleFinalResultChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        dispatch(setFinalResult(Number(value))); // Обновление состояния финального результата
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
                <Box flex={1} display="flex" justifyContent="center">
                    <Typography variant="h6">Голосование</Typography>
                </Box>
                <IconButton onClick={handleSettingsToggle}>
                    <Settings />
                </IconButton>
            </Box>

            <Box display="flex" height="80vh" flexDirection="column" justifyContent="space-between">
                {selectedTask ? (
                    <Box p={1} overflow="auto">
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6"> ID {selectedTask.ID} {selectedTask.Title}</Typography>
                            </CardContent>

                            <CardActions sx={{ justifyContent: 'center', gap: 3, flexWrap: 'wrap', padding: 2 }}>
                                {action == 'stop' && possibleEstimates.map((estimate: number) => (
                                    <Button
                                        key={estimate.toString()}
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
                                            <LinearProgress />
                                        </Box>
                                    )}
                                </Box>

                                <Box p={0} sx={{ overflowY: 'auto' }}>
                                    <List dense>
                                        {userEstimatesRes.map((userEstimate: UserEstimate) => (
                                            <ListItem key={userEstimate.UserID.toString()} sx={{ py: 0.5 }}>
                                                <ListItemText
                                                    primary={`${users.find(item=>item.ID == userEstimate.UserID)?.Name}`}
                                                    secondary={`Оценка: ${userEstimate.Estimate}`}
                                                    primaryTypographyProps={{ variant: 'body2' }}
                                                    secondaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                                />
                                                <StyledRating
                                                    name="customized-color"
                                                    getLabelText={(value: number) => `${value} Heart${value !== 1 ? 's' : ''}`}
                                                    precision={1}
                                                    icon={<FavoriteIcon fontSize="inherit" />}
                                                    emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                                                    max={possibleEstimates.length}
                                                    value={possibleEstimates.findIndex(item => item == userEstimate.Estimate) + 1}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            </Card>
                        </Box>

                        {/* Поле выбора финального результата */}
                        {(action === 'end') && (
                            <Box mt={2}>
                                <TextField
                                    fullWidth
                                    label="Финальный результат"
                                    type="number"
                                    value={finalResult}
                                    onChange={handleFinalResultChange}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                    
                                />

                            </Box>
                        )}
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

                <Box p={2} display="flex" flexDirection="column" justifyContent="flex-start">
                    {action !== '' && (
                        <Button variant="contained" color="primary" onClick={handleSetStateVoting}>
                            {actionName}
                        </Button>
                    )}
                </Box>
            </Box>
        </Paper>
    );
};

export default Voting;