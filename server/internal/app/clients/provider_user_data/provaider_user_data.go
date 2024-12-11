package provideruserdata

import (
	"context"
	"encoding/json"
	"inzarubin80/PokerPlanning/internal/app/defenitions"
	"inzarubin80/PokerPlanning/internal/model"
	"golang.org/x/oauth2"
)

type ProviderUserData struct {
	url        string
	oauthConfig *oauth2.Config
}

func NewProviderUserData(url string, oauthConfig *oauth2.Config) *ProviderUserData {
	return &ProviderUserData{
		url:        url,
		oauthConfig: oauthConfig,
	}
}

func (p *ProviderUserData) GetUserData(ctx context.Context, authorizationCode string) (*model.UserData, error) {

	token, err := p.oauthConfig.Exchange(context.Background(), authorizationCode)
	if err != nil {
		return nil, err
	}

	client := p.oauthConfig.Client(context.Background(), token)
	response, err := client.Get(p.url)
	if err != nil {	
		return nil, err
	}
	defer response.Body.Close()

	var profile map[string]interface{}
	if err := json.NewDecoder(response.Body).Decode(&profile); err != nil {
		return nil, err
	}

	displayName,_ := profile[defenitions.DisplayName].(string)
	

	default_email,_ := profile[defenitions.DefaultEmail].(string)
	
	userData := &model.UserData{
		Name: displayName,
		Email: default_email,
	}

	return userData, nil
}
