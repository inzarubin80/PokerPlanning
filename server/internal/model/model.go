package model

import "time"

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
		ID          TaskID
		PokerID     PokerID
		Title       string
		Description string
		StoryPoint  int
		Status      string
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
