package service

import (
	"context"
	authinterface "inzarubin80/PokerPlanning/internal/app/authinterface"
	"inzarubin80/PokerPlanning/internal/model"
)

type (
	TASK_MESSAGE struct {
		Action string
		Task   *model.Task
		TaskID model.TaskID
	}

	VOTE_STATE_CHANGE_MESSAGE struct {
		Action string
		State  *model.VoteControlState
	}

	USER_ESTIMATE_MESSAGE struct {
		Action       string
		VotingResult *model.VotingResult
	}

	ADD_POKER_USER_MESSAGE struct {
		Action string
		Users  []*model.User
	}

	COMMENT_MESSAGE struct {
		Action    string
		Comment   *model.Comment
		CommentID model.CommentID
	}

	PokerService struct {
		repository          Repository
		hub                 Hub
		accessTokenService  TokenService
		refreshTokenService TokenService
		providersUserData   authinterface.ProvidersUserData
	}

	Repository interface {

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

	TokenService interface {
		GenerateToken(userID model.UserID) (string, error)
		ValidateToken(tokenString string) (*model.Claims, error)
	}

	ProviderUserData interface {
		GetUserData(ctx context.Context, authorizationCode string) (*model.UserProfileFromProvider, error)
	}

	Hub interface {
		AddMessage(pokerID model.PokerID, payload any) error
		AddMessageForUser(pokerID model.PokerID, userID model.UserID, payload any) error
		GetActiveUsersID(pokerID model.PokerID) ([]model.UserID, error)
	}
)

func NewPokerService(repository Repository, hub Hub, accessTokenService TokenService, refreshTokenService TokenService, providersUserData authinterface.ProvidersUserData) *PokerService {
	return &PokerService{
		repository:          repository,
		hub:                 hub,
		accessTokenService:  accessTokenService,
		refreshTokenService: refreshTokenService,
		providersUserData:   providersUserData,
	}
}
