package service

import (
	"context"
	"inzarubin80/PokerPlanning/internal/model"
)

func (s *PokerService) GetPoker(ctx context.Context, pokerID model.PokerID, userID model.UserID) (*model.Poker, error) {

	err := s.repository.AddPokerUser(ctx, pokerID, userID)
	if err != nil {
		return nil, model.ErrorNotFound
	}

	poker, err := s.repository.GetPoker(ctx, pokerID)
	if err != nil {
		return nil, model.ErrorNotFound
	}

	activeUsersID, err := s.hub.GetActiveUsersID(pokerID)
	if err != nil {
		return nil, err
	}
	
	poker.ActiveUsersID = activeUsersID

	users, err:= s.GetPokerUsers(ctx, pokerID)
	if err != nil {
		return nil, err
	}

	poker.Users = users

	return poker, nil

}

func (s *PokerService) CreatePoker(ctx context.Context, userID model.UserID) (model.PokerID, error) {

	return s.repository.CreatePoker(ctx, userID)

}

func (s *PokerService) GetPokerUsers(ctx context.Context, pokerID model.PokerID) ([]*model.User, error) {
    
	ids, err := s.repository.GetUserIDsByPokerID(ctx, pokerID)
    if err != nil {
        return nil, err
    }

    users, err := s.repository.GetUsersByIDs(ctx, ids)
    if err != nil {
        return nil, err
    }

    return users, nil
}