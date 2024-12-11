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
		AddVotingTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) error
		GetVotingTask(ctx context.Context, pokerID model.PokerID) (model.TaskID, error)
		
		GetParticipants(ctx context.Context, pokerID model.PokerID) ([]model.UserID, error)
		GetPoker(ctx context.Context, pokerID model.PokerID) (*model.Poker, error)

		//User
		GetUserByEmail(ctx context.Context, email string) (*model.User, error)
		AddUser(ctx context.Context, userData *model.UserData) (*model.User, error) 
	}

	TokenService interface {
		GenerateToken(userID model.UserID) (string, error)
		ValidateToken(tokenString string) (*model.Claims, error) 
	}

	ProviderUserData interface {
		GetUserData(ctx context.Context, authorizationCode string) (*model.UserData, error)
	}


	Hub interface {
		AddMessage(pokerID model.PokerID,  data []byte) 
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

func (s *PokerService) GetPoker(ctx context.Context, pokerID model.PokerID) (*model.Poker, error) {	
	poker, err := s.repository.GetPoker(ctx, pokerID)
	if err != nil {
		return nil, model.ErrorNotFound
	}	
	return poker, nil
}


func (s *PokerService) CreatePoker(ctx context.Context, userID model.UserID) (model.PokerID, error) {
	return s.repository.CreatePoker(ctx, userID)
}


