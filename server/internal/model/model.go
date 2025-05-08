package model

import (
	"time"
	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

const (
	ADD_TASK                  = "ADD_TASK"
	REMOVE_TASK               = "REMOVE_TASK"
	UPDATE_TASK               = "UPDATE_TASK"
	ADD_COMMENT               = "ADD_COMMENT"
	REMOVE_COMMENT            = "REMOVE_COMMENT"
	UPDATE_COMMENT            = "UPDATE_COMMENT"
	VOTE_STATE_CHANGE         = "VOTE_STATE_CHANGE"
	CHANGE_NUMBER_VOTERS      = "CHANGE_NUMBER_VOTERS"
	Access_Token_Type         = "access_token"
	Refresh_Token_Type        = "refresh_Token"
	ADD_VOTING                = "ADD_VOTING"
	START_VOTING              = "start"
	STOP_VOTING               = "stop"
	END_VOTING                = "end"
	CHANGE_ACTIVE_USERS_POKER = "CHANGE_ACTIVE_USERS_POKER"
	ADD_POKER_USER            = "ADD_POKER_USER"
)

type (
	TaskID     int64
	PokerID    string
	UserID     int64
	Estimate   int64
	CommentID  int64
	EstimateID int64

	UserProfileFromProvider struct {
		ProviderID   string `json:"provider_id"`   // Идентификатор пользователя у провайдера
		Email        string `json:"email"`         // Email пользователя
		Name         string `json:"name"`          // Имя пользователя
		FirstName    string `json:"first_name"`    // Имя
		LastName     string `json:"last_name"`     // Фамилия
		AvatarURL    string `json:"avatar_url"`    // Ссылка на аватар
		ProviderName string `json:"provider_name"` // Название провайдера (например, "google", "github")
	}

	User struct {
		ID                 UserID
		Name               string
		EvaluationStrategy string
		MaximumScore       int
	}

	LastSessionPoker struct {
		PokerID     PokerID
		UserID      UserID
		Name        string
	    IsAdmin     bool
	}

	UserSettings struct {
		UserID             UserID
		EvaluationStrategy string
		MaximumScore       int
	}

	UserAuthProviders struct {
		UserID      UserID
		ProviderUid string
		Provider    string
		Name        string
	}

	Task struct {
		ID          TaskID
		PokerID     PokerID
		Title       string
		Description string
		StoryPoint  int
		Status      string
		Completed   bool
		Estimate    Estimate
	}

	Comment struct {
		ID      CommentID
		TaskID  TaskID
		PokerID PokerID
		UserID  UserID
		Text    string
	}

	VotingResult struct {
		UserEstimates []*UserEstimate
		FinalResult   int
	}

	UserEstimate struct {
		PokerID  PokerID
		UserID   UserID
		TaskID   TaskID
		Estimate Estimate
	}

	UserEstimateClient struct {
		PokerID  PokerID
		UserID   UserID
		Estimate Estimate
	}
	
	PokerSettings struct {
		EvaluationStrategy string
		MaximumScore       int
		Name string
	}


	Poker struct {
		ID                 PokerID
		CreatedAt          time.Time
		Name               string
		Autor              UserID
		ActiveUsersID      []UserID
		Users              []*User
		Admins             []UserID
		EvaluationStrategy string
		MaximumScore       int
	}

	AuthData struct {
		UserID       UserID
		RefreshToken string
		AccessToken  string
	}

	VoteControlState struct {
		TaskID    TaskID
		PokerID   PokerID
		StartDate time.Time
		EndDate   time.Time
	}

	Claims struct {
		UserID    UserID `json:"user_id"`
		TokenType string `json:"token_type"` // Добавляем поле для типа токена
		jwt.StandardClaims
	}


	
)

func (p PokerID) UUID() pgtype.UUID {
	return pgtype.UUID{
		Bytes: uuid.MustParse(string(p)),
		Valid: true,
	}
}
