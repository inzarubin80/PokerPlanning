package service

import (
	"context"
	"inzarubin80/PokerPlanning/internal/model"
)


func (s *PokerService) AddComment(ctx context.Context, comment *model.Comment) (*model.Comment, error) {

	commentRes, err := s.repository.AddComment(ctx, comment)

	if err != nil {
		return nil, err
	}

	s.hub.AddMessage(comment.PokerID, &COMMENT_MESSAGE{
		Action:  model.ADD_COMMENT,
		Comment: commentRes,
	})
	return commentRes, nil

}

func (s *PokerService) GetComments(ctx context.Context, pokerID model.PokerID) ([]*model.Comment, error) {
	comments, err := s.repository.GetComments(ctx, pokerID)

	if err != nil {
		return nil, err
	}
	return comments, nil
}

func (s *PokerService) UpdateComment(ctx context.Context, comment *model.Comment) (*model.Comment, error) {

	commentRes, err := s.repository.UpdateComment(ctx, comment)

	if err != nil {
		return nil, err
	}

	s.hub.AddMessage(comment.PokerID, &COMMENT_MESSAGE{
		Action:  model.UPDATE_COMMENT,
		Comment: commentRes,
	})

	return commentRes, nil

}

func (s *PokerService) RemoveComment(ctx context.Context, pokerID model.PokerID, commentID model.CommentID) error {

	err := s.repository.RemoveComment(ctx, pokerID, commentID)

	if err != nil {
		return err
	}

	s.hub.AddMessage(pokerID, &COMMENT_MESSAGE{
		Action:    model.REMOVE_COMMENT,
		CommentID: commentID,
	})

	return nil
}
