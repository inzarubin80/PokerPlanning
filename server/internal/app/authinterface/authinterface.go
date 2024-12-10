package authinterface

import (
	"context"
	"inzarubin80/PokerPlanning/internal/model"
)

type (
	TokenService interface {
		GenerateToken(userID model.UserID) (string, error)
		ValidateToken(tokenString string) (*model.Claims, error)
	}

	ProviderUserData interface {
		GetUserData(ctx context.Context, authorizationCode string) (*model.UserData, error)
	}

	ProvidersUserData map[string]ProviderUserData
)
