package repository

import (
	"inzarubin80/PokerPlanning/internal/model"
	"sync"
)

type (
	Repository struct {
		storage Storage
	}

	Users         map[model.UserID]*model.User
	Tasks         map[model.PokerID]map[model.TaskID]*model.Task
	Comments      map[model.PokerID]map[model.CommentID]*model.Comment
	UserEstimates map[model.PokerID]map[model.EstimateID]*model.UserEstimate
	Pokers        map[model.PokerID]*model.Poker
	Participants  map[model.PokerID]map[model.UserID]bool
	VoteState   map[model.PokerID]*model.VoteControlState
	Voting        map[model.PokerID]map[model.UserID] model.Estimate

	Storage struct {
		mx             *sync.RWMutex
		users          Users
		tasks          Tasks
		comments       Comments
		userEstimates  UserEstimates
		pokers         Pokers
		participants   Participants
		nextCommentID  model.CommentID
		nextEstimateID model.EstimateID
		nextTaskID     model.TaskID
		nextUsererID     model.UserID
		voteState       VoteState
		voting Voting
	}
)

func NewPokerRepository(capacity int) *Repository {
	return &Repository{
		storage: Storage{
			mx:             &sync.RWMutex{},
			users:          make(Users, capacity),
			tasks:          make(Tasks, capacity),
			comments:       make(Comments, capacity),
			userEstimates:  make(UserEstimates, capacity),
			pokers:         make(Pokers, capacity),
			participants:   make(Participants),
			voteState:    	make(VoteState),
			voting: 		make(Voting),
			nextCommentID:  1,
			nextEstimateID: 1,
			nextTaskID:     1,
			nextUsererID:   1,
		},
	}
}
