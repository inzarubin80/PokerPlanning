package service

import (
	"context"
	"inzarubin80/PokerPlanning/internal/model"
)

func (s *PokerService) CreateComent(ctx context.Context, comment *model.Comment) (*model.Comment, error) {

	commentRes, err := s.repository.CreateComent(ctx, comment)

	if err != nil {
		return nil, err
	}

	s.hub.AddMessage(comment.PokerID, &COMMENT_MESSAGE{
		Action:  model.ADD_COMMENT,
		Comment: commentRes,
	})
	return commentRes, nil

}

func (s *PokerService) GetComments(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) ([]*model.Comment, error) {
	comments, err := s.repository.GetComments(ctx, pokerID, taskID)

	if err != nil {
		return nil, err
	}
	return comments, nil
}


