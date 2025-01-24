-- name: CreateUser :one
INSERT INTO users (name)
VALUES ($1)
returning user_id;
-- name: UpdateUserName :one
UPDATE users
SET name = $1
WHERE user_id = $2
RETURNING *;
-- name: UpsertUserSettings :one
INSERT INTO user_settings (user_id, evaluation_strategy, maximum_score)
VALUES ($1, $2, $3)
ON CONFLICT (user_id)
DO UPDATE SET
    user_id = EXCLUDED.user_id,
    evaluation_strategy = EXCLUDED.evaluation_strategy,
    maximum_score = EXCLUDED.maximum_score
RETURNING *;
-- name: GetUsersByIDs :many
SELECT * FROM users
WHERE user_id = ANY($1::bigint[]);
-- name: GetUserByID :one
SELECT * FROM users
WHERE user_id = $1;
-- name: GetUserAuthProvidersByProviderUid :one
SELECT * FROM user_auth_providers
WHERE provider_uid = $1 AND provider = $2;
-- name: AddUserAuthProviders :one
INSERT INTO user_auth_providers (user_id, provider_uid, provider, name)
VALUES ($1, $2, $3, $4)
returning *;
-- name: GetComments :many
SELECT * FROM comments
WHERE poker_id = $1 AND task_id = $2;
-- name: CreateComent :one
INSERT INTO comments (poker_id, user_id, task_id, text)
VALUES ($1, $2, $3, $4) 
RETURNING comment_id;