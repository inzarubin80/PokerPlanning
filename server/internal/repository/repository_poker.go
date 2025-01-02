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
		CreatedAt:  time.Now(),
		Autor:      userID,
	}
	r.storage.pokers[model.PokerID(uid)] = baseDataPoker
	return uid, nil
}

func (r *Repository) AddPokerAdmin(ctx context.Context, pokerID model.PokerID, userID model.UserID) (error) {

	 admins, ok :=r.storage.pokerAdmins[pokerID]
	 if !ok {
		admins = make(map[model.UserID] bool)
	 }
	 admins[userID] = true
	 r.storage.pokerAdmins[pokerID] = admins
	 return nil

}


func (r *Repository) GetPokerAdmins(ctx context.Context, pokerID model.PokerID) ([] model.UserID, error) {

	admins, ok :=r.storage.pokerAdmins[pokerID]
	if !ok {
	   return nil, model.ErrorNotFound
	}

	admisRes := make([]model.UserID, len(admins))
	i:=0
	for k,_ := range admins {
		admisRes[i]=k
		i++
	}
	
	return admisRes, nil

}





func (r *Repository) GetPoker(ctx context.Context, pokerID model.PokerID) (*model.Poker, error) {

	basedata, ok := r.storage.pokers[pokerID]
	if !ok {
		return nil, model.ErrorNotFound
	}
	return basedata, nil

}

