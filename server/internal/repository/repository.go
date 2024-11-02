package repository

import (
	"context"
	"fmt"
	"inzarubin80/PokerPlanning/internal/model"
	"sync"
	"time"

	"github.com/google/uuid"
)

type (
	Repository struct {
		storage Storage
	}

	BaseDataPoker struct {
		ID            model.PokerID
		TargetTask    *model.Task
		Start         time.Time
		End           time.Time
		FinalEstimate model.Estimate
	}

	Users         map[model.UserID]*model.User
	Tasks         map[model.PokerID]map[model.TaskID]*model.Task
	Comments      map[model.PokerID]map[model.CommentID]*model.Comment
	UserEstimates map[model.PokerID]map[model.EstimateID]*model.UserEstimate
	Pokers        map[model.PokerID]*BaseDataPoker
	Participants  map[model.PokerID]map[model.UserID]bool

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
			nextCommentID:  1,
			nextEstimateID: 1,
			nextTaskID:     1,
		},
	}

}

func (s *Storage) CreatePoker(ctx context.Context, userID model.UserID) (model.PokerID, error) {

	uid := model.PokerID(uuid.New().String())

	baseDataPoker := &BaseDataPoker{
		ID:         uid,
		TargetTask: nil,
		Start:      time.Now(),
	}

	s.pokers[model.PokerID(uid)] = baseDataPoker
	return uid, nil

}

func (s *Storage) GetComments(ctx context.Context, userID model.UserID, pokerID model.PokerID) ([]*model.Comment, error) {

	comments := []*model.Comment{}
	commentsRepo, ok := s.comments[pokerID]
	if ok {
		for _, value := range commentsRepo {
			comments = append(comments, value)
		}
	}
	return comments, nil

}

func (s *Storage) GetTasks(ctx context.Context, userID model.UserID, pokerID model.PokerID) ([]*model.Task, error) {

	tasks := []*model.Task{}
	tasksRepo, ok := s.tasks[pokerID]
	if ok {
		for _, value := range tasksRepo {
			tasks = append(tasks, value)
		}
	}
	return tasks, nil
}

func (s *Storage) GetUserEstimate(ctx context.Context, userID model.UserID, pokerID model.PokerID) ([]*model.UserEstimate, error) {

	userEstimates := []*model.UserEstimate{}
	userEstimatesRepo, ok := s.userEstimates[pokerID]
	if ok {
		for _, value := range userEstimatesRepo {
			userEstimates = append(userEstimates, value)
		}
	}

	return userEstimates, nil

}

func (s *Storage) GetPoker(ctx context.Context, userID model.UserID, pokerID model.PokerID) (*model.Poker, error) {

	basedata, ok := s.pokers[pokerID]
	if !ok {
		return nil, model.ErrorPockerNotFound
	}

	tasks, err := s.GetTasks(ctx, userID, pokerID)
	if err != nil {
		return nil, err
	}

	comments, err := s.GetComments(ctx, userID, pokerID)
	if err != nil {
		return nil, err
	}

	userEstimates, err := s.GetUserEstimate(ctx, userID, pokerID)
	if err != nil {
		return nil, err
	}

	participants := []model.UserID{}
	participantsRepo, ok := s.participants[pokerID]
	if ok {
		for key, _ := range participantsRepo {
			participants = append(participants, key)
		}
	}

	return &model.Poker{
		ID:            pokerID,
		Tasks:         tasks,
		Start:         basedata.Start,
		TargetTask:    basedata.TargetTask,
		End:           basedata.End,
		FinalEstimate: basedata.FinalEstimate,
		Comments:      comments,
		Estimates:     userEstimates,
		Participants:  participants,
	}, nil

}
