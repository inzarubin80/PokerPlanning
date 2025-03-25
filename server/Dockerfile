# Используем официальный образ Golang
FROM golang:1.23 AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем go.mod и go.sum
COPY go.mod go.sum ./

# Устанавливаем зависимости
RUN go mod download

# Копируем исходный код
COPY . .

# Устанавливаем goose
RUN go install github.com/pressly/goose/v3/cmd/goose@latest

# Собираем приложение (статически линкованный бинарник)
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/server/
# Проверяем, что файл создан

RUN ls -l /app/main

# Этап запуска
FROM alpine:latest


# Устанавливаем зависимости для goose (если требуется)
RUN apk add --no-cache libc6-compat

# Копируем бинарный файл и миграции из этапа сборки
COPY --from=builder /app/main .
#COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/migrations /app/migrations/  


# Копируем goose из этапа сборки
COPY --from=builder /go/bin/goose /usr/local/bin/goose

# Указываем порт, который будет использовать приложение
EXPOSE 8090


# Запускаем миграции и приложениеы
 CMD ["sh", "-c", "/usr/local/bin/goose -dir /app/migrations postgres \"${DATABASE_URL}\" up && ./main"]