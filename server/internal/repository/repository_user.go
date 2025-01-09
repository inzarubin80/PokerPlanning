package repository

import (
	"context"
	"fmt"
	"inzarubin80/PokerPlanning/internal/model"
)

func (r *Repository) AddUser(ctx context.Context, userData *model.UserProfileFromProvider) (*model.User, error) {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	user := &model.User{
		ID:    r.storage.nextUsererID,
		Name:  userData.Name,
	}

	r.storage.users[r.storage.nextUsererID] = user
	r.storage.nextUsererID++
	return user, nil

}

func (r *Repository) SetUserName(ctx context.Context, userID model.UserID, name string) (error) {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()
	
	user, ok := r.storage.users[userID]
	if !ok {
		return model.ErrorNotFound
	}

	user.Name = name
	return  nil
}

func (r *Repository) SetUserSettings(ctx context.Context, userID model.UserID, userSettings *model.UserSettings) (error) {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()
	
	user, ok := r.storage.users[userID]
	if !ok {
		return model.ErrorNotFound
	}

	user.EvaluationStrategy = userSettings.EvaluationStrategy
	user.MaximumScore = userSettings.MaximumScore
	
	return  nil
}


func (r *Repository) GetUser(ctx context.Context, userID model.UserID) (*model.User, error) {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	user, ok := r.storage.users[userID]
	if !ok {
		return nil, model.ErrorNotFound
	}

	return  user, nil
}

func (r *Repository) GetUsersByIDs(ctx context.Context, userIDs []model.UserID) ([]*model.User, error) {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	users := make([]*model.User, len(userIDs))

	i := 0

	for _, userID := range userIDs {

		user, ok := r.storage.users[userID]

		if !ok {
			return nil, fmt.Errorf("UserID %d %w", userID, model.ErrorNotFound)
		}

		users[i] = user
		i++

	}

	return users, nil

}
