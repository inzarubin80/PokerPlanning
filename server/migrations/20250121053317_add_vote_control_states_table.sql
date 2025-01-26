-- +goose Up
CREATE TABLE vote_control_states (
    task_id BIGINT NOT NULL,
    poker_id UUID NOT NULL  PRIMARY KEY,
    start_date TIMESTAMP NOT NULL,
    duration INTERVAL NOT NULL,
    end_date TIMESTAMP NOT NULL
);

-- Add an index on the poker_id column
CREATE INDEX idx_vote_control_states_poker_id ON tasks(poker_id);

-- +goose Down
DROP INDEX idx_vote_control_states_poker_id;
DROP TABLE vote_control_states;