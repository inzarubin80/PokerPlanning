package provideruserdata

import (
	"context"
	"encoding/json"
	"inzarubin80/PokerPlanning/internal/model"
	"golang.org/x/oauth2"
)

type ProviderUserData struct {
	url        string
	oauthConfig *oauth2.Config
	provider  string
}

func NewProviderUserData(url string, oauthConfig *oauth2.Config, provider string) *ProviderUserData {
	return &ProviderUserData{
		url:        url,
		oauthConfig: oauthConfig,
		provider: provider,

	}
}

func (p *ProviderUserData) GetUserData(ctx context.Context, authorizationCode string) (*model.UserProfileFromProvider, error) {

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
	
	displayName,_ := profile["real_name"].(string)
	providerID,_ := profile["id"].(string)
	defaultEmail,_ := profile["default_email"].(string)
	firstName,_ := profile["first_name"].(string)
	lastName,_ := profile["last_name"].(string)
	
	userData := &model.UserProfileFromProvider{
		Name: displayName,
		ProviderID:  providerID,
		ProviderName:  p.provider,
		Email: defaultEmail,
		FirstName: firstName,
		LastName: lastName,
	}

	return userData, nil
}
