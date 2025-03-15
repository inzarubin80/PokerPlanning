package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"inzarubin80/PokerPlanning/internal/model"
	sqlc_repository "inzarubin80/PokerPlanning/internal/repository_sqlc"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

func (r *Repository) CreatePoker(ctx context.Context, userID model.UserID, pokerSettings *model.PokerSettings) (model.PokerID, error) {

	reposqlsc := sqlc_repository.New(r.conn)

	pgUUID := pgtype.UUID{
		Bytes: uuid.New(),
		Valid: true,
	}

	name := ""
	arg := &sqlc_repository.CreatePokerParams{
		PokerID:            pgUUID,
		Autor:              int64(userID),
		EvaluationStrategy: pokerSettings.EvaluationStrategy,
		MaximumScore:       int32(pokerSettings.MaximumScore),
		Name:               &name,
	}

	poker, err := reposqlsc.CreatePoker(ctx, arg)

	if err != nil {
		return "", nil
	}

	return model.PokerID(poker.PokerID.String()), nil

}

func (r *Repository) AddPokerAdmin(ctx context.Context, pokerID model.PokerID, userID model.UserID) error {

	reposqlc := sqlc_repository.New(r.conn)



	arg := &sqlc_repository.AddPokerAdminParams{
		UserID:  int64(userID),
		PokerID: pokerID.UUID(),
	}

	_, err := reposqlc.AddPokerAdmin(ctx, arg)

	return err

}

func (r *Repository) GetPokerAdmins(ctx context.Context, pokerID model.PokerID) ([]model.UserID, error) {

	reposqlc := sqlc_repository.New(r.conn)


	users, err := reposqlc.GetPokerAdmins(ctx, pokerID.UUID())
	if err != nil {
		return nil, err
	}
	usersRes := make([]model.UserID, len(users))

	for i, _ := range users {
		usersRes[i] = model.UserID(users[i])
	}

	return usersRes, nil


}

func (r *Repository) GetPoker(ctx context.Context, pokerID model.PokerID) (*model.Poker, error) {

	sqlc_repository := sqlc_repository.New(r.conn)


	pokerSql, err := sqlc_repository.GetPoker(ctx, pokerID.UUID())
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, fmt.Errorf("%w: %v", model.ErrorNotFound, err)
		}
		return nil, err
	}

	return &model.Poker{
		Autor:              model.UserID(pokerSql.Autor),
		EvaluationStrategy: pokerSql.EvaluationStrategy,
		MaximumScore:       int(pokerSql.MaximumScore),
		Name:               *pokerSql.Name,
	}, nil

}

func (r *Repository) SetVotingState(ctx context.Context, pokerID model.PokerID, state *model.VoteControlState) (*model.VoteControlState, error) {

	reposqlc := sqlc_repository.New(r.conn)

	startDate := pgtype.Timestamp{
		Time: state.StartDate,
		Valid: true,
	}

	endDate := pgtype.Timestamp{
		Time: state.EndDate,
		Valid: true,
	}



	arg := &sqlc_repository.UpdatePokerTaskAndDatesParams{
		TaskID:    (*int64)(&state.TaskID),
		StartDate: startDate,
		EndDate:   endDate,
		PokerID:   pokerID.UUID(),
	}

	err := reposqlc.UpdatePokerTaskAndDates(ctx, arg)

	if err != nil {
		return nil, err
	}
	return state, nil

}

func (r *Repository) GetVotingState(ctx context.Context, pokerID model.PokerID) (*model.VoteControlState, error) {

	reposqlc := sqlc_repository.New(r.conn)


	getVotingStateRow, err := reposqlc.GetVotingState(ctx, pokerID.UUID())

	if err != nil {
		return nil, err
	}

	return &model.VoteControlState{
		TaskID:    model.TaskID(*getVotingStateRow.TaskID),
		PokerID:   pokerID,
		StartDate: getVotingStateRow.StartDate.Time,
		EndDate:   getVotingStateRow.EndDate.Time,
	}, nil

}
