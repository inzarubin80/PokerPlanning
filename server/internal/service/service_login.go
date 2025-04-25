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

	userProfileFromProvider, err := provider.GetUserData(ctx, authorizationCode)
	if err != nil {
		return nil, err
	}

	userAuthProviders, err := s.repository.GetUserAuthProvidersByProviderUid(ctx, userProfileFromProvider.ProviderID, userProfileFromProvider.ProviderName)

	if err != nil && !errors.Is(err, model.ErrorNotFound) {
		return nil, err
	}

	if userAuthProviders == nil {

		user, err := s.repository.CreateUser(ctx, userProfileFromProvider)
		if err != nil {
			return nil, err
		}

		userAuthProviders, err = s.repository.AddUserAuthProviders(ctx, userProfileFromProvider, user.ID)
		if err != nil {
			return nil, err
		}

	}

	userID := userAuthProviders.UserID

	refreshToken, err := s.refreshTokenService.GenerateToken(userID)
	if err != nil {
		return nil, err
	}

	accessToken, err := s.accessTokenService.GenerateToken(userID)
	if err != nil {
		return nil, err
	}

	return &model.AuthData{
		UserID:       userID,
		RefreshToken: refreshToken,
		AccessToken:  accessToken,
	}, nil

}
