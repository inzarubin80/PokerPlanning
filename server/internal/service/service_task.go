package service

import (
	"context"
	"inzarubin80/PokerPlanning/internal/model"
	"time"
)

func (s *PokerService) AddTask(ctx context.Context, task *model.Task) (*model.Task, error) {

	task, err := s.repository.AddTask(ctx, task)

	if err != nil {
		return nil, err
	}

	s.hub.AddMessage(task.PokerID, &TASK_MESSAGE{
		Action: model.ADD_TASK,
		Task:   task,
	})
	return task, nil
}

func (s *PokerService) UpdateTask(ctx context.Context, pokerID model.PokerID, task *model.Task) (*model.Task, error) {

	task, err := s.repository.UpdateTask(ctx, pokerID, task)

	if err != nil {
		return nil, err
	}

	s.hub.AddMessage(task.PokerID, &TASK_MESSAGE{
		Action: model.UPDATE_TASK,
		Task:   task,
	})
	return task, nil

}

func (s *PokerService) GetTasks(ctx context.Context, pokerID model.PokerID) ([]*model.Task, error) {
	tasks, err := s.repository.GetTasks(ctx, pokerID)
	if err != nil {
		return nil, err
	}
	return tasks, nil
}

func (s *PokerService) DeleteTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) error {

	err := s.repository.DeleteTask(ctx, pokerID, taskID)

	if err != nil {
		return err
	}


	state, err := s.repository.GetVotingState(ctx, pokerID)
	if err != nil {
		return err
	}

	if err != nil {
		return err
	}

	if state.TaskID == taskID {


		state := &model.VoteControlState{
			TaskID: 0,
			PokerID: pokerID,
			StartDate: time.Time{},
			EndDate: time.Time{},
		}

		newState, err := s.repository.SetVotingState(ctx, pokerID, state)
	
		if err != nil {
			return err
		}

		s.hub.AddMessage(pokerID, &VOTE_STATE_CHANGE_MESSAGE{
			Action: model.VOTE_STATE_CHANGE,
			State: newState,
		})


	}

	s.hub.AddMessage(pokerID, &TASK_MESSAGE{
		Action: model.REMOVE_TASK,
		TaskID: taskID,
	})

	

	return nil
}

func (s *PokerService) GetTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) (*model.Task, error) {
	task, err := s.repository.GetTask(ctx, pokerID, taskID)
	if err != nil {
		return nil, err
	}
	return task, nil
}
