-- +goose Up
CREATE TABLE user_settings (
    user_id BIGINT PRIMARY KEY NOT NULL,
    evaluation_strategy TEXT NOT NULL,
    maximum_score INT NOT NULL
);

-- +goose Down
DROP TABLE user_settings;