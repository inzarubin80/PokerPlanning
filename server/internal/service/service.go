package service

import (
	"context"
	"errors"
	"fmt"
	"inzarubin80/PokerPlanning/internal/model"
)

type (
	PokerService struct {
		repository Repository
	}
	Repository interface {
		CreatePoker(ctx context.Context, userID model.UserID) (model.PokerID, error)
		AddComment(ctx context.Context, pokerID model.PokerID, comment *model.Comment) (model.CommentID, error)
		AddTask(ctx context.Context, pokerID model.PokerID, task *model.Task) (model.TaskID, error)
		RemoveTargetTask(ctx context.Context, pokerID model.PokerID) error
		AddTargetTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) error
		GetTargetTask(ctx context.Context, pokerID model.PokerID) (model.TaskID, error)
		ClearTargetTask(ctx context.Context, pokerID model.PokerID) error
		AddUserEstimate(ctx context.Context, pokerID model.PokerID, userEstimate *model.UserEstimate) (model.EstimateID, error)
		GetUserEstimateForUserID(ctx context.Context, pokerID model.PokerID, userID model.UserID) (*model.UserEstimate, error)
		UpdateUserEstimate(ctx context.Context, pokerID model.PokerID, estimate *model.UserEstimate) (model.EstimateID, error)
		GetTasks(ctx context.Context, pokerID model.PokerID) ([]*model.Task, error)
		GetComments(ctx context.Context, pokerID model.PokerID) ([]*model.Comment, error)
		GetUserEstimates(ctx context.Context, pokerID model.PokerID) ([]*model.UserEstimate, error)
		GetParticipants(ctx context.Context, pokerID model.PokerID) ([]model.UserID, error)
		GetBasedata(ctx context.Context, pokerID model.PokerID) (*model.BaseDataPoker, error)
	}
)

func NewPokerService(repository Repository) *PokerService {
	return &PokerService{
		repository: repository,
	}
}

func (s *PokerService) GetPoker(ctx context.Context, pokerID model.PokerID) (*model.Poker, error) {

	basedata, err := s.repository.GetBasedata(ctx, pokerID)
	if err != nil {
		return nil, model.ErrorNotFound
	}

	tasks, err := s.repository.GetTasks(ctx, pokerID)
	if err != nil {
		return nil, err
	}

	comments, err := s.repository.GetComments(ctx, pokerID)
	if err != nil {
		return nil, err
	}

	userEstimates, err := s.repository.GetUserEstimates(ctx, pokerID)
	if err != nil {
		return nil, err
	}

	participants, err := s.repository.GetParticipants(ctx, pokerID)
	if err != nil {
		return nil, err
	}

	return &model.Poker{
		BaseDataPoker: basedata,
		Tasks:         tasks,
		Comments:      comments,
		Estimates:     userEstimates,
		Participants:  participants,
	}, nil

}

func (s *PokerService) CreatePoker(ctx context.Context, userID model.UserID) (model.PokerID, error) {
	return s.repository.CreatePoker(ctx, userID)
}

func (s *PokerService) AddComment(ctx context.Context, pokerID model.PokerID, comment *model.Comment) (model.CommentID, error) {
	return s.repository.AddComment(ctx, pokerID, comment)
}

func (s *PokerService) SetUserEstimate(ctx context.Context, pokerID model.PokerID, userID model.UserID, userEstimate *model.UserEstimate) (model.EstimateID, error) {

	targetTaskID, err := s.repository.GetTargetTask(ctx, pokerID)

	if err != nil {
		return 0, err
	}

	if targetTaskID == 0 {
		return 0, fmt.Errorf("target task poker %s %w", pokerID, model.ErrorNotFound)
	}

	_, err = s.repository.GetUserEstimateForUserID(ctx, pokerID, userID)
	if err != nil {
		if errors.Is(err, model.ErrorNotFound) {
			return s.repository.AddUserEstimate(ctx, pokerID, userEstimate)
		} else {
			return 0, err
		}
	} else {
		return s.repository.UpdateUserEstimate(ctx, pokerID, userEstimate)
	}

}

func (s *PokerService) SetTargetTask(ctx context.Context, pokerID model.PokerID, userID model.UserID, taskID model.TaskID) error {
	targetTaskID, err := s.repository.GetTargetTask(ctx, pokerID)
	if !errors.Is(err, model.ErrorNotFound) {
		return err
	}

	if targetTaskID > 0 {
		return model.ErrorTargetTaskNotEmpty
	}
	return s.repository.AddTargetTask(ctx, pokerID, taskID)
}
