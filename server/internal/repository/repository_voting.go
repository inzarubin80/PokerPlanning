package repository

import (
	"context"
	"inzarubin80/PokerPlanning/internal/model"
)

func (r *Repository) SetVoting(ctx context.Context, userEstimate *model.UserEstimate) error {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	_, ok := r.storage.voting[userEstimate.PokerID]
	if !ok {
		r.storage.voting[userEstimate.PokerID] = make(map[model.UserID]model.Estimate)
	}
	r.storage.voting[userEstimate.PokerID][userEstimate.UserID] = userEstimate.Estimate
	return nil

}


func (r *Repository) ClearVote(ctx context.Context, pokerID model.PokerID) error {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	_, ok := r.storage.voting[pokerID]
	
	if ok {
		delete(r.storage.voting, pokerID)
	}

	return nil

}



func (r *Repository) GetUserEstimate(ctx context.Context, pokerID model.PokerID, userID model.UserID) (model.Estimate, error) {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	_, ok := r.storage.voting[pokerID]
	if !ok {
		return model.Estimate(0), nil
	}

	value, ok := r.storage.voting[pokerID][userID]
	if !ok {
		return model.Estimate(0), nil
	}
	return value, nil

}

func (r *Repository) GetVotingResults(ctx context.Context, pokerID model.PokerID) ([]*model.UserEstimate, error) {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	results:= make([]*model.UserEstimate, 0)

	usersVoting, ok := r.storage.voting[pokerID]
	if !ok {
		return results, nil
	}
	
	for v,k:= range usersVoting {
		results = append(results, &model.UserEstimate{
			ID: -1,
			PokerID: pokerID,
			UserID: v,
			Estimate: k,
		})
	}
	
	return results, nil

}






