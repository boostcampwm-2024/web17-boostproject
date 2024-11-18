FROM node:20-alpine
WORKDIR /packages
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn workspace backend build

# 한국 시간에 맞춰 변경
RUN apk add --no-cache tzdata
RUN cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime && echo "Asia/Seoul" > /etc/timezone

EXPOSE 3000
CMD ["yarn", "workspace", "backend", "start:prod"]
