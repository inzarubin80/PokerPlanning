package service

import (
	"context"
	"encoding/json"
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
		Count int64   `json:"count"`
	}

)

func (s *PokerService) GetVotingTask(ctx context.Context, pokerID model.PokerID) (model.TaskID, error) {

	taskID, err := s.repository.GetVotingTask(ctx, pokerID)
	if err != nil {
		return 0, err
	}
	return taskID, nil

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

	s.repository.ClearVote(ctx, pokerID)

	dataMessage := &VOTING_TASK_MESSAGE{
		Action: model.ADD_VOTING_TASK,
		TaskID: taskID,
	}

	jsonData, err := json.Marshal(dataMessage)

	if err != nil {
		return err
	}


	s.hub.AddMessage(task.PokerID, jsonData)


	dataMessageNumberVoters := &NUMBER_VOTERS_MESSAGE{
		Count: int64(0),
		Action: model.CHANGE_NUMBER_VOTERS,
	}

	jsonData, err = json.Marshal(dataMessageNumberVoters)
	if err != nil {
		return err
	}
	s.hub.AddMessage(task.PokerID, jsonData)


	return nil
}

func (s *PokerService) AddVoting(ctx context.Context, userEstimate *model.UserEstimate) error {

	err :=  s.repository.AddVoting(ctx, userEstimate) 

	if err != nil {
		return err
	}

	res, err:= s.repository.GetVotingResults(ctx, userEstimate.PokerID);

	if err != nil {
		return err
	}
	
	dataMessageNumberVoters := &NUMBER_VOTERS_MESSAGE{
		Count: int64(len(res)),
		Action: model.CHANGE_NUMBER_VOTERS,
	}

	jsonData, err := json.Marshal(dataMessageNumberVoters)
	if err != nil {
		return err
	}

	s.hub.AddMessage(userEstimate.PokerID, jsonData)
	return err

}

