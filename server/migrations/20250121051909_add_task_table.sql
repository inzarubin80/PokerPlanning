-- +goose Up
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    poker_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    story_point INT,
    status TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    estimate INT
);

-- +goose Down
DROP TABLE tasks;