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
	START_VOTING = "start"
	STOP_VOTING = "stop"

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
		ID          TaskID  
		PokerID     PokerID 
		Title       string  
		Description string  
		StoryPoint  int     
		Status      string  
		Completed   bool   
		Estimate    string 
	}

	Comment struct {
		ID     CommentID 
		PokerID PokerID  
		UserID UserID 
		Text   string 
	}
	
	UserEstimate struct {
		ID       EstimateID
		PokerID  PokerID
		UserID   UserID
		Estimate Estimate
	}

	Poker struct {
		ID            PokerID
		CreatedAt     time.Time
		Name          string	
		Autor         UserID

	}
		
	AuthData struct {
		UserID UserID
		RefreshToken string
		AccessToken string	
	}	
	
	VoteControlState struct {
		TaskID         	   TaskID    
		PokerID  		   PokerID
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
