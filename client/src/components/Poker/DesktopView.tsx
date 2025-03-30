import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import TaskList from '../TaskList/TaskList';
import Voting from '../Voting/Voting';
import Comments from '../Comments/Comments';
import { Task } from '../../model/model';

interface DesktopViewProps {
    pokerId: string;
    isAdmin: boolean;
    taskId: number;
    tasks: Task[];
    handleEditTask: (id: number) => void;
    handleDeleteTask: (id: number) => void;
    handleSetVotingTask: (id: number) => void;
}

const DesktopView: React.FC<DesktopViewProps> = ({
    pokerId,
    isAdmin,
    taskId,
    tasks,
    handleEditTask,
    handleDeleteTask,
    handleSetVotingTask
}) => {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 'calc(100vh - 80px)',
            width: '100%',
            p: 2
        }}>
            <Grid container spacing={2} sx={{
                maxWidth: '95vw',
                height: '90vh',
                margin: 0,
                flexWrap: 'nowrap'
            }}>
                {/* Блок задач */}
                <Grid item xs={12} md={taskId > 0 ? 5 : 6} sx={{
                    display: 'flex',
                    height: '100%'
                }}>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 3,
                        overflow: 'hidden',
                        mr: 1
                    }}>
                        {/* ... (остальное содержимое без изменений) ... */}
                    </Box>
                </Grid>

                {/* Блок голосования */}
                <Grid item xs={12} md={taskId > 0 ? 4 : 6} sx={{
                    display: 'flex',
                    height: '100%'
                }}>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 3,
                        overflow: 'hidden',
                        mx: 1
                    }}>
                        {/* ... (остальное содержимое без изменений) ... */}
                    </Box>
                </Grid>

                {/* Блок комментариев (только при выбранной задаче) */}
                {taskId > 0 && (
                    <Grid item xs={12} md={3} sx={{
                        display: 'flex',
                        height: '100%'
                    }}>
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: 'background.paper',
                            borderRadius: 2,
                            boxShadow: 3,
                            overflow: 'hidden',
                            ml: 1
                        }}>
                            {/* ... (остальное содержимое без изменений) ... */}
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default DesktopView;
