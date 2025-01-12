package repository

import (
	"context"
	"inzarubin80/PokerPlanning/internal/model"
)

func (r *Repository) ClearParticipants(ctx context.Context, pokerID model.PokerID) error {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	_, ok := r.storage.participants[pokerID]
	if !ok {
		return nil
	}
	delete(r.storage.participants, pokerID)
	return nil
}

func (r *Repository) GetParticipants(ctx context.Context, pokerID model.PokerID) ([]model.UserID, error) {

	r.storage.mx.RLock()
	defer r.storage.mx.RUnlock()

	participants := []model.UserID{}
	participantsRepo, ok := r.storage.participants[pokerID]
	if ok {
		for key, value := range participantsRepo {

			if value {
				participants = append(participants, key)
			}
		}
	}

	return participants, nil

}

func (r *Repository) AddParticipants(ctx context.Context, pokerID model.PokerID, userID model.UserID) error {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	participantsRepo, ok := r.storage.participants[pokerID]
	if !ok {
		participantsRepo = make(map[model.UserID]bool)
		r.storage.participants[pokerID] = participantsRepo
	}

	participantsRepo[userID] = true
	return nil

}

func (r *Repository) RemoveParticipant(ctx context.Context, pokerID model.PokerID, userID model.UserID) error {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	participantsRepo, ok := r.storage.participants[pokerID]
	if !ok {
		return nil
	}

	delete(participantsRepo, userID)

	return nil

}
