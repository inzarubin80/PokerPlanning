package repository

import (
	"context"
	"inzarubin80/PokerPlanning/internal/model"
)

func (r *Repository) RemoveTargetTask(ctx context.Context, pokerID model.PokerID) error {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	/*
	poker, ok := r.storage.pokers[pokerID]

	if !ok {
		return model.ErrorNotFound
	}

	poker.TargetTaskID = 0

	return nil
*/
	return nil

}

func (r *Repository) AddTargetTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) error {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	//poker, ok := r.storage.pokers[pokerID]

	//if !ok {
	//	return model.ErrorNotFound
	//}

	//poker.TargetTaskID = taskID

	return nil

}


func (r *Repository) ClearTargetTask(ctx context.Context, pokerID model.PokerID) error {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	/*
	poker, ok := r.storage.pokers[pokerID]

	if !ok {
		return model.ErrorNotFound
	}

	poker.TargetTaskID = 0
	*/
	return nil

}


func (r *Repository) GetTargetTask(ctx context.Context, pokerID model.PokerID) (model.TaskID, error) {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	/*
	poker, ok := r.storage.pokers[pokerID]

	if !ok {
		return 0, model.ErrorNotFound
	}

	return poker.TargetTaskID, nil
	*/
	return 0, nil
}
