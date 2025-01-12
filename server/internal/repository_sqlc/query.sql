-- name: CreateUser :one
INSERT INTO users (name)
VALUES ($1)
returning user_id;
