# Build Stage
FROM node:lts-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage
FROM nginx:latest as production

# Копируем кастомную конфигурацию Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Копируем собранные файлы
COPY --from=build /app/build /usr/share/nginx/html
# Открываем порт 3000
EXPOSE 3000
# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]