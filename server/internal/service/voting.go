package service

import (
	"context"
	"fmt"
	"inzarubin80/PokerPlanning/internal/model"
	"time"
)

type (
	VOTE_STATE_CHANGE struct {
		Action string
		State  *model.VoteControlState
	}

	USER_ESTIMATE_MESSAGE struct {
		Action    string
		Estimates []*model.UserEstimate
	}
)

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

	s.hub.AddMessage(task.PokerID, &VOTE_STATE_CHANGE{
		Action: model.VOTE_STATE_CHANGE,
		State:  state,
	})

	s.hub.AddMessage(pokerID, &USER_ESTIMATE_MESSAGE{
		Action:    model.ADD_VOTING,
		Estimates: make([]*model.UserEstimate, 0),
	})

	return nil
}

func (s *PokerService) SetVoting(ctx context.Context, userEstimate *model.UserEstimate) error {

	err := s.repository.SetVoting(ctx, userEstimate)

	if err != nil {
		return err
	}

	userEstimates, err := s.repository.GetVotingResults(ctx, userEstimate.PokerID)

	if err != nil {
		return err
	}

	s.hub.AddMessageForUser(userEstimate.PokerID, userEstimate.UserID, &USER_ESTIMATE_MESSAGE{
		Action:    model.ADD_VOTING,
		Estimates: userEstimates,
	})

	return err

}

func (s *PokerService) GetVotingResults(ctx context.Context, pokerID model.PokerID) ([]*model.UserEstimate, error) {

	userEstimates, err := s.repository.GetVotingResults(ctx, pokerID)

	if err != nil {
		return nil, err
	}

	return userEstimates, nil

}

func (s *PokerService) SetVotingState(ctx context.Context, pokerID model.PokerID, actionVotingState string) (*model.VoteControlState, error) {

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
	} else {
		return nil, fmt.Errorf("action %s %w", actionVotingState, model.ErrorNotFound)
	}

	newState, err := s.repository.SetVotingState(ctx, pokerID, state)

	if err != nil {
		return nil, err
	}

	err = s.hub.AddMessage(pokerID, &VOTE_STATE_CHANGE{
		Action: model.VOTE_STATE_CHANGE,
		State:  state,
	})

	if err != nil {
		return nil, err
	}

	return newState, err
}
