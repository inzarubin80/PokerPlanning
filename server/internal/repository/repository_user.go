package repository

import (
	"context"
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

	/*
		r.storage.mx.Lock()
		defer r.storage.mx.Unlock()

		user := &model.User{
			ID:   r.storage.nextUsererID,
			Name: userData.Name,
		}

		r.storage.users[r.storage.nextUsererID] = user
		r.storage.nextUsererID++
		return user, nil
	*/

}

func (r *Repository) SetUserName(ctx context.Context, userID model.UserID, name string) error {

	reposqlsc := sqlc_repository.New(r.conn)
	arg := &sqlc_repository.UpdateUserNameParams{
		Name:   name,
		UserID: int64(userID),
	}
	_, err := reposqlsc.UpdateUserName(ctx, arg)

	return err

	/*
		r.storage.mx.Lock()
		defer r.storage.mx.Unlock()

		user, ok := r.storage.users[userID]
		if !ok {
			return model.ErrorNotFound
		}

		user.Name = name
		return nil
	*/

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

	/*
		r.storage.mx.Lock()
		defer r.storage.mx.Unlock()

		user, ok := r.storage.users[userID]
		if !ok {
			return model.ErrorNotFound
		}

		user.EvaluationStrategy = userSettings.EvaluationStrategy
		user.MaximumScore = userSettings.MaximumScore

		return nil
	*/

}

func (r *Repository) GetUser(ctx context.Context, userID model.UserID) (*model.User, error) {

	reposqlsc := sqlc_repository.New(r.conn)
	user, err := reposqlsc.GetUserByID(ctx, int64(userID))

	if err != nil {
		return nil, err
	}

	return &model.User{
		ID:   model.UserID(user.UserID),
		Name: user.Name,
		//	EvaluationStrategy: *user.EvaluationStrategy,
		//	MaximumScore:       int(*user.MaximumScore),
	}, nil

	/*
		r.storage.mx.Lock()
		defer r.storage.mx.Unlock()

		user, ok := r.storage.users[userID]
		if !ok {
			return nil, model.ErrorNotFound
		}
		return user, nil
	*/

}

func (r *Repository) GetUsersByIDs(ctx context.Context, userIDs []model.UserID) ([]*model.User, error) {

	reposqlsc := sqlc_repository.New(r.conn)
	arg := make([]int64, len(userIDs), len(userIDs))
	for i, value := range userIDs {
		arg[i] = int64(value)
	}

	users, err := reposqlsc.GetUsersByIDs(ctx, arg)
	if err != nil {
		return nil, err
	}

	usersRes := make([]*model.User, len(users))

	for i, value := range users {
		usersRes[i] = &model.User{
			ID:   model.UserID(value.UserID),
			Name: value.Name,
			//EvaluationStrategy: *value.EvaluationStrategy,
			//MaximumScore:       int(*value.MaximumScore),
		}
	}

	return usersRes, nil
	/*
		r.storage.mx.Lock()
		defer r.storage.mx.Unlock()

		users := make([]*model.User, len(userIDs))

		i := 0

		for _, userID := range userIDs {

			user, ok := r.storage.users[userID]

			if !ok {
				return nil, fmt.Errorf("UserID %d %w", userID, model.ErrorNotFound)
			}

			users[i] = user
			i++

		}

		return users, nil
	*/

}
