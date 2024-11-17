package repository

import (
	"context"
	"inzarubin80/PokerPlanning/internal/model"
	"time"

	"github.com/google/uuid"
)

func (r *Repository) CreatePoker(ctx context.Context, userID model.UserID) (model.PokerID, error) {

	uid := model.PokerID(uuid.New().String())

	baseDataPoker := &model.Poker{
		ID:         uid,
		Start:      time.Now(),
	}
	r.storage.pokers[model.PokerID(uid)] = baseDataPoker
	return uid, nil

}

func (r *Repository) GetPoker(ctx context.Context, pokerID model.PokerID) (*model.Poker, error) {

	basedata, ok := r.storage.pokers[pokerID]
	if !ok {
		return nil, model.ErrorNotFound
	}
	return basedata, nil

}

