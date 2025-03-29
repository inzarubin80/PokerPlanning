import React, { useMemo } from 'react';
import {
  Paper,
  Typography,
  Button,
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
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { submitUserVote, updateFinalResultAction,  updateVotingStatus} from '../../features/voting/votingSlice';
import { useParams } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/StarOutline';
import FavoriteBorderIcon from '@mui/icons-material/StarOutline';
import { Task, UserEstimate } from '../../model/model';

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#ff6d75',
  },
  '& .MuiRating-iconHover': {
    color: '#ff3d47',
  },
});

interface VotingProps {
  isAdmin: boolean;
  handleSettingsToggle: () => void;
  averageEstimate: number;
  averageMethod: string;
}

const Voting: React.FC<VotingProps> = ({ isAdmin }) => {
  const tasks: Task[] = useSelector((state: RootState) => state.taskReducer.tasks);
  const votingTask: number | null = useSelector((state: RootState) => state.volumeReducer.taskData.id);
  const userEstimates: UserEstimate[] = useSelector((state: RootState) => state.volumeReducer.taskData.estimates);
  const userID: number = useSelector((state: RootState) => state.userReducer.userID);
  const possibleEstimates: number[] = useSelector((state: RootState) => state.pokerReducer.possibleEstimates);
  const action: string = useSelector((state: RootState) => state.volumeReducer.taskData.votingAction);
  const actionName: string = useSelector((state: RootState) => state.volumeReducer.taskData.votingActionName);
  const activeUsersID = useSelector((state: RootState) => state.pokerReducer.activeUsersID);
  const users = useSelector((state: RootState) => state.pokerReducer.users);
  const finalResult: number = useSelector((state: RootState) => state.volumeReducer.taskData.finalResult);
  const dispatch: AppDispatch = useDispatch();
  const { pokerId } = useParams<{ pokerId: string }>();

  const selectedTask: Task | undefined = useMemo(
    () => tasks.find(item => item.ID === votingTask),
    [tasks, votingTask]
  );

  const userEstimatesRes: UserEstimate[] = useMemo(() => {
    let userEstimatesRes = [...userEstimates];
    for (let i = 0; i < activeUsersID.length; i++) {
      if (!userEstimatesRes.find(item => item.UserID === activeUsersID[i])) {
        userEstimatesRes.push({
          Estimate: -1,
          UserID: activeUsersID[i],
          PokerID: "",
          ID: -1
        });
      }
    }
    
    if (action === 'end') {
      return [...userEstimatesRes].sort((a, b) => a.Estimate - b.Estimate);
    }
    return [...userEstimatesRes];
  }, [activeUsersID, userEstimates, action]);

  const currentEstimate: UserEstimate | undefined = useMemo(
    () => userEstimates.find(item => item.UserID === userID),
    [userEstimates, userID]
  );

  if (!pokerId) {
    return <div>pokerId is missing in the URL</div>;
  }

  const handleAddVote = (taskID: number, estimate: number) => {
    dispatch(submitUserVote({
      estimate,
      pokerId
    }));
  };

  const handleSetStateVoting = () => {
    if (action === '') {
      return;
    }
    dispatch(updateVotingStatus({ pokerId: pokerId, action: action, result: finalResult }));
  };

  const handleFinalResultChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    dispatch(updateFinalResultAction(Number(value)));
  };

  return (
    <>

      <Box flex={1} display="flex" flexDirection="column" overflow="hidden">
        {selectedTask ? (
          <Box flex={1} overflow="auto" p={2}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">ID {selectedTask.ID} {selectedTask.Title}</Typography>
              </CardContent>

              <CardActions sx={{ justifyContent: 'center', gap: 3, flexWrap: 'wrap', padding: 2 }}>
                {action === 'stop' && possibleEstimates.map((estimate: number) => (
                  <Button
                    key={estimate.toString()}
                    variant={currentEstimate?.Estimate === estimate ? 'contained' : 'outlined'}
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
                    {userEstimatesRes.map((userEstimate: UserEstimate) => action === 'end' ? (
                      <ListItem key={userEstimate.UserID.toString()} sx={{ py: 0.5 }}>
                        <ListItemText
                          primary={`${users.find(item => item.ID === userEstimate.UserID)?.Name}`}
                          secondary={`Оценка: ${userEstimate.Estimate < 0 ? "-" : userEstimate.Estimate}`}
                          primaryTypographyProps={{
                            variant: 'body2',
                            sx: {
                              color: userEstimate.Estimate > 0 ? 'green' : 'inherit',
                              fontWeight: userEstimate.Estimate > 0 ? 'bold' : 'normal'
                            }
                          }}
                          secondaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                        />
                        <StyledRating
                          disabled
                          name="customized-color"
                          getLabelText={(value: number) => `${value} Heart${value !== 1 ? 's' : ''}`}
                          precision={1}
                          icon={<FavoriteIcon fontSize="inherit" />}
                          emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                          max={possibleEstimates.length}
                          value={possibleEstimates.findIndex(item => item === userEstimate.Estimate) + 1}
                        />
                      </ListItem>
                    ) : (
                      <ListItem sx={{ py: 0.5 }} key={userEstimate.UserID.toString()}  >
                        <ListItemText
                          primary={`${users.find(item => item.ID === userEstimate.UserID)?.Name}`}
                          primaryTypographyProps={{
                            variant: 'body2',
                            sx: {
                              color: userEstimate.Estimate > 0 ? 'green' : 'inherit',
                              fontWeight: userEstimate.Estimate > 0 ? 'bold' : 'normal'
                            }
                          }}
                          secondaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Card>
            </Box>

            {action === 'end' && (
              <Box mt={2}>
                <TextField
                  fullWidth
                  label="Финальный результат"
                  type="number"
                  value={finalResult}
                  onChange={handleFinalResultChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            )}
          </Box>
        ) : (
          <Box
            flex={1}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            p={2}
          >
            <Typography variant="body1" align="center">
              Выберите задачу для голосования
            </Typography>
          </Box>
        )}

        {isAdmin && action !== '' && (
          <Box p={2} borderTop={1} borderColor="divider">
            <Button variant="contained" color="primary" onClick={handleSetStateVoting} fullWidth>
              {actionName}
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Voting;