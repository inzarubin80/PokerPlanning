// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: query.sql

package sqlc_repository

import (
	"context"
)

const addUserAuthProviders = `-- name: AddUserAuthProviders :one
INSERT INTO user_auth_providers (user_id, provider_uid, provider, name)
VALUES ($1, $2, $3, $4)
returning user_id, provider_uid, provider, name
`

type AddUserAuthProvidersParams struct {
	UserID      int64
	ProviderUid string
	Provider    string
	Name        *string
}

func (q *Queries) AddUserAuthProviders(ctx context.Context, arg *AddUserAuthProvidersParams) (*UserAuthProvider, error) {
	row := q.db.QueryRow(ctx, addUserAuthProviders,
		arg.UserID,
		arg.ProviderUid,
		arg.Provider,
		arg.Name,
	)
	var i UserAuthProvider
	err := row.Scan(
		&i.UserID,
		&i.ProviderUid,
		&i.Provider,
		&i.Name,
	)
	return &i, err
}

const createComent = `-- name: CreateComent :one
INSERT INTO comments (poker_id, user_id, task_id, text)
VALUES ($1, $2, $3, $4) 
RETURNING comment_id
`

type CreateComentParams struct {
	PokerID string
	UserID  int64
	TaskID  int64
	Text    string
}

func (q *Queries) CreateComent(ctx context.Context, arg *CreateComentParams) (int64, error) {
	row := q.db.QueryRow(ctx, createComent,
		arg.PokerID,
		arg.UserID,
		arg.TaskID,
		arg.Text,
	)
	var comment_id int64
	err := row.Scan(&comment_id)
	return comment_id, err
}

const createUser = `-- name: CreateUser :one
INSERT INTO users (name)
VALUES ($1)
returning user_id
`

func (q *Queries) CreateUser(ctx context.Context, name string) (int64, error) {
	row := q.db.QueryRow(ctx, createUser, name)
	var user_id int64
	err := row.Scan(&user_id)
	return user_id, err
}

const getComments = `-- name: GetComments :many
SELECT comment_id, poker_id, user_id, task_id, text FROM comments
WHERE poker_id = $1 AND task_id = $2
`

type GetCommentsParams struct {
	PokerID string
	TaskID  int64
}

func (q *Queries) GetComments(ctx context.Context, arg *GetCommentsParams) ([]*Comment, error) {
	rows, err := q.db.Query(ctx, getComments, arg.PokerID, arg.TaskID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []*Comment
	for rows.Next() {
		var i Comment
		if err := rows.Scan(
			&i.CommentID,
			&i.PokerID,
			&i.UserID,
			&i.TaskID,
			&i.Text,
		); err != nil {
			return nil, err
		}
		items = append(items, &i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getUserAuthProvidersByProviderUid = `-- name: GetUserAuthProvidersByProviderUid :one
SELECT user_id, provider_uid, provider, name FROM user_auth_providers
WHERE provider_uid = $1 AND provider = $2
`

type GetUserAuthProvidersByProviderUidParams struct {
	ProviderUid string
	Provider    string
}

func (q *Queries) GetUserAuthProvidersByProviderUid(ctx context.Context, arg *GetUserAuthProvidersByProviderUidParams) (*UserAuthProvider, error) {
	row := q.db.QueryRow(ctx, getUserAuthProvidersByProviderUid, arg.ProviderUid, arg.Provider)
	var i UserAuthProvider
	err := row.Scan(
		&i.UserID,
		&i.ProviderUid,
		&i.Provider,
		&i.Name,
	)
	return &i, err
}

const getUserByID = `-- name: GetUserByID :one
SELECT user_id, name, evaluation_strategy, maximum_score FROM users
WHERE user_id = $1
`

func (q *Queries) GetUserByID(ctx context.Context, userID int64) (*User, error) {
	row := q.db.QueryRow(ctx, getUserByID, userID)
	var i User
	err := row.Scan(
		&i.UserID,
		&i.Name,
		&i.EvaluationStrategy,
		&i.MaximumScore,
	)
	return &i, err
}

const getUsersByIDs = `-- name: GetUsersByIDs :many
SELECT user_id, name, evaluation_strategy, maximum_score FROM users
WHERE user_id = ANY($1::bigint[])
`

func (q *Queries) GetUsersByIDs(ctx context.Context, dollar_1 []int64) ([]*User, error) {
	rows, err := q.db.Query(ctx, getUsersByIDs, dollar_1)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []*User
	for rows.Next() {
		var i User
		if err := rows.Scan(
			&i.UserID,
			&i.Name,
			&i.EvaluationStrategy,
			&i.MaximumScore,
		); err != nil {
			return nil, err
		}
		items = append(items, &i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateUserName = `-- name: UpdateUserName :one
UPDATE users
SET name = $1
WHERE user_id = $2
RETURNING user_id, name, evaluation_strategy, maximum_score
`

type UpdateUserNameParams struct {
	Name   string
	UserID int64
}

func (q *Queries) UpdateUserName(ctx context.Context, arg *UpdateUserNameParams) (*User, error) {
	row := q.db.QueryRow(ctx, updateUserName, arg.Name, arg.UserID)
	var i User
	err := row.Scan(
		&i.UserID,
		&i.Name,
		&i.EvaluationStrategy,
		&i.MaximumScore,
	)
	return &i, err
}

const upsertUserSettings = `-- name: UpsertUserSettings :one
INSERT INTO user_settings (user_id, evaluation_strategy, maximum_score)
VALUES ($1, $2, $3)
ON CONFLICT (user_id)
DO UPDATE SET
    user_id = EXCLUDED.user_id,
    evaluation_strategy = EXCLUDED.evaluation_strategy,
    maximum_score = EXCLUDED.maximum_score
RETURNING user_id, evaluation_strategy, maximum_score
`

type UpsertUserSettingsParams struct {
	UserID             int64
	EvaluationStrategy string
	MaximumScore       int32
}

func (q *Queries) UpsertUserSettings(ctx context.Context, arg *UpsertUserSettingsParams) (*UserSetting, error) {
	row := q.db.QueryRow(ctx, upsertUserSettings, arg.UserID, arg.EvaluationStrategy, arg.MaximumScore)
	var i UserSetting
	err := row.Scan(&i.UserID, &i.EvaluationStrategy, &i.MaximumScore)
	return &i, err
}
