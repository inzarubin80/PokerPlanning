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
        <Grid container spacing={2} sx={{
            height: 'calc(100vh - 80px)',
            padding: 2,
            alignItems: 'stretch',
            margin: 0,
            flexWrap: 'nowrap',
            overflow: 'hidden'
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
                    <Box sx={{ 
                        p: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        backgroundColor: theme => theme.palette.primary.main,
                        color: 'common.white'
                    }}>
                        <Typography variant="h6" fontWeight="bold">Задачи</Typography>
                    </Box>
                    <Box sx={{
                        flex: 1,
                        overflow: 'auto',
                        padding: 2,
                        '&::-webkit-scrollbar': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: theme => theme.palette.primary.main,
                            borderRadius: '3px',
                        }
                    }}>
                        <TaskList
                            tasks={tasks}
                            isAdmin={isAdmin}
                            handleEditTask={handleEditTask}
                            handleDeleteTask={handleDeleteTask}
                            handleSetVotingTask={handleSetVotingTask}
                        />
                    </Box>
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
                    <Box sx={{ 
                        p: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        backgroundColor: theme => theme.palette.secondary.main,
                        color: 'common.white'
                    }}>
                        <Typography variant="h6" fontWeight="bold">Голосование</Typography>
                    </Box>
                    <Box sx={{ 
                        flex: 1,
                        padding: 2,
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Voting
                            averageEstimate={1}
                            averageMethod={""}
                            isAdmin={isAdmin}
                            handleSettingsToggle={() => { }}
                        />
                    </Box>
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
                        <Box sx={{ 
                            p: 2,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            backgroundColor: theme => theme.palette.info.main,
                            color: 'common.white'
                        }}>
                            <Typography variant="h6" fontWeight="bold">Комментарии</Typography>
                        </Box>
                        <Box sx={{
                            flex: 1,
                            overflow: 'auto',
                            padding: 2,
                            '&::-webkit-scrollbar': {
                                width: '6px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: theme => theme.palette.info.main,
                                borderRadius: '3px',
                            }
                        }}>
                            <Comments pokerID={pokerId} />
                        </Box>
                    </Box>
                </Grid>
            )}
        </Grid>
    );
};

export default DesktopView;