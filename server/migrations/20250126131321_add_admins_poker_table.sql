-- +goose Up
CREATE TABLE poker_admins (
    user_id BIGINT NOT NULL,
    poker_id UUID NOT NULL,
    PRIMARY KEY (user_id, poker_id)
);

-- +goose Down
DROP TABLE IF EXISTS poker_admins;