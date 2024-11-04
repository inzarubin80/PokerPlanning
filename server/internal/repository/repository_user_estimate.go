package repository

import (
	"context"
	"inzarubin80/PokerPlanning/internal/model"
)

func (r *Repository) GetUserEstimates(ctx context.Context, pokerID model.PokerID) ([]*model.UserEstimate, error) {

	r.storage.mx.RLock()
	defer r.storage.mx.RUnlock()

	userEstimates := []*model.UserEstimate{}
	userEstimatesRepo, ok := r.storage.userEstimates[pokerID]
	if ok {
		for _, value := range userEstimatesRepo {
			userEstimates = append(userEstimates, value)
		}
	}

	return userEstimates, nil

}

func (r *Repository) GetUserEstimateForUserID(ctx context.Context, pokerID model.PokerID, userID model.UserID) (*model.UserEstimate, error) {

	r.storage.mx.RLock()
	defer r.storage.mx.RUnlock()

	userEstimatesRepo, ok := r.storage.userEstimates[pokerID]
	
	if ok {
		for _, value := range userEstimatesRepo {

			if value.UserID == userID {
				return value, nil
			}

		}
	}

	return nil, model.ErrorNotFound
}

func (r *Repository) ClearUserEstimates(ctx context.Context, pokerID model.PokerID) error {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	_, ok := r.storage.userEstimates[pokerID]
	if !ok {
		return nil
	}

	delete(r.storage.userEstimates, pokerID)
	return nil

}

func (r *Repository) AddUserEstimate(ctx context.Context, pokerID model.PokerID, userEstimate *model.UserEstimate) (model.EstimateID, error) {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	userEstimatesRepo, ok := r.storage.userEstimates[pokerID]
	if !ok {
		userEstimatesRepo = make(map[model.EstimateID]*model.UserEstimate)
	}

	userEstimate.ID = r.storage.nextEstimateID
	userEstimatesRepo[userEstimate.ID] = userEstimate

	r.storage.nextEstimateID++

	return userEstimate.ID, nil

}

func (r *Repository) UpdateUserEstimate(ctx context.Context, pokerID model.PokerID, estimate *model.UserEstimate) (model.EstimateID, error) {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	userEstimatesRepo, ok := r.storage.userEstimates[pokerID]
	if !ok {
		return 0, model.ErrorNotFound
	}

	estimateRepo, ok := userEstimatesRepo[estimate.ID]

	if !ok {
		return 0, model.ErrorNotFound
	}

	estimateRepo.Estimate = estimate.Estimate

	return estimateRepo.ID, nil

}
