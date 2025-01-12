package service

import (
	"context"
	"fmt"
	"inzarubin80/PokerPlanning/internal/model"
	"time"
)

type ()

func (s *PokerService) GetVotingState(ctx context.Context, pokerID model.PokerID, userID model.UserID) (*model.VoteControlState, error) {

	state, err := s.repository.GetVotingState(ctx, pokerID)
	if err != nil {
		return nil, err
	}
	return state, nil

}

func (s *PokerService) SetVotingTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) error {

	task, err := s.repository.GetTask(ctx, pokerID, taskID)
	if err != nil {
		return err
	}

	if task == nil {
		return fmt.Errorf("taskID %w", model.ErrorNotFound)
	}

	state, err := s.repository.SetVotingTask(ctx, pokerID, taskID)
	if err != nil {
		return err
	}

	err = s.repository.ClearVote(ctx, pokerID)
	if err != nil {
		return err
	}

	s.hub.AddMessage(task.PokerID, &VOTE_STATE_CHANGE_MESSAGE{
		Action: model.VOTE_STATE_CHANGE,
		State:  state,
	})

	s.hub.AddMessage(pokerID, &USER_ESTIMATE_MESSAGE{
		Action: model.ADD_VOTING,
		VotingResult: &model.VotingResult{
			UserEstimates: make([]*model.UserEstimate, 0),
			FinalResult:   0,
		},
	})

	return nil
}

func (s *PokerService) SetVoting(ctx context.Context, userEstimate *model.UserEstimate, userID model.UserID) error {

	err := s.repository.SetVoting(ctx, userEstimate)

	if err != nil {
		return err
	}

	votingResult, err := s.GetVotingResults(ctx, userEstimate.PokerID, userID)
	if err != nil {
		return err
	}

	s.hub.AddMessage(userEstimate.PokerID, &USER_ESTIMATE_MESSAGE{
		Action:       model.ADD_VOTING,
		VotingResult: votingResult,
	})

	return err
}

func (s *PokerService) GetVotingResults(ctx context.Context, pokerID model.PokerID, userID model.UserID) (*model.VotingResult, error) {

	// Fetch user estimates
	userEstimates, err := s.repository.GetVotingResults(ctx, pokerID)
	if err != nil {
		return nil, err
	}

	// Fetch poker details
	poker, err := s.repository.GetPoker(ctx, pokerID)
	if err != nil {
		return nil, err
	}

	// Fetch voting state
	state, err := s.repository.GetVotingState(ctx, pokerID)
	if err != nil {
		return nil, err
	}

	finalResult := 0

	var votingResult *model.VotingResult

	if !state.EndDate.IsZero() {
		switch poker.EvaluationStrategy {
		case "maximum":
			// Find the maximum estimate
			for _, item := range userEstimates {
				if int(item.Estimate) > finalResult {
					finalResult = int(item.Estimate)
				}
			}

		case "minimum":
			// Find the minimum estimate
			for i, item := range userEstimates {
				if i == 0 || int(item.Estimate) < finalResult {
					finalResult = int(item.Estimate)
				}
			}

		default:
			// Calculate the average estimate
			sum := 0
			for _, item := range userEstimates {
				sum += int(item.Estimate)
			}

			if len(userEstimates) > 0 {
				finalResult = sum / len(userEstimates)
			}
		}

		votingResult = &model.VotingResult{
			UserEstimates: userEstimates,
			FinalResult:   finalResult,
		}

	} else {

		userEstimatesOnlyUser := make([]*model.UserEstimate, len(userEstimates), len(userEstimates))
		for i, item := range userEstimates {
			userEstimatesOnlyUser[i] = item
			if item.UserID != userID {
				userEstimatesOnlyUser[i].Estimate = -2
			}
		}

		votingResult = &model.VotingResult{
			UserEstimates: userEstimatesOnlyUser,
			FinalResult:   0,
		}

	}

	return votingResult, nil
}

func (s *PokerService) SetVotingState(ctx context.Context, pokerID model.PokerID, actionVotingState string, estimate ...model.Estimate) (*model.VoteControlState, error) {

	state, err := s.repository.GetVotingState(ctx, pokerID)

	if err != nil {
		return nil, err
	}

	if state.TaskID <= 0 {
		return nil, fmt.Errorf("TaskID is empty")
	}

	if actionVotingState == model.START_VOTING {

		state.StartDate = time.Now()
		state.EndDate = time.Time{}

	} else if actionVotingState == model.STOP_VOTING {

		if (state.StartDate == time.Time{}) {
			return nil, fmt.Errorf("StartDate is empty")
		}
		state.EndDate = time.Now()

	} else if actionVotingState == model.END_VOTING {

		task, err := s.repository.GetTask(ctx, pokerID, state.TaskID)

		if err != nil {
			return nil, err
		}

		task.Estimate = estimate[0]

		_, err = s.repository.UpdateTask(ctx, pokerID, task)

		s.hub.AddMessage(task.PokerID, &TASK_MESSAGE{
			Action: model.UPDATE_TASK,
			Task:   task,
		})

		if err != nil {
			return nil, err
		}

		state.EndDate = time.Time{}
		state.StartDate = time.Time{}
		state.TaskID = 0

	} else {
		return nil, fmt.Errorf("action %s %w", actionVotingState, model.ErrorNotFound)
	}

	newState, err := s.repository.SetVotingState(ctx, pokerID, state)

	if err != nil {
		return nil, err
	}

	err = s.hub.AddMessage(pokerID, &VOTE_STATE_CHANGE_MESSAGE{
		Action: model.VOTE_STATE_CHANGE,
		State:  state,
	})

	if err != nil {
		return nil, err
	}


	votingResult, err := s.GetVotingResults(ctx, pokerID, -1)
	if err != nil {
		return nil, err
	}
	s.hub.AddMessage(pokerID, &USER_ESTIMATE_MESSAGE{
		Action:       model.ADD_VOTING,
		VotingResult: votingResult,
	})

	return newState, err
}
