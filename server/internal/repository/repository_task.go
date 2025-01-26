package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"inzarubin80/PokerPlanning/internal/model"
	sqlc_repository "inzarubin80/PokerPlanning/internal/repository_sqlc"
	"sort"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

func (r *Repository) ClearTasks(ctx context.Context, pokerID model.PokerID) error {
	
	reposqlsc := sqlc_repository.New(r.conn)

	pgUUID := pgtype.UUID{
		Bytes: uuid.MustParse(string(pokerID)),
		Valid: true,
	}

	return reposqlsc.ClearTasks(ctx, pgUUID)

	/*
	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()
	_, ok := r.storage.tasks[pokerID]
	if !ok {
		return nil
	}
	delete(r.storage.tasks, pokerID)
	return nil
	*/

}

func (r *Repository) GetTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) (*model.Task, error) {

	reposqlsc := sqlc_repository.New(r.conn)

	pgUUID := pgtype.UUID{
		Bytes: uuid.MustParse(string(pokerID)),
		Valid: true,
	}

	arg := &sqlc_repository.GetTaskParams{
		PokerID: pgUUID,
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

	/*
	r.storage.mx.RLock()
	defer r.storage.mx.RUnlock()

	tasksRepo, ok := r.storage.tasks[pokerID]
	if !ok {
		return nil, fmt.Errorf("poker %s %w", pokerID, model.ErrorNotFound)
	}

	task, ok := tasksRepo[taskID]
	if !ok {
		return nil, fmt.Errorf("task %d %w", taskID, model.ErrorNotFound)
	}
	return task, nil
     */
}

func (r *Repository) DeleteTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) error {

	reposqlsc := sqlc_repository.New(r.conn)
	
	pgUUID := pgtype.UUID{
		Bytes: uuid.MustParse(string(pokerID)),
		Valid: true,
	}

	arg := &sqlc_repository.DeleteTaskParams{
		PokerID: pgUUID,
		TasksID: int64(taskID),
	} 

	return reposqlsc.DeleteTask(ctx, arg)
	
	/*
	r.storage.mx.RLock()
	defer r.storage.mx.RUnlock()
	tasksRepo, ok := r.storage.tasks[pokerID]
	if !ok {
		return nil
	}

	delete(tasksRepo, taskID)
	return nil
    */

}

func (r *Repository) GetTasks(ctx context.Context, pokerID model.PokerID) ([]*model.Task, error) {

	reposqlsc := sqlc_repository.New(r.conn)
	
	pgUUID := pgtype.UUID{
		Bytes: uuid.MustParse(string(pokerID)),
		Valid: true,
	}
	
	
	tasks, err := reposqlsc.GetTasks(ctx, pgUUID)
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

	/*
	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	tasks := []*model.Task{}
	tasksRepo, ok := r.storage.tasks[pokerID]
	if ok {
		for _, value := range tasksRepo {
			tasks = append(tasks, value)
		}
	}

	sort.Slice(tasks, func(i, j int) bool {
		return tasks[i].ID < tasks[j].ID
	})

	return tasks, nil
	*/
}

func (r *Repository) AddTask(ctx context.Context, task *model.Task) (*model.Task, error) {

	reposqlsc := sqlc_repository.New(r.conn)
	storyPoint := int32(task.StoryPoint)
	estimate := int32(task.Estimate)

	pgUUID := pgtype.UUID{
		Bytes: uuid.MustParse(string(task.PokerID)),
		Valid: true,
	}

	arg := &sqlc_repository.AddTaskParams{
		PokerID: pgUUID,
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

	/*
	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	taskRepo, ok := r.storage.tasks[task.PokerID]
	if !ok {
		taskRepo = make(map[model.TaskID]*model.Task)
		r.storage.tasks[task.PokerID] = taskRepo
	}

	task.ID = r.storage.nextTaskID
	taskRepo[r.storage.nextTaskID] = task
	r.storage.nextTaskID++

	return task, nil
    */

}

func (r *Repository) UpdateTask(ctx context.Context, pokerID model.PokerID, task *model.Task) (*model.Task, error) {

	reposqlsc := sqlc_repository.New(r.conn)
	storyPoint := int32(task.StoryPoint)
	estimate := int32(task.Estimate)

	pgUUID := pgtype.UUID{
		Bytes: uuid.MustParse(string(pokerID)),
		Valid: true,
	}
	
	arg := &sqlc_repository.UpdateTaskParams{
		TasksID: int64(task.ID),
		PokerID: pgUUID,
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

	/*
	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	taskRepo, ok := r.storage.tasks[pokerID]
	if !ok {
		return nil, fmt.Errorf("poker %s %w", pokerID, model.ErrorNotFound)
	}
	_, ok = taskRepo[task.ID]
	if !ok {
		return nil, fmt.Errorf("task %d %w", task.ID, model.ErrorNotFound)
	}
	taskRepo[task.ID] = task
	return task, nil
    */

}
