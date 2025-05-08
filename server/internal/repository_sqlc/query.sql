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

-- name: ClearTasks :exec
DELETE FROM tasks WHERE poker_id = $1;

-- name: GetTask :one
SELECT * FROM tasks WHERE poker_id = $1 AND tasks_id = $2;

-- name: DeleteTask :exec
DELETE FROM tasks WHERE poker_id = $1 AND tasks_id = $2;

-- name: GetTasks :many
SELECT * FROM tasks WHERE poker_id = $1 ORDER BY tasks_id;

-- name: AddTask :one
INSERT INTO tasks (poker_id, title, description, story_point, status, completed, estimate)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;

-- name: UpdateTask :one
UPDATE tasks
SET
    title = $3,
    description = $4,
    story_point = $5,
    status = $6,
    completed = $7,
    estimate = $8
WHERE poker_id = $1 AND tasks_id = $2
RETURNING *;

-- name: AddPokerUser :one
INSERT INTO poker_users (user_id, poker_id, last_date)
VALUES ($1, $2, CURRENT_TIMESTAMP)
ON CONFLICT (user_id, poker_id)
DO UPDATE SET
    user_id = EXCLUDED.user_id,
    poker_id = EXCLUDED.poker_id,
    last_date = CURRENT_TIMESTAMP
RETURNING *;

-- name: GetUserIDsByPokerID :many
SELECT * FROM poker_users
WHERE poker_id = $1;

-- name: CreatePoker :one
INSERT INTO poker (poker_id, autor, evaluation_strategy, maximum_score, name, task_id)
VALUES ($1, $2, $3, $4, $5, 0)  
RETURNING *;

-- name: GetPoker :one
SELECT * FROM poker WHERE poker_id = $1;

-- name: AddPokerAdmin :one
INSERT INTO poker_admins (user_id, poker_id)
VALUES ($1, $2)
ON CONFLICT (user_id, poker_id)
DO UPDATE SET
    user_id = EXCLUDED.user_id,
    poker_id = EXCLUDED.poker_id
RETURNING *;

-- name: GetPokerAdmins :many
SELECT user_id FROM poker_admins
WHERE poker_id = $1;

-- name: UpdatePokerTaskAndDates :exec
UPDATE poker
SET
    task_id = $1,
    start_date = $2,
    end_date = $3
WHERE
    poker_id = $4;

-- name: GetVotingState :one
SELECT task_id, start_date, end_date FROM poker
WHERE poker_id = $1;

-- name: ClearVote :exec
DELETE FROM voting
WHERE poker_id = $1 AND task_id = $2;

-- name: AddVoting :one
INSERT INTO voting (poker_id, task_id, user_id, estimate)
VALUES ($1, $2, $3, $4)
ON CONFLICT (poker_id, task_id, user_id)
DO UPDATE SET
    user_id = EXCLUDED.user_id,
    poker_id = EXCLUDED.poker_id,
    task_id = EXCLUDED.task_id,
    estimate = EXCLUDED.estimate   
RETURNING *;

-- name: GetUserEstimate :one 
SELECT estimate FROM voting
WHERE poker_id = $1 AND task_id = $2 AND user_id = $3;

-- name: GetVotingResults :many
SELECT user_id, estimate FROM voting
WHERE poker_id = $1 AND task_id = $2;

-- name: RemoveVote :exec
DELETE FROM voting
WHERE poker_id = $1 AND task_id = $2 AND user_id = $3;

-- name: GetLastSession :many
SELECT 
    t1.user_id, 
    t1.poker_id,
    CASE
        WHEN t2.poker_id IS NOT NULL THEN true
        ELSE false
    END AS is_admin,
    t3.name AS poker_name
FROM 
    public.poker_users AS t1
LEFT JOIN 
    public.poker_admins AS t2
    ON t1.poker_id = t2.poker_id
    AND t1.user_id = t2.user_id
JOIN 
    public.poker AS t3
    ON t3.poker_id = t1.poker_id
WHERE 
    t1.user_id = $1
ORDER BY 
    t1.last_date DESC
LIMIT $2 OFFSET $3;

-- name: DeletePokerAdmins :exec
DELETE FROM poker_admins WHERE poker_id = $1;

-- name: DeletePokerUsers :exec
DELETE FROM poker_users WHERE poker_id = $1;

-- name: DeletePokerTasks :exec
DELETE FROM tasks WHERE poker_id = $1;

-- name: DeletePokerVotings :exec
DELETE FROM voting WHERE poker_id = $1;

-- name: DeletePokerComments :exec
DELETE FROM comments WHERE poker_id = $1;

-- name: DeletePoker :exec
DELETE FROM poker WHERE poker_id = $1;