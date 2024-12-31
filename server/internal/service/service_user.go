package service

import (
	"context"
	"errors"
	"inzarubin80/PokerPlanning/internal/model"
)



func (s *PokerService) GetUserByEmail(ctx context.Context, userData *model.UserData) (*model.User, error) {	
		
	user,err:= s.repository.GetUserByEmail(ctx, userData.Email)

	if user != nil {
		return user, nil
	}

	if !errors.Is(err, model.ErrorNotFound) {
		return nil, err
	}

	user,err = s.repository.AddUser(ctx, userData)


	if err!=nil {
		return nil, err
	}

	return user, nil

}


