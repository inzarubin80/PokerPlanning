package service

import (
	"context"
	"inzarubin80/PokerPlanning/internal/model"
	authinterface "inzarubin80/PokerPlanning/internal/app/authinterface"
)

type (
	PokerService struct {
		repository Repository
		hub Hub
		accessTokenService TokenService
		refreshTokenService TokenService
		providersUserData authinterface.ProvidersUserData
	}

	Repository interface {
		
		//Poker
		CreatePoker(ctx context.Context, userID model.UserID) (model.PokerID, error)
		AddPokerAdmin(ctx context.Context, pokerID model.PokerID, userID model.UserID) (error)
		GetPokerAdmins(ctx context.Context, pokerID model.PokerID) ([] model.UserID, error)

		//Task
		AddTask(ctx context.Context,  task *model.Task) (*model.Task, error)
		GetTasks(ctx context.Context, pokerID model.PokerID) ([]*model.Task, error)
		GetTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID ) (*model.Task, error)
		UpdateTask(ctx context.Context, pokerID model.PokerID, task *model.Task) (*model.Task, error) 
		DeleteTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID ) (error) 

		//Comment
		AddComment(ctx context.Context, comment *model.Comment) (*model.Comment, error) 
		GetComment(ctx context.Context, pokerID model.PokerID, commentID model.CommentID) (*model.Comment, error)
		GetComments(ctx context.Context, pokerID model.PokerID) ([]*model.Comment, error) 
		UpdateComment(ctx context.Context, comment *model.Comment) (*model.Comment, error) 
		RemoveComment(ctx context.Context, pokerID model.PokerID, commentID model.CommentID) error
		
		//TargetTask		
		SetVotingTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) (*model.VoteControlState, error) 
		GetVotingState(ctx context.Context, pokerID model.PokerID) (*model.VoteControlState, error) 
		
		GetParticipants(ctx context.Context, pokerID model.PokerID) ([]model.UserID, error)
		GetPoker(ctx context.Context, pokerID model.PokerID) (*model.Poker, error)

		//User
		GetUserByEmail(ctx context.Context, email string) (*model.User, error)
		AddUser(ctx context.Context, userData *model.UserData) (*model.User, error) 
		GetUsersByIDs(ctx context.Context, userIDs []model.UserID) ([]*model.User, error)
		GetUserIDsByPokerID(ctx context.Context, pokerID model.PokerID) ([] model.UserID, error) 
		AddPokerUser(ctx context.Context, pokerID model.PokerID, userID model.UserID) (error)

		//Voting
		SetVoting(ctx context.Context, userEstimate *model.UserEstimate) error 
		ClearVote(ctx context.Context, pokerID model.PokerID) error
		GetVotingResults(ctx context.Context, pokerID model.PokerID) ([]*model.UserEstimate, error) 
		GetUserEstimate(ctx context.Context, pokerID model.PokerID, userID model.UserID) (model.Estimate, error)
		SetVotingState(ctx context.Context, pokerID model.PokerID, state *model.VoteControlState) (*model.VoteControlState, error)
		
	}

	TokenService interface {
		GenerateToken(userID model.UserID) (string, error)
		ValidateToken(tokenString string) (*model.Claims, error) 
	}

	ProviderUserData interface {
		GetUserData(ctx context.Context, authorizationCode string) (*model.UserData, error)
	}

	Hub interface {
		AddMessage(pokerID model.PokerID,  payload any)  error
		AddMessageForUser(pokerID model.PokerID, userID model.UserID, payload any) (error) 
		GetActiveUsersID(pokerID model.PokerID) ([] model.UserID, error) 
	}
)


func NewPokerService(repository Repository, hub Hub, accessTokenService TokenService, refreshTokenService TokenService, providersUserData authinterface.ProvidersUserData) *PokerService {
	
	return &PokerService{
		repository: repository,
		hub: hub,
		accessTokenService: accessTokenService,
		refreshTokenService: refreshTokenService,
		providersUserData: providersUserData,
	}

}



