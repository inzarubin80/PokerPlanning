package repository

import (
	"context"
	"inzarubin80/PokerPlanning/internal/model"
)

func (r *Repository) GetUserAuthProvidersByProviderUid(ctx context.Context, ProviderUid string, Provider string) (*model.UserAuthProviders, error) {

	r.storage.mx.RLock()
	defer r.storage.mx.RUnlock()

	userAuthProviders, ok := r.storage.userAuthProviders[ProviderUid]
	if !ok {
		return nil, model.ErrorNotFound
	}
	return userAuthProviders, nil

}

func (r *Repository) AddUserAuthProviders(ctx context.Context, userProfileFromProvide *model.UserProfileFromProvider, userID model.UserID) (*model.UserAuthProviders, error) {

	r.storage.mx.RLock()
	defer r.storage.mx.RUnlock()

	userAuthProviders := &model.UserAuthProviders{
		ID:          r.storage.nextAuthProvidersID,
		UserID:      userID,
		ProviderUid: userProfileFromProvide.ProviderID,
		Provider:    userProfileFromProvide.ProviderName,
	}

	r.storage.nextAuthProvidersID++
	r.storage.userAuthProviders[userProfileFromProvide.ProviderID] = userAuthProviders
	return userAuthProviders, nil

}
