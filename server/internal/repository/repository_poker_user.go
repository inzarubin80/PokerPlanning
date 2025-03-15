package repository

import (
	"context"
	"inzarubin80/PokerPlanning/internal/model"
	sqlc_repository "inzarubin80/PokerPlanning/internal/repository_sqlc"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

func (r *Repository) GetUserIDsByPokerID(ctx context.Context, pokerID model.PokerID) ([]model.UserID, error) {
	
	reposqlsc := sqlc_repository.New(r.conn)
	
	pgUUID := pgtype.UUID{
		Bytes: uuid.MustParse(string(pokerID)),
		Valid: true,
	}
	usersSql, err :=reposqlsc.GetUserIDsByPokerID(ctx, pgUUID)

	if err != nil {
		return nil, err
	}

	users:= make([]model.UserID, len(usersSql))
	for i,v := range usersSql {

		users[i] = model.UserID(v.UserID)
	}

	return users, nil
	
}

func (r *Repository) AddPokerUser(ctx context.Context, pokerID model.PokerID, userID model.UserID) error {

	reposqlsc := sqlc_repository.New(r.conn)

	pgUUID := pgtype.UUID{
		Bytes: uuid.MustParse(string(pokerID)),
		Valid: true,
	}
	arg:=  &sqlc_repository.AddPokerUserParams{
		UserID: int64(userID),
		PokerID: pgUUID,
	}
	_,err := reposqlsc.AddPokerUser(ctx, arg)

	return err

}
