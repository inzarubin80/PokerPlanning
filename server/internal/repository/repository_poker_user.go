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
	
	/*
	r.storage.mx.RLock()
	defer r.storage.mx.RUnlock()

	var userIDs []model.UserID

	users, ok := r.storage.pokerUsers[pokerID]

	if !ok {
		return userIDs, nil
	}

	userIDs = make([]model.UserID, len(users))

	i := 0

	for k, _ := range users {

		userIDs[i] = k
		i++

	}

	return userIDs, nil
	*/


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
	/*
	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	users, ok := r.storage.pokerUsers[pokerID]

	if !ok {
		users = make(map[model.UserID]bool, 0)
		r.storage.pokerUsers[pokerID] = users
	}
	r.storage.pokerUsers[pokerID][userID] = true
	return nil
	*/

}
