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
		Title       string
		Description string
		StoryPoint  int
		Status      string
	}

	Comment struct {
		ID     CommentID
		UserID UserID
		Text   string
	}

	UserEstimate struct {
		ID       EstimateID
		UserID   UserID
		TaskID   TaskID
		Estimate Estimate
	}

	BaseDataPoker struct {
		ID            PokerID
		TargetTaskID  TaskID
		Start         time.Time
		End           time.Time
		FinalEstimate Estimate
	}

	Poker struct {
		BaseDataPoker *BaseDataPoker
		Tasks         []*Task
		Estimates     []*UserEstimate
		Participants  []UserID
		Comments      []*Comment
	}
)
