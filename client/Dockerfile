# Build Stage - используем многоступенчатую сборку для уменьшения размера итогового образа
FROM node:21-alpine AS builder
WORKDIR /app
# Сначала копируем только файлы, необходимые для установки зависимостей
COPY package.json package-lock.json ./
RUN npm ci --omit=dev # Устанавливаем только production зависимости
COPY . .
RUN npm run build

# Production Stage - используем более легкий nginx образ
FROM nginx:1.25-alpine
# Удаляем дефолтную конфигурацию nginx
RUN rm -rf /etc/nginx/conf.d/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Копируем только необходимые файлы из стадии сборки
COPY --from=builder /app/build /usr/share/nginx/html
# Устанавливаем права для nginx
RUN chown -R nginx:nginx /usr/share/nginx/html

# Оптимизации безопасности
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Europe/Moscow /etc/localtime && \
    echo "Europe/Moscow" > /etc/timezone && \
    apk del tzdata

# Защищаем чувствительные файлы
RUN chmod -R 755 /usr/share/nginx/html && \
    find /usr/share/nginx/html -type f -exec chmod 644 {} \;

# Используем non-root пользователя
USER nginx

EXPOSE 3003
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:3003/ || exit 1
CMD ["nginx", "-g", "daemon off;"]