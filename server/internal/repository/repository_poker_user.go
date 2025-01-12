package repository

import (
	"context"
	"inzarubin80/PokerPlanning/internal/model"
)

func (r *Repository) GetUserIDsByPokerID(ctx context.Context, pokerID model.PokerID) ([]model.UserID, error) {

	r.storage.mx.RLock()
	defer r.storage.mx.RUnlock()

	var userIDs []model.UserID

	users, ok := r.storage.pokerUsers[pokerID]

	if !ok {
		return userIDs, nil
	}

	userIDs = make([]model.UserID, len(users))

	i := 0

	for k, _ := range users {

		userIDs[i] = k
		i++

	}

	return userIDs, nil
}

func (r *Repository) AddPokerUser(ctx context.Context, pokerID model.PokerID, userID model.UserID) error {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	users, ok := r.storage.pokerUsers[pokerID]

	if !ok {
		users = make(map[model.UserID]bool, 0)
		r.storage.pokerUsers[pokerID] = users
	}

	r.storage.pokerUsers[pokerID][userID] = true
	return nil

}
