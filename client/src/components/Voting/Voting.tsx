import React, { useMemo } from 'react';
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
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

interface VotingProps {
    handleSettingsToggle: () => void;
    handleVote: (id: number) => void;
    averageEstimate: number;
    handleEndVoting: () => void;
    averageMethod: string;
    showSettings: boolean;
    numberVoters: number;
}

const Voting: React.FC<VotingProps> = ({
    averageEstimate,
    averageMethod,
    showSettings,
    numberVoters,
    handleSettingsToggle,
    handleVote,
    handleEndVoting,
}) => {
    const tasks = useSelector((state: RootState) => state.taskReducer.tasks);
    const votingTask = useSelector((state: RootState) => state.volumeTaskReducer.VotingTask);

    const selectedTask = useMemo(
        () => tasks.find(item => item.id === votingTask),
        [tasks, votingTask]
    );

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

                            <CardActions sx={{ justifyContent: 'center', gap: 2, flexWrap: 'wrap', padding: 2 }}>
                                {/* Voting Buttons */}
                                <Button variant="outlined" color="primary" onClick={() => handleVote(selectedTask.id)}>
                                    XS
                                </Button>
                                <Button variant="outlined" color="primary" onClick={() => handleVote(selectedTask.id)}>
                                    S
                                </Button>
                                <Button variant="outlined" color="primary" onClick={() => handleVote(selectedTask.id)}>
                                    M
                                </Button>
                            </CardActions>
                        </Card>

                        {/* Voting Stats */}
                        <Box mt={2}>
                            <Typography variant="subtitle1" align="center">
                                Средняя оценка: {averageEstimate}
                            </Typography>
                            <Typography variant="subtitle1" align="center">
                                Проголосовало: {numberVoters || 0}
                            </Typography>
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

                {/* End Voting Button */}
                <Box p={2} display="flex" flexDirection="column" justifyContent="flex-start">
                    <Button variant="contained" color="primary" onClick={handleEndVoting}>
                        Закончить голосование
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default Voting;