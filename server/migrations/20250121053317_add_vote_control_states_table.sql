-- +goose Up
CREATE TABLE vote_control_states (
    task_id INT NOT NULL,
    poker_id TEXT NOT NULL  PRIMARY KEY,
    start_date TIMESTAMP NOT NULL,
    duration INTERVAL NOT NULL,
    end_date TIMESTAMP NOT NULL
);

-- +goose Down
DROP TABLE vote_control_states;