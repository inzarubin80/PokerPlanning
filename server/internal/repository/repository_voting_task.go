package repository

import (
	"context"
	"inzarubin80/PokerPlanning/internal/model"
)


func (r *Repository) DeleteVotingTask(ctx context.Context, pokerID model.PokerID) error {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	delete(r.storage.votingTasks, pokerID)
	return nil

}

func (r *Repository) AddVotingTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) error {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	r.storage.votingTasks[pokerID] = taskID
	return nil

}

func (r *Repository) GetVotingTask(ctx context.Context, pokerID model.PokerID) (model.TaskID, error) {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	taskID, ok := r.storage.votingTasks[pokerID]
	if !ok {
		return 0, nil
	}
	return taskID, nil
	
}
