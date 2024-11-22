import React, { useState } from 'react';
import {
    Grid2,
    Paper,
    Typography,
    Button,
    IconButton,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { Settings } from '@mui/icons-material';

import { Task } from '../../model'

interface VotingProps {
    selectedTask: Task | null;
    handleSettingsToggle: () => void
    handleVote: (id: number) => void
    averageEstimate: number
    handleEndVoting: () => void
    averageMethod: string
    showSettings: boolean
    numberVoters: number
}

const Voting: React.FC<VotingProps> = ({selectedTask, averageEstimate, averageMethod, showSettings, numberVoters, handleSettingsToggle, handleVote, handleEndVoting }) => (

        <Paper elevation={3}>
            
                
                <Box position="sticky" top={0}  bgcolor="grey.200" zIndex={1} p={2} height={"4vh"} display="flex" justifyContent="space-between" flexDirection={"row"} >

                    <Typography variant="h6">Голосование</Typography>
                    <IconButton onClick={handleSettingsToggle}>
                        <Settings />
                    </IconButton>
                 
                </Box>

               
                {selectedTask ? (
                     <Box display="flex" height="80vh" flexDirection="column" justifyContent="space-between">
                        <Typography variant="subtitle1">{selectedTask.title}</Typography>
                        <Typography variant="body2">{selectedTask.description}</Typography>
                        <Button variant="outlined" color="primary" onClick={() => handleVote(selectedTask.id)}>XS</Button>
                        <Button variant="outlined" color="primary" onClick={() => handleVote(selectedTask.id)}>S</Button>
                        <Button variant="outlined" color="primary" onClick={() => handleVote(selectedTask.id)}>M</Button>
                        <Box mt={2}>
                            <Typography variant="subtitle2">Средняя оценка: {averageEstimate}</Typography>
                            <Typography variant="subtitle2">Проголосовало: {numberVoters || 0}</Typography>
                        </Box>
                        <Box mt={2}>
                            <Button variant="contained" color="primary" onClick={handleEndVoting}>
                                Закончить голосование
                            </Button>
                        </Box>
                        {showSettings && (
                            <Box mt={2}>
                                <FormControl fullWidth>
                                    <InputLabel>Методика расчета</InputLabel>
                                    <Select
                                        value={averageMethod}
                                    //onChange={handleAverageMethodChange}
                                    >
                                        <MenuItem value="max">Максимальная</MenuItem>
                                        <MenuItem value="min">Минимальная</MenuItem>
                                        <MenuItem value="avg">Средняя</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        )}
                    </Box>
                ) : (
                    <Box display="flex" height="80vh" flexDirection="column" justifyContent="center" alignItems={'center'}>
                    <Box>
                         <Typography variant="body2">Выберите задачу для голосования</Typography>
                    </Box>
                    </Box>
                )}
            
        </Paper>
)


export default Voting