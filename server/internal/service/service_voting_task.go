package service

import (
	"context"
	"fmt"
	"inzarubin80/PokerPlanning/internal/model"
)

func (s *PokerService) GetVotingTask(ctx context.Context, pokerID model.PokerID) (model.TaskID, error)  {

	taskID, err := s.repository.GetVotingTask(ctx, pokerID)
	if err != nil {
		return 0, err
	}
	return taskID, nil

}


func (s *PokerService) AddVotingTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) (error)  {

	task, err := s.repository.GetTask(ctx, pokerID, taskID)
	if err != nil {
		return err
	}

	if task==nil {
		return fmt.Errorf("taskID %w", model.ErrorNotFound)
	}

	err = s.repository.AddVotingTask(ctx, pokerID, taskID)
	if err != nil {
		return  err
	}
	return nil

}
