package service

import (
	"context"
	"fmt"
	"inzarubin80/PokerPlanning/internal/model"
)

type (
	VOTING_TASK_MESSAGE struct {
		Action string       `json:"action"`
		TaskID model.TaskID `json:"task_id"`
	}

	NUMBER_VOTERS_MESSAGE struct {
		Action string `json:"action"`
		Count  int64  `json:"count"`
	}

	USER_ESTIMATE_MESSAGE struct {
		Action   string         `json:"action"`
		Estimate model.Estimate `json:"estimate"`
	}
)

func (s *PokerService) GetVotingTask(ctx context.Context, pokerID model.PokerID, userID model.UserID) (model.TaskID, model.Estimate, error) {

	taskID, err := s.repository.GetVotingTask(ctx, pokerID)
	if err != nil {
		return 0, "", err
	}

	estimate, err := s.repository.GetVotingUser(ctx, pokerID, userID)
	if err != nil {
		return 0, "", err
	}

	return taskID, estimate, nil

}

func (s *PokerService) AddVotingTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) error {

	task, err := s.repository.GetTask(ctx, pokerID, taskID)
	if err != nil {
		return err
	}

	if task == nil {
		return fmt.Errorf("taskID %w", model.ErrorNotFound)
	}

	err = s.repository.AddVotingTask(ctx, pokerID, taskID)
	if err != nil {
		return err
	}

	err = s.repository.ClearVote(ctx, pokerID)
	if err != nil {
		return err
	}

	s.hub.AddMessage(task.PokerID, &VOTING_TASK_MESSAGE{
		Action: model.ADD_VOTING_TASK,
		TaskID: taskID,
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
