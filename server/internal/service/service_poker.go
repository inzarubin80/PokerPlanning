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

	users, err := s.GetPokerUsers(ctx, pokerID)
	if err != nil {
		return nil, err
	}

	poker.Users = users

	admins, err := s.repository.GetPokerAdmins(ctx, pokerID)
	if err != nil {
		return nil, err
	}

	poker.Admins = admins

	s.hub.AddMessage(pokerID, &ADD_POKER_USER_MESSAGE{
		Action: model.ADD_POKER_USER,
		Users:  users,
	})

	return poker, nil

}

func (s *PokerService) UserIsAdmin(ctx context.Context, pokerID model.PokerID, userID model.UserID) (bool, error) {

	admins, err := s.repository.GetPokerAdmins(ctx, pokerID)
	if err != nil {
		return false, err
	}

	for _, value := range admins {
		if value == userID {
			return true, nil
		}
	}

	return false, nil

}

func (s *PokerService) CreatePoker(ctx context.Context, userID model.UserID, pokerSettings *model.PokerSettings) (model.PokerID, error) {

	pokerID, err := s.repository.CreatePoker(ctx, userID, pokerSettings)
	if err != nil {
		return "", err
	}

	err = s.repository.AddPokerAdmin(ctx, pokerID, userID)
	if err != nil {
		return "", err
	}

	return pokerID, nil
}

func (s *PokerService)  DeletePokerWithAllRelations(ctx context.Context, pokerID model.PokerID) error  {

	return s.repository.DeletePokerWithAllRelations(ctx, pokerID)
	
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


func (s *PokerService)  GetLastSession(ctx context.Context, userID model.UserID, page int32, pageSize int32) ([]*model.LastSessionPoker, error) {

	res, err := s.repository.GetLastSession(ctx, userID, page, pageSize)
	if err != nil {
		return nil, err
	}

	return res, nil

}
