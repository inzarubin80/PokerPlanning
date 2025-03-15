package repository

import (
	"context"
	"inzarubin80/PokerPlanning/internal/model"
	sqlc_repository "inzarubin80/PokerPlanning/internal/repository_sqlc"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

func (r *Repository) SetVoting(ctx context.Context, userEstimate *model.UserEstimate) error {

	reposqlsc := sqlc_repository.New(r.conn)

	pgUUID := pgtype.UUID{
		Bytes: uuid.MustParse(string(userEstimate.PokerID)),
		Valid: true,
	}

	addVotingParams := &sqlc_repository.AddVotingParams{
		PokerID: pgUUID,
		TaskID: int64(userEstimate.UserID),
		UserID: int64(userEstimate.UserID),
		Estimate: int32(userEstimate.Estimate),
	}
	_, err := reposqlsc.AddVoting(ctx, addVotingParams)
	return err
}

func (r *Repository) ClearVote(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) error {

	reposqlsc := sqlc_repository.New(r.conn)
	pgUUID := pgtype.UUID{
		Bytes: uuid.MustParse(string(pokerID)),
		Valid: true,
	}

	arg := &sqlc_repository.ClearVoteParams{
		PokerID: pgUUID,
		TaskID: int64(taskID),
	} 

	return reposqlsc.ClearVote(ctx, arg)
}

func (r *Repository) GetUserEstimate(ctx context.Context, pokerID model.PokerID, taskID model.TaskID, userID model.UserID) (model.Estimate, error) {

	reposqlsc := sqlc_repository.New(r.conn)
	pgUUID := pgtype.UUID{
		Bytes: uuid.MustParse(string(pokerID)),
		Valid: true,
	}

	arg := &sqlc_repository.GetUserEstimateParams{
		PokerID: pgUUID,
		TaskID: int64(taskID),
	}

	res, err := reposqlsc.GetUserEstimate(ctx, arg)
	if err != nil {
		return 0, err
	}

	return model.Estimate(res.Estimate), nil
}

func (r *Repository) GetVotingResults(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) ([]*model.UserEstimate, error) {


	return nil, nil
	
	/*
	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	results := make([]*model.UserEstimate, 0)

	usersVoting, ok := r.storage.voting[pokerID]
	if !ok {
		return results, nil
	}

	for v, k := range usersVoting {
		results = append(results, &model.UserEstimate{
			PokerID:  pokerID,
			UserID:   v,
			Estimate: k,
		})
	}
	
	return results, nil
	*/

}
