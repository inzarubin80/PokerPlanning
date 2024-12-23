package model

import (
	"time"

	"github.com/golang-jwt/jwt"
)

const (
	ADD_TASK  = "ADD_TASK"
	REMOVE_TASK = "REMOVE_TASK"
	UPDATE_TASK = "UPDATE_TASK"
	ADD_COMMENT  = "ADD_COMMENT"
	REMOVE_COMMENT = "REMOVE_COMMENT"
	UPDATE_COMMENT = "UPDATE_COMMENT"
	VOTE_STATE_CHANGE  = "VOTE_STATE_CHANGE"
	CHANGE_NUMBER_VOTERS  = "CHANGE_NUMBER_VOTERS"
	Access_Token_Type = "access_token"
	Refresh_Token_Type = "refresh_Token"
	ADD_VOTING = "ADD_VOTING"

)

type (
	TaskID     int64
	PokerID    string
	UserID     int64
	Estimate   string
	CommentID  int64
	EstimateID int64

	UserData struct {
		Name string
		Email string		
	}

	User struct {
		ID   UserID
		Name string
		Email string		
	}

	Task struct {
		ID          TaskID  `json:"id"`
		PokerID     PokerID `json:"poker_id"`
		Title       string  `json:"title"`
		Description string  `json:"description"`
		StoryPoint  int     `json:"story_point"` 
		Status      string  `json:"status"` 
		Completed   bool    `json:"completed"`
		Estimate    string  `json:"estimate"`
	}

	Comment struct {
		ID     CommentID `json:"id"`
		PokerID PokerID  `json:"poker_id"`
		UserID UserID `json:"user_id"`
		Text   string `json:"text"`
	}
	
	UserEstimate struct {
		ID       EstimateID
		PokerID  PokerID
		UserID   UserID
		Estimate Estimate
	}

	Poker struct {
		ID            PokerID
		Task  		  Task
		Start         time.Time
		End           time.Time
		FinalEstimate Estimate
	}
		
	AuthData struct {
		UserID UserID
		RefreshToken string
		AccessToken string	
	}	

	VoteState struct {
		TaskID         	   TaskID   
		StartDate          time.Time 
		Duration           time.Duration 
		EndDate            time.Time
	}

	Claims struct {
		UserID    UserID `json:"user_id"`
		TokenType string `json:"token_type"` // Добавляем поле для типа токена
		jwt.StandardClaims
	}
	
)
