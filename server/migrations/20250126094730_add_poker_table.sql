-- +goose Up
-- +goose StatementBegin
CREATE TABLE poker (
    poker_id UUID PRIMARY KEY,
    name TEXT,
    autor bigint NOT NULL,
    evaluation_strategy TEXT NOT NULL,
    maximum_score INT NOT NULL,
    task_id BIGINT,
    start_date TIMESTAMP,
    end_date TIMESTAMP 


);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS poker;
-- +goose StatementEnd