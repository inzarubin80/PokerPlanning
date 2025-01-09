package repository

import (
	"context"
	"fmt"
	"inzarubin80/PokerPlanning/internal/model"
	"time"
)

func (r *Repository) DeleteVotingState(ctx context.Context, pokerID model.PokerID) error {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	delete(r.storage.voteState, pokerID)
	return nil

}

func (r *Repository) SetVotingTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) (*model.VoteControlState, error) {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	_, ok := r.storage.voteState[pokerID]

	if !ok {
		r.storage.voteState[pokerID] = &model.VoteControlState{}
	}
	r.storage.voteState[pokerID].StartDate =  time.Time{} 
	r.storage.voteState[pokerID].EndDate =  time.Time{} 
	
	r.storage.voteState[pokerID].TaskID = taskID
	return r.storage.voteState[pokerID], nil

}

func (r *Repository) SetVotingState(ctx context.Context, pokerID model.PokerID, state *model.VoteControlState) (*model.VoteControlState, error) {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	_, ok := r.storage.voteState[pokerID]

	if !ok {
		return nil, fmt.Errorf("pokerID state %s %w",pokerID,model.ErrorNotFound)
	}
	r.storage.voteState[pokerID] = state
	return r.storage.voteState[pokerID], nil

}

func (r *Repository) GetVotingState(ctx context.Context, pokerID model.PokerID) (*model.VoteControlState, error) {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	state, ok := r.storage.voteState[pokerID]
	if !ok {
		state = &model.VoteControlState{}
	}

	return state, nil

}
