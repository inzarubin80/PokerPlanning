package service

import (
	"context"
	"inzarubin80/PokerPlanning/internal/model"
	"encoding/json"
)

type (

	ADD_TASK_MESSAGE struct {
		Action string      `json:"action"`
		Task   *model.Task `json:"task"`
	}

)

func (s *PokerService) AddTask(ctx context.Context,  task *model.Task) (*model.Task, error) {	
	
 	task, err := s.repository.AddTask(ctx, task)

	if err != nil {
		return nil, err
	}
	
	dataMessage := &ADD_TASK_MESSAGE{
		Action:  model.ADD_TASK,
		Task: task,
	}
	
	jsonData, err := json.Marshal(dataMessage)
	
	if err != nil {
		return nil, err
	}

	s.hub.AddMessage(task.PokerID, jsonData)
	return task, nil
}

func (s *PokerService) GetTasks(ctx context.Context, pokerID model.PokerID) ([]*model.Task, error) {
	tasks, err := s.repository.GetTasks(ctx, pokerID)
	if err != nil {
		return nil, err
	}
	return tasks, nil
}



