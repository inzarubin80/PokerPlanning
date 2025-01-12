package repository

import (
	"context"
	"fmt"
	"inzarubin80/PokerPlanning/internal/model"
	"sort"
)

func (r *Repository) ClearTasks(ctx context.Context, pokerID model.PokerID) error {
	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	_, ok := r.storage.tasks[pokerID]
	if !ok {
		return nil
	}
	delete(r.storage.tasks, pokerID)

	return nil
}

func (r *Repository) GetTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) (*model.Task, error) {

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
}

func (r *Repository) DeleteTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) error {

	r.storage.mx.RLock()
	defer r.storage.mx.RUnlock()
	tasksRepo, ok := r.storage.tasks[pokerID]
	if !ok {
		return nil
	}

	delete(tasksRepo, taskID)
	return nil
}

func (r *Repository) GetTasks(ctx context.Context, pokerID model.PokerID) ([]*model.Task, error) {

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
}

func (r *Repository) AddTask(ctx context.Context, task *model.Task) (*model.Task, error) {

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
}

func (r *Repository) UpdateTask(ctx context.Context, pokerID model.PokerID, task *model.Task) (*model.Task, error) {

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
}
