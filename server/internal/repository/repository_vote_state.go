package repository

import (
	"context"
	"inzarubin80/PokerPlanning/internal/model"
)

func (r *Repository) DeleteVotingState(ctx context.Context, pokerID model.PokerID) error {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	delete(r.storage.voteState, pokerID)
	return nil

}

func (r *Repository) SetVotingTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) (*model.VoteState, error) {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	_, ok := r.storage.voteState[pokerID]

	if !ok {
		r.storage.voteState[pokerID] = &model.VoteState{}
	}
	r.storage.voteState[pokerID].TaskID = taskID
	return r.storage.voteState[pokerID], nil

}

func (r *Repository) GetVotingState(ctx context.Context, pokerID model.PokerID) (*model.VoteState, error) {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	state, ok := r.storage.voteState[pokerID]
	if !ok {
		state = &model.VoteState{}
	}
	
	return state, nil

}
