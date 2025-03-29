# Build Stage
FROM node:21-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production Stage
FROM node:21-alpine
WORKDIR /app

# Устанавливаем serve глобально
RUN npm install -g serve

# Копируем собранное приложение
COPY --from=builder /app/build ./build

# Оптимизации безопасности
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Europe/Moscow /etc/localtime && \
    echo "Europe/Moscow" > /etc/timezone && \
    apk del tzdata

# Используем non-root пользователя
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3003

CMD ["serve", "-s", "build", "-l", "3003"]