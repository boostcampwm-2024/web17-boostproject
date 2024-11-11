FROM node:18-alpine AS builder
WORKDIR /packages
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn workspace frontend build

# Nginx 서버로 빌드된 파일 서빙
FROM nginx:alpine
COPY --from=builder /packages/frontend/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
