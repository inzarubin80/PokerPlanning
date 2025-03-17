# Используем официальный образ Golang
FROM golang:1.23

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

# Собираем приложение
RUN go build -o main ./cmd/server

# Накатываем миграции
# RUN /go/bin/goose -dir ./migrations postgres "postgresql://user:password@127.0.0.1:5432/poker?sslmode=disable" up   

# Указываем порт, который будет использовать приложение
EXPOSE 8080

# Запускаем приложение
CMD ["./main"]