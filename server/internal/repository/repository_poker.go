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
		PokerID: pgUUID,
		Autor: int64(userID),
		EvaluationStrategy: pokerSettings.EvaluationStrategy,
		MaximumScore: int32(pokerSettings.MaximumScore),
		Name: &name,
	}

	poker, err := reposqlsc.CreatePoker(ctx, arg)

	if err != nil {
		return "", nil
	}

	return model.PokerID(poker.PokerID.String()), nil

	/*
	uid := model.PokerID(uuid.New().String())
	baseDataPoker := &model.Poker{
		ID:                 uid,
		CreatedAt:          time.Now(),
		Autor:              userID,
		EvaluationStrategy: pokerSettings.EvaluationStrategy,
		MaximumScore:       pokerSettings.MaximumScore,
	}
	r.storage.pokers[model.PokerID(uid)] = baseDataPoker
	return uid, nil
	*/

}

func (r *Repository) AddPokerAdmin(ctx context.Context, pokerID model.PokerID, userID model.UserID) error {

	reposqlc := sqlc_repository.New(r.conn)

	pgUUID := pgtype.UUID{
		Bytes: uuid.MustParse(string(pokerID)),
		Valid: true,
	}
	
	arg := &sqlc_repository.AddPokerAdminParams{
		UserID: int64(userID),
		PokerID: pgUUID,
	}

	_, err:= reposqlc.AddPokerAdmin(ctx, arg)

	return err
	
	/*
	admins, ok := r.storage.pokerAdmins[pokerID]
	if !ok {
		admins = make(map[model.UserID]bool)
	}
	admins[userID] = true
	r.storage.pokerAdmins[pokerID] = admins
	return nil
    */
}

func (r *Repository) GetPokerAdmins(ctx context.Context, pokerID model.PokerID) ([]model.UserID, error) {


	reposqlc := sqlc_repository.New(r.conn)

	pgUUID := pgtype.UUID{
		Bytes: uuid.MustParse(string(pokerID)),
		Valid: true,
	}
	
	
	users, err:= reposqlc.GetPokerAdmins(ctx, pgUUID)


	usersRes := make([]model.UserID, len(users))
	
	
	for i,_ := range users {
		usersRes[i] = model.UserID(users[i])
	}
	
	return nil, err
	

	/*
	admins, ok := r.storage.pokerAdmins[pokerID]
	if !ok {
		return nil, model.ErrorNotFound
	}
	admisRes := make([]model.UserID, len(admins))
	i := 0
	for k, _ := range admins {
		admisRes[i] = k
		i++
	}
	return admisRes, nil
    */

}

func (r *Repository) GetPoker(ctx context.Context, pokerID model.PokerID) (*model.Poker, error) {


	sqlc_repository := sqlc_repository.New(r.conn)

	pgUUID := pgtype.UUID{
		Bytes: uuid.MustParse(string(pokerID)),
		Valid: true,
	}

	pokerSql, err := sqlc_repository.GetPoker(ctx, pgUUID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
            return nil, fmt.Errorf("%w: %v", model.ErrorNotFound, err)
        }
		return nil, err
	}

	return &model.Poker{
		Autor: model.UserID(pokerSql.Autor),
		EvaluationStrategy: pokerSql.EvaluationStrategy,
		MaximumScore: int(pokerSql.MaximumScore),
		Name: *pokerSql.Name,
	}, nil

	/*
	basedata, ok := r.storage.pokers[pokerID]
	if !ok {
		return nil, model.ErrorNotFound
	}
	return basedata, nil
    */
}
