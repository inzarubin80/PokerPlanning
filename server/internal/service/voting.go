package service

import (
	"context"
	"fmt"
	"inzarubin80/PokerPlanning/internal/model"
)

type (
	VOTE_STATE_CHANGE struct {
		Action string       
		State  *model.VoteControlState 
	}

	NUMBER_VOTERS_MESSAGE struct {
		Action string 
		Count  int64  
	}

	USER_ESTIMATE_MESSAGE struct {
		Action   string         
		Estimate model.Estimate 
	}
)

func (s *PokerService) GetVotingState(ctx context.Context, pokerID model.PokerID, userID model.UserID) (*model.VoteControlState, model.Estimate, error) {

	state, err := s.repository.GetVotingState(ctx, pokerID)
	if err != nil {
		return nil, "", err
	}

	estimate, err := s.repository.GetVotingUser(ctx, pokerID, userID)
	if err != nil {
		return nil, "", err
	}

	return state, estimate, nil

}

func (s *PokerService) AddVotingTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) error {

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
		State: state,
	})

	s.hub.AddMessage(task.PokerID, &NUMBER_VOTERS_MESSAGE{
		Count:  int64(0),
		Action: model.CHANGE_NUMBER_VOTERS,
	})

	return nil
}

func (s *PokerService) AddVoting(ctx context.Context, userEstimate *model.UserEstimate) error {

	err := s.repository.AddVoting(ctx, userEstimate)

	if err != nil {
		return err
	}

	res, err := s.repository.GetVotingResults(ctx, userEstimate.PokerID)

	if err != nil {
		return err
	}

	s.hub.AddMessage(userEstimate.PokerID, &NUMBER_VOTERS_MESSAGE{
		Count:  int64(len(res)),
		Action: model.CHANGE_NUMBER_VOTERS,
	})

	s.hub.AddMessageForUser(userEstimate.PokerID,userEstimate.UserID, &USER_ESTIMATE_MESSAGE{
		Action:   model.ADD_VOTING,
		Estimate: userEstimate.Estimate,
	})

	return err

}
