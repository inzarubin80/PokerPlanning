-- +goose Up
-- +goose StatementBegin
CREATE TABLE poker (
    poker_id UUID PRIMARY KEY,
    name TEXT,
    autor bigint NOT NULL,
    evaluation_strategy TEXT NOT NULL,
    maximum_score INT NOT NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS poker;
-- +goose StatementEnd