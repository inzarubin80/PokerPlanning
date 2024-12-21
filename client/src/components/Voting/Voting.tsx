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
    dividerClasses,
} from '@mui/material';
import { Settings } from '@mui/icons-material';
import { useSelector,useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';

import {fetchAddVote} from '../../features/volumeTask/volumeTask';
import { useParams } from 'react-router-dom';

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
    const tasks = useSelector((state: RootState) => state.taskReducer.tasks);
    const votingTask = useSelector((state: RootState) => state.volumeTaskReducer.VotingTask);
    const vote = useSelector((state: RootState) => state.volumeTaskReducer.vote);
    
    const voiceScale = useSelector((state: RootState) => state.volumeTaskReducer.voiceScale);
    const numberVoters = useSelector((state: RootState) => state.volumeTaskReducer.numberVoters);
    
    const dispatch = useDispatch<AppDispatch>();
      

    const { pokerId } = useParams<{ pokerId: string }>();
      
  
    const selectedTask = useMemo(
        () => tasks.find(item => item.id === votingTask),
        [tasks, votingTask]
    );

    if (!pokerId) {
        return (<div>
            pokerId is missing in the URL
        </div>)
    }
    

    const  handleAddVote = (taskID:number, estimate:string) => {
       
        console.log("handleAddVote")
       
        dispatch(fetchAddVote(
            {
                estimate:estimate,
                pokerID: pokerId,
                taskID:taskID
            }
        ))
    }




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

                                {voiceScale.map((estimate: string) => (

                                    <Button key={estimate} 
                                    
                                    variant = {estimate==vote ?'contained' : 'outlined'}

                                    color="primary" 
                                    
                                    onClick={() => handleAddVote(selectedTask.id, estimate)}>
                                        {estimate}
                                    </Button>))
                                }


                            </CardActions>
                        </Card>

                        {/* Voting Stats */}
                        <Box mt={2}>
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