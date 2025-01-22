-- name: CreateUser :one
INSERT INTO users (name)
VALUES ($1)
returning user_id;
-- name: UpdateUserName :one
UPDATE users
SET name = $1
WHERE user_id = $2
RETURNING *;
-- name: UpdateUserSettings :one
UPDATE user_settings
SET evaluation_strategy = $1, maximum_score = $2
WHERE user_id = $3
RETURNING *;
-- name: CreateUserSettings :one
INSERT INTO user_settings (user_id, evaluation_strategy, maximum_score)
VALUES ($1, $2, $3)
RETURNING *;
-- name: GetUsersByIDs :many
SELECT * FROM users
WHERE user_id = ANY($1::bigint[]);
-- name: GetUserByID :one
SELECT * FROM users
WHERE user_id = $1;