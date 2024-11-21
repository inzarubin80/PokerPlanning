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
    <Grid2 size={{ xs: 3 }}>
        <Paper elevation={3}>
            <Box p={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Задача за которую идет голосование</Typography>
                    <IconButton onClick={handleSettingsToggle}>
                        <Settings />
                    </IconButton>
                </Box>
                {selectedTask ? (
                    <>
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
                    </>
                ) : (
                    <Typography variant="body2">Выберите задачу для голосования</Typography>
                )}
            </Box>
        </Paper>
    </Grid2>
)


export default Voting