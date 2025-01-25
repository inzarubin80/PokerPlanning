-- +goose Up
CREATE TABLE tasks (
    tasks_id BIGSERIAL PRIMARY KEY,
    poker_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    story_point INT,
    status TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    estimate INT
);

-- Add an index on the poker_id column
CREATE INDEX idx_tasks_poker_id ON tasks(poker_id);

-- +goose Down
DROP INDEX idx_tasks_poker_id;
DROP TABLE tasks;

-- name: ClearTasks :exec
DELETE FROM tasks WHERE poker_id = $1;

-- name: GetTask :one
SELECT * FROM tasks WHERE poker_id = $1 AND tasks_id = $2;

-- name: DeleteTask :exec
DELETE FROM tasks WHERE poker_id = $1 AND tasks_id = $2;

-- name: GetTasks :many
SELECT * FROM tasks WHERE poker_id = $1 ORDER BY tasks_id;

-- name: AddTask :one
INSERT INTO tasks (poker_id, title, description, story_point, status, completed, estimate)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;

-- name: UpdateTask :one
UPDATE tasks
SET
    title = $3,
    description = $4,
    story_point = $5,
    status = $6,
    completed = $7,
    estimate = $8
WHERE poker_id = $1 AND tasks_id = $2
RETURNING *;
s