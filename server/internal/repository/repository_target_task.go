package repository

import (
	"context"
	"inzarubin80/PokerPlanning/internal/model"
)


func (r *Repository) DeleteTargetTask(ctx context.Context, pokerID model.PokerID) error {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	delete(r.storage.targetTasks, pokerID)
	return nil

}

func (r *Repository) AddTargetTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) error {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	r.storage.targetTasks[pokerID] = taskID
	return nil

}

func (r *Repository) GetTargetTask(ctx context.Context, pokerID model.PokerID) (model.TaskID, error) {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	taskID, ok := r.storage.targetTasks[pokerID]
	if !ok {
		return 0, nil
	}
	return taskID, nil
	
}
