package model

import "time"

const (
	ADD_TASK  = "ADD_TASK"
	REMOVE_TASK = "REMOVE_TASK"
	UPDATE_TASK = "REMOVE_TASK"
)

type (
	TaskID     int64
	PokerID    string
	UserID     string
	Estimate   int
	CommentID  int64
	EstimateID int64

	User struct {
		ID   UserID
		Name string
	}

	Task struct {
		ID          TaskID  `json:"id"`
		PokerID     PokerID `json:"poker_id"`
		Title       string  `json:"title"`
		Description string  `json:"description"`
		StoryPoint  int     `json:"story_point"` 
		Status      string  `json:"status"` 
		Completed   bool    `json:"completed"`
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
		TaskID   TaskID
		Estimate Estimate
	}

	Poker struct {
		ID            PokerID
		Task  		  Task
		Start         time.Time
		End           time.Time
		FinalEstimate Estimate
	}
)
