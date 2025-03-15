package storage

import (
	"context"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"inzarubin80/PokerPlanning/internal/model"
)

type DB interface {
	Exec(context.Context, string, ...interface{}) (pgconn.CommandTag, error)
	Query(context.Context, string, ...interface{}) (pgx.Rows, error)
	QueryRow(context.Context, string, ...interface{}) pgx.Row
	BeginTx(ctx context.Context, txOptions pgx.TxOptions) (pgx.Tx, error)
}

type Repository interface {

	//Poker
	CreatePoker(ctx context.Context, userID model.UserID, pokerSettings *model.PokerSettings) (model.PokerID, error)
	AddPokerAdmin(ctx context.Context, pokerID model.PokerID, userID model.UserID) error
	GetPokerAdmins(ctx context.Context, pokerID model.PokerID) ([]model.UserID, error)

	//Task
	AddTask(ctx context.Context, task *model.Task) (*model.Task, error)
	GetTasks(ctx context.Context, pokerID model.PokerID) ([]*model.Task, error)
	GetTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) (*model.Task, error)
	UpdateTask(ctx context.Context, pokerID model.PokerID, task *model.Task) (*model.Task, error)
	DeleteTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) error

	//Comment
	CreateComent(ctx context.Context, comment *model.Comment) (*model.Comment, error)
	GetComments(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) ([]*model.Comment, error)


	//TargetTask
	//SetVotingTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) (*model.VoteControlState, error)
	GetVotingState(ctx context.Context, pokerID model.PokerID) (*model.VoteControlState, error)

	GetPoker(ctx context.Context, pokerID model.PokerID) (*model.Poker, error)

	//User
	GetUserAuthProvidersByProviderUid(ctx context.Context, ProviderUid string, Provider string) (*model.UserAuthProviders, error)
	AddUserAuthProviders(ctx context.Context, userProfileFromProvide *model.UserProfileFromProvider, userID model.UserID) (*model.UserAuthProviders, error)
	CreateUser(ctx context.Context, userData *model.UserProfileFromProvider) (*model.User, error)
	GetUsersByIDs(ctx context.Context, userIDs []model.UserID) ([]*model.User, error)
	GetUserIDsByPokerID(ctx context.Context, pokerID model.PokerID) ([]model.UserID, error)
	AddPokerUser(ctx context.Context, pokerID model.PokerID, userID model.UserID) error
	SetUserName(ctx context.Context, userID model.UserID, name string) error
	GetUser(ctx context.Context, userID model.UserID) (*model.User, error)
	SetUserSettings(ctx context.Context, userID model.UserID, userSettings *model.UserSettings) error

	//Voting
	SetVoting(ctx context.Context, userEstimate *model.UserEstimate) error
	ClearVote(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) error
	GetVotingResults(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) ([]*model.UserEstimate, error)
	GetUserEstimate(ctx context.Context, pokerID model.PokerID, taskID model.TaskID, userID model.UserID) (model.Estimate, error)
	SetVotingState(ctx context.Context, pokerID model.PokerID, state *model.VoteControlState) (*model.VoteControlState, error)
}

type Adapters struct {
	Repository Repository
}

type TransactionProvider interface {
	Transact(ctx context.Context, txFunc func(adapters Adapters) error) error
}
