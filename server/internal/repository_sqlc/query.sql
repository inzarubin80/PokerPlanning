-- name: CreateUser :one
INSERT INTO users (name)
VALUES ($1)
returning user_id;
-- name: SetUserName :one
UPDATE users
SET name = $1
WHERE user_id = $2;
-- name: SetUserSettings :one
UPDATE users
SET evaluation_strategy = $1, maximum_score = $2
WHERE user_id = $3;