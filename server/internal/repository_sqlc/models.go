// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0

package sqlc_repository

import (
	"github.com/jackc/pgx/v5/pgtype"
)

type Comment struct {
	CommentID int64
	PokerID   pgtype.UUID
	UserID    int64
	TaskID    int64
	Text      string
}

type Poker struct {
	PokerID            pgtype.UUID
	Name               *string
	Autor              int64
	EvaluationStrategy string
	MaximumScore       int32
	TaskID             *int64
	StartDate          pgtype.Timestamp
	EndDate            pgtype.Timestamp
}

type PokerAdmin struct {
	UserID  int64
	PokerID pgtype.UUID
}

type PokerUser struct {
	UserID   int64
	PokerID  pgtype.UUID
	LastDate pgtype.Timestamptz
}

type Task struct {
	TasksID     int64
	PokerID     pgtype.UUID
	Title       string
	Description *string
	StoryPoint  *int32
	Status      string
	Completed   bool
	Estimate    *int32
}

type User struct {
	UserID             int64
	Name               string
	EvaluationStrategy *string
	MaximumScore       *int32
}

type UserAuthProvider struct {
	UserID      int64
	ProviderUid string
	Provider    string
	Name        *string
}

type UserSetting struct {
	UserID             int64
	EvaluationStrategy string
	MaximumScore       int32
}

type Voting struct {
	UserID   int64
	PokerID  pgtype.UUID
	TaskID   int64
	Estimate int32
}
