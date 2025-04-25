package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"inzarubin80/PokerPlanning/internal/model"
	sqlc_repository "inzarubin80/PokerPlanning/internal/repository_sqlc"
)

func (r *Repository) CreateUser(ctx context.Context, userData *model.UserProfileFromProvider) (*model.User, error) {

	reposqlsc := sqlc_repository.New(r.conn)
	userID, err := reposqlsc.CreateUser(ctx, userData.Name)

	if err != nil {
			return nil, err
	}

	return &model.User{
		ID:   model.UserID(userID),
		Name: userData.Name,
	}, nil
}

func (r *Repository) SetUserName(ctx context.Context, userID model.UserID, name string) error {

	reposqlsc := sqlc_repository.New(r.conn)
	arg := &sqlc_repository.UpdateUserNameParams{
		Name:   name,
		UserID: int64(userID),
	}
	_, err := reposqlsc.UpdateUserName(ctx, arg)

	return err

}

func (r *Repository) SetUserSettings(ctx context.Context, userID model.UserID, userSettings *model.UserSettings) error {

	arg := &sqlc_repository.UpsertUserSettingsParams{
		UserID:             int64(userID),
		EvaluationStrategy: userSettings.EvaluationStrategy,
		MaximumScore:       int32(userSettings.MaximumScore),
	}

	reposqlsc := sqlc_repository.New(r.conn)
	_, err := reposqlsc.UpsertUserSettings(ctx, arg)
	return err

}

func (r *Repository) GetUser(ctx context.Context, userID model.UserID) (*model.User, error) {

	reposqlsc := sqlc_repository.New(r.conn)
	user, err := reposqlsc.GetUserByID(ctx, int64(userID))

		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				return nil, fmt.Errorf("%w: %v", model.ErrorNotFound, err)
			}
			return nil, err
		}
	

	return &model.User{
		ID:   model.UserID(user.UserID),
		Name: user.Name,

	}, nil


}

func (r *Repository) GetUsersByIDs(ctx context.Context, userIDs []model.UserID) ([]*model.User, error) {

	reposqlsc := sqlc_repository.New(r.conn)
	arg := make([]int64, len(userIDs), len(userIDs))
	for i, value := range userIDs {
		arg[i] = int64(value)
	}

	users, err := reposqlsc.GetUsersByIDs(ctx, arg)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, fmt.Errorf("%w: %v", model.ErrorNotFound, err)
		}
		return nil, err
	}
	
	usersRes := make([]*model.User, len(users))

	for i, value := range users {
		usersRes[i] = &model.User{
			ID:   model.UserID(value.UserID),
			Name: value.Name,
		}
	}

	return usersRes, nil

}
