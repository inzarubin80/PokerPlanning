package repository

import (
	"context"
	"inzarubin80/PokerPlanning/internal/model"
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

func (r *Repository) GetTask(ctx context.Context, pokerID model.PokerID) ([]*model.Task, error) {
	
	r.storage.mx.RLock()
	defer r.storage.mx.RUnlock()

	tasks := []*model.Task{}
	tasksRepo, ok := r.storage.tasks[pokerID]
	if ok {
		for _, value := range tasksRepo {
			tasks = append(tasks, value)
		}
	}
	return tasks, nil
}


func (r *Repository) GetTasks(ctx context.Context, pokerID model.PokerID) ([]*model.Task, error) {

	tasks := []*model.Task{}
	tasksRepo, ok := r.storage.tasks[pokerID]
	if ok {
		for _, value := range tasksRepo {
			tasks = append(tasks, value)
		}
	}
	return tasks, nil
}

func (r *Repository) AddTask(ctx context.Context,  task *model.Task) (model.TaskID, error) {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	taskRepo, ok := r.storage.tasks[task.PokerID]
	if !ok {
		taskRepo = make(map[model.TaskID]*model.Task)
	}
	task.ID = r.storage.nextTaskID
	taskRepo[r.storage.nextTaskID] = task

	r.storage.nextTaskID++

	return task.ID, nil
}

func (r *Repository) UpdateTask(ctx context.Context, pokerID model.PokerID, task *model.Task) error {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	taskRepo, ok := r.storage.tasks[pokerID]
	if !ok {
		return model.ErrorNotFound
	}
	_, ok = taskRepo[task.ID]
	if !ok {
		return model.ErrorNotFound
	}
	taskRepo[task.ID] = task
	return nil
}

