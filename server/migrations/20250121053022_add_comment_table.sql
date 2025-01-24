-- +goose Up
CREATE TABLE comments (
    comment_id BIGSERIAL PRIMARY KEY,
    poker_id TEXT NOT NULL,
    user_id bigint NOT NULL,
    task_id bigint NOT NULL,
    text TEXT NOT NULL
);

-- +goose Down
DROP TABLE comments;