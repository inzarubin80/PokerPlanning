-- +goose Up
-- +goose StatementBegin
CREATE TABLE user_auth_providers (
    user_id BIGINT NOT NULL,
    provider_uid VARCHAR(255) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    name VARCHAR(255),
    -- Составной первичный ключ
    PRIMARY KEY (provider_uid, provider)
);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS user_auth_providers;
-- +goose StatementEnd