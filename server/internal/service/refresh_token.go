package service

import (
	"context"
	"inzarubin80/PokerPlanning/internal/model"
)

func (s *PokerService) RefreshToken(ctx context.Context, refreshToken string) (*model.AuthData, error) {

	claims, err := s.refreshTokenService.ValidateToken(refreshToken)
	if err != nil {
		return nil, err
	}

	newAccessToken, err := s.accessTokenService.GenerateToken(claims.UserID)
	if err != nil {
		return nil, err
	}

	newRefreshToken, err := s.refreshTokenService.GenerateToken(claims.UserID)
	if err != nil {
		return nil, err
	}

	return &model.AuthData{
		UserID:       claims.UserID,
		RefreshToken: newRefreshToken,
		AccessToken:  newAccessToken,
	}, nil

}
