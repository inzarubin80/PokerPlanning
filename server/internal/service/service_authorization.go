package service

import (
	"context"
	"inzarubin80/PokerPlanning/internal/model"
)

func (s *PokerService) Authorization(ctx context.Context, accessToken string) (*model.Claims, error) {

	return s.accessTokenService.ValidateToken(accessToken)

}
