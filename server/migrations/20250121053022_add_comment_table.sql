-- +goose Up
CREATE TABLE comments (
    comment_id BIGSERIAL PRIMARY KEY,
    poker_id UUID NOT NULL,
    user_id bigint NOT NULL,
    task_id bigint NOT NULL,
    text TEXT NOT NULL
);
-- Add an index on the poker_id column
CREATE INDEX idx_comments_poker_id ON tasks(poker_id);

-- +goose Down
DROP INDEX idx_comments_poker_id;
DROP TABLE comments;