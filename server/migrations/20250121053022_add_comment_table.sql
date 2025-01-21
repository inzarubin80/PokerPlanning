-- +goose Up
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    poker_id TEXT NOT NULL,
    user_id INT NOT NULL,
    text TEXT NOT NULL
);

-- +goose Down
DROP TABLE comments;