#!/bin/bash

# Выводим информацию о подключении к БД (для логов)
echo "Starting application with DATABASE_URL: ${DATABASE_URL:0:20}..."  # Показываем первые 20 символов для безопасности

# Проверяем наличие DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL environment variable is not set!" >&2
  exit 1
fi

# Выполняем миграции
echo "Running database migrations..."
/usr/local/bin/goose -dir /app/migrations postgres "$DATABASE_URL" up

# Запускаем приложение
echo "Starting application..."
exec ./main