package repository

import (
	"context"
	"inzarubin80/PokerPlanning/internal/model"
	sqlc_repository "inzarubin80/PokerPlanning/internal/repository_sqlc"
)

func (r *Repository) SetVoting(ctx context.Context, userEstimate *model.UserEstimate) error {

	reposqlsc := sqlc_repository.New(r.conn)

	addVotingParams := &sqlc_repository.AddVotingParams{
		PokerID: userEstimate.PokerID.UUID(),
		TaskID: int64(userEstimate.TaskID),
		UserID: int64(userEstimate.UserID),
		Estimate: int32(userEstimate.Estimate),
	}
	_, err := reposqlsc.AddVoting(ctx, addVotingParams)
	return err
}

func (r *Repository) ClearVote(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) error {

	reposqlsc := sqlc_repository.New(r.conn)

	arg := &sqlc_repository.ClearVoteParams{
		PokerID: pokerID.UUID(),
		TaskID: int64(taskID),
	} 

	return reposqlsc.ClearVote(ctx, arg)
}

func (r *Repository)  RemoveVote(ctx context.Context, pokerID model.PokerID, taskID model.TaskID, userID model.UserID) error  {

	reposqlsc := sqlc_repository.New(r.conn)

	arg := &sqlc_repository.RemoveVoteParams{
		PokerID: pokerID.UUID(),
		TaskID: int64(taskID),
		UserID: int64(userID),
	} 

	return reposqlsc.RemoveVote(ctx, arg)
}

func (r *Repository) GetUserEstimate(ctx context.Context, pokerID model.PokerID, taskID model.TaskID, userID model.UserID) (model.Estimate, error) {

	reposqlsc := sqlc_repository.New(r.conn)

	arg := &sqlc_repository.GetUserEstimateParams{
		PokerID: pokerID.UUID(),
		TaskID: int64(taskID),
		UserID: int64(userID),
	}

	res, err := reposqlsc.GetUserEstimate(ctx, arg)
	if err != nil {
		return 0, err
	}

	return model.Estimate(res), nil
}

func (r *Repository) GetVotingResults(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) ([]*model.UserEstimate, error) {

	reposqlsc := sqlc_repository.New(r.conn)

	arg := &sqlc_repository.GetVotingResultsParams{
		PokerID: pokerID.UUID(),
		TaskID: int64(taskID),	
	}

	res, err := reposqlsc.GetVotingResults(ctx, arg)

	if err!= nil {
		return nil, err
	}

	userEstimates := make([]*model.UserEstimate, len(res))
	
	for i, item := range res {
		userEstimates[i] = &model.UserEstimate{
			PokerID: pokerID,
			UserID: model.UserID(item.UserID),
			TaskID: taskID,
			Estimate: model.Estimate(item.Estimate),
		}
	}

	return userEstimates, nil

}
