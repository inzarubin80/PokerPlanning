-- +goose Up
CREATE TABLE voting (
    user_id BIGINT NOT NULL,
    poker_id UUID NOT NULL,
    task_id BIGINT NOT NULL,
    estimate INT NOT NULL,
    PRIMARY KEY (user_id, poker_id, task_id)
);

-- +goose Down
DROP TABLE IF EXISTS voting;