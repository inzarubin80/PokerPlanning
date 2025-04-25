package authinterface

import (
	"context"
	"golang.org/x/oauth2"
	"inzarubin80/PokerPlanning/internal/model"
)

type (
	TokenService interface {
		GenerateToken(userID model.UserID) (string, error)
		ValidateToken(tokenString string) (*model.Claims, error)
	}

	ProviderUserData interface {
		GetUserData(ctx context.Context, authorizationCode string) (*model.UserProfileFromProvider, error)
	}

	ProvidersUserData map[string]ProviderUserData

	ProviderOauthConf struct {
		Oauth2Config *oauth2.Config
		UrlUserData  string
		ImageBase64  string
	}

	MapProviderOauthConf map[string]*ProviderOauthConf

	ProviderOauthConfFrontend struct {
		Provider    string
		ClientId    string
		AuthURL     string
		RedirectUri string
		ImageBase64 string
	}
)
