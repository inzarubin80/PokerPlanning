-- +goose Up
CREATE TABLE tasks (
    tasks_id BIGSERIAL PRIMARY KEY,
    poker_id UUID NOT NULL,
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
