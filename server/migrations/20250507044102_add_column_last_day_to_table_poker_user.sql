-- +goose Up
ALTER TABLE poker_users 
ADD COLUMN last_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Обновляем существующие строки (DEFAULT не влияет на существующие записи)
UPDATE poker_users 
SET last_date = CURRENT_TIMESTAMP;

-- +goose Down
ALTER TABLE poker_users 
DROP COLUMN last_date;