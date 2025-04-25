package repository

import (
	"context"
	"inzarubin80/PokerPlanning/internal/model"
	sqlc_repository "inzarubin80/PokerPlanning/internal/repository_sqlc"
)

func (r *Repository) GetUserIDsByPokerID(ctx context.Context, pokerID model.PokerID) ([]model.UserID, error) {
	
	reposqlsc := sqlc_repository.New(r.conn)
	
	
	usersSql, err :=reposqlsc.GetUserIDsByPokerID(ctx, pokerID.UUID())

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

	arg:=  &sqlc_repository.AddPokerUserParams{
		UserID: int64(userID),
		PokerID: pokerID.UUID(),
	}
	_,err := reposqlsc.AddPokerUser(ctx, arg)

	return err

}
