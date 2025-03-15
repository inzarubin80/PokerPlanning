package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"inzarubin80/PokerPlanning/internal/model"
	sqlc_repository "inzarubin80/PokerPlanning/internal/repository_sqlc"
	"sort"
)

func (r *Repository) ClearTasks(ctx context.Context, pokerID model.PokerID) error {
	
	reposqlsc := sqlc_repository.New(r.conn)

	return reposqlsc.ClearTasks(ctx, pokerID.UUID())
}

func (r *Repository) GetTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) (*model.Task, error) {

	reposqlsc := sqlc_repository.New(r.conn)


	arg := &sqlc_repository.GetTaskParams{
		PokerID: pokerID.UUID(),
		TasksID: int64(taskID),
	} 

	task, err := reposqlsc.GetTask(ctx, arg)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
            return nil, fmt.Errorf("%w: %v", model.ErrorNotFound, err)
        }
		return nil, err
	}

	return &model.Task{
		ID: model.TaskID(task.TasksID),
		PokerID: model.PokerID(task.PokerID.String()),
		Title: task.Title,
		Description: *task.Description,
		StoryPoint: int(*task.StoryPoint),
		Status: task.Status,
		Completed: task.Completed,
		Estimate: model.Estimate(*task.Estimate),
	}, nil

	
}

func (r *Repository) DeleteTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) error {

	reposqlsc := sqlc_repository.New(r.conn)
	
	arg := &sqlc_repository.DeleteTaskParams{
		PokerID: pokerID.UUID(),
		TasksID: int64(taskID),
	} 

	return reposqlsc.DeleteTask(ctx, arg)

}

func (r *Repository) GetTasks(ctx context.Context, pokerID model.PokerID) ([]*model.Task, error) {

	reposqlsc := sqlc_repository.New(r.conn)
	
	
	
	tasks, err := reposqlsc.GetTasks(ctx, pokerID.UUID())
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
            return nil, fmt.Errorf("%w: %v", model.ErrorNotFound, err)
        }
		return nil, err
	}	
	tasksRes:= make([]*model.Task, len(tasks))

	for i,v:= range tasks {
		tasksRes[i] = &model.Task{
			ID: model.TaskID(v.TasksID),
			PokerID: model.PokerID(v.PokerID.String()),
			Title: v.Title,
			Description: *v.Description,
			StoryPoint: int(*v.StoryPoint),
			Status: v.Status,
			Completed: v.Completed,
			Estimate: model.Estimate(*v.Estimate),
		}
	}

	sort.Slice(tasksRes, func(i, j int) bool {
		return tasksRes[i].ID < tasksRes[j].ID
	})

	return tasksRes, nil

}

func (r *Repository) AddTask(ctx context.Context, task *model.Task) (*model.Task, error) {

	reposqlsc := sqlc_repository.New(r.conn)
	storyPoint := int32(task.StoryPoint)
	estimate := int32(task.Estimate)



	arg := &sqlc_repository.AddTaskParams{
		PokerID: task.PokerID.UUID(),
		Title: task.Title,
		Description: &task.Description,
		StoryPoint: &storyPoint,
		Status: task.Status,
		Completed: task.Completed,
		Estimate: &estimate,
	}

	taskSqlc, err := reposqlsc.AddTask(ctx, arg)

	if err != nil {
		return nil, err
	}

	return &model.Task{
		ID: model.TaskID(taskSqlc.TasksID),
		PokerID: model.PokerID(taskSqlc.PokerID.String()),
		Title: taskSqlc.Title,
		Description: *taskSqlc.Description,
		StoryPoint: int(*taskSqlc.StoryPoint),
		Status: taskSqlc.Status,
		Completed: taskSqlc.Completed,
		Estimate: model.Estimate(*taskSqlc.Estimate),

	}, nil
}

func (r *Repository) UpdateTask(ctx context.Context, pokerID model.PokerID, task *model.Task) (*model.Task, error) {

	reposqlsc := sqlc_repository.New(r.conn)
	storyPoint := int32(task.StoryPoint)
	estimate := int32(task.Estimate)

	
	arg := &sqlc_repository.UpdateTaskParams{
		TasksID: int64(task.ID),
		PokerID: pokerID.UUID(),
		Title: task.Title,
		Description: &task.Description,
		StoryPoint: &storyPoint,
		Status: task.Status,
		Completed: task.Completed,
		Estimate: &estimate,
	}

	taskSqlc, err := reposqlsc.UpdateTask(ctx, arg)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
            return nil, fmt.Errorf("%w: %v", model.ErrorNotFound, err)
        }
		return nil, err
	}	
	return &model.Task{
		ID: model.TaskID(taskSqlc.TasksID),
		PokerID: model.PokerID(taskSqlc.PokerID.String()),
		Title: taskSqlc.Title,
		Description: *taskSqlc.Description,
		StoryPoint: int(*taskSqlc.StoryPoint),
		Status: taskSqlc.Status,
		Completed: taskSqlc.Completed,
		Estimate: model.Estimate(*taskSqlc.Estimate),

	}, nil

}
