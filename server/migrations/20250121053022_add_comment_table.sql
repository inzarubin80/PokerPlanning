-- +goose Up
CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    poker_id TEXT NOT NULL,
    user_id INT NOT NULL,
    text TEXT NOT NULL
);

-- +goose Down
DROP TABLE comments;