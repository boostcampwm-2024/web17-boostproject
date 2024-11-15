FROM node:20-alpine AS builder
WORKDIR /packages
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn workspace frontend build

# Nginx 서버로 빌드된 파일 서빙
FROM nginx:alpine
COPY --from=builder /packages/packages/frontend/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
