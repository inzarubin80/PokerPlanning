// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0

package sqlc_repository

import (
	"context"
)

type Querier interface {
	AddTask(ctx context.Context, arg *AddTaskParams) (*Task, error)
	AddUserAuthProviders(ctx context.Context, arg *AddUserAuthProvidersParams) (*UserAuthProvider, error)
	ClearTasks(ctx context.Context, pokerID string) error
	CreateComent(ctx context.Context, arg *CreateComentParams) (int64, error)
	CreateUser(ctx context.Context, name string) (int64, error)
	DeleteTask(ctx context.Context, arg *DeleteTaskParams) error
	GetComments(ctx context.Context, arg *GetCommentsParams) ([]*Comment, error)
	GetTask(ctx context.Context, arg *GetTaskParams) (*Task, error)
	GetTasks(ctx context.Context, pokerID string) ([]*Task, error)
	GetUserAuthProvidersByProviderUid(ctx context.Context, arg *GetUserAuthProvidersByProviderUidParams) (*UserAuthProvider, error)
	GetUserByID(ctx context.Context, userID int64) (*User, error)
	GetUsersByIDs(ctx context.Context, dollar_1 []int64) ([]*User, error)
	UpdateTask(ctx context.Context, arg *UpdateTaskParams) (*Task, error)
	UpdateUserName(ctx context.Context, arg *UpdateUserNameParams) (*User, error)
	UpsertUserSettings(ctx context.Context, arg *UpsertUserSettingsParams) (*UserSetting, error)
}

var _ Querier = (*Queries)(nil)
