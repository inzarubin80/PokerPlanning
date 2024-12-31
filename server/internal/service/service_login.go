package service

import (
	"context"
	"errors"
	"fmt"
	"inzarubin80/PokerPlanning/internal/model"
)

func (s *PokerService) Login(ctx context.Context, providerKey string, authorizationCode string) (*model.AuthData, error) {

	provider, ok := s.providersUserData[providerKey]

	if !ok {
		return nil, fmt.Errorf("provider not found")
	}

	userData, err := provider.GetUserData(ctx, authorizationCode)
	if err!=nil {
		return nil, err
	}


	if userData.Email == "" {
		return nil, fmt.Errorf("email not found")
	}

	user, err := s.repository.GetUserByEmail(ctx, userData.Email)

	if err != nil && !errors.Is(err, model.ErrorNotFound) {
		return nil, err
	}

	if user == nil {
		user, err = s.repository.AddUser(ctx, userData)
		if err != nil {
			return nil, err
		}
	}

	refreshToken, err := s.refreshTokenService.GenerateToken(user.ID)
	if err != nil {
		return nil, err
	}

	accessToken, err := s.accessTokenService.GenerateToken(user.ID)
	if err != nil {
		return nil, err
	}

	return &model.AuthData{
		UserID:       user.ID,
		RefreshToken: refreshToken,
		AccessToken:  accessToken,
	}, nil

}
