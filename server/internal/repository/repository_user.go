package repository

import (
	"context"
	"fmt"
	"inzarubin80/PokerPlanning/internal/model"
)

func (r *Repository) GetUserByEmail(ctx context.Context, email string) (*model.User, error) {

	r.storage.mx.RLock()
	defer r.storage.mx.RUnlock()

	for _, user := range r.storage.users {
		if user.Email == email {
			return user, nil
		}
	}
	return nil, fmt.Errorf("user with email %s %w", email, model.ErrorNotFound)
}


func (r *Repository) AddUser(ctx context.Context, userData *model.UserData) (*model.User, error) {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	user := &model.User{
		ID:   r.storage.nextUsererID,
		Name: userData.Name,
		Email: userData.Email,
	}

	r.storage.users[r.storage.nextUsererID] = user

	r.storage.nextUsererID++
	
	return user, nil

}
