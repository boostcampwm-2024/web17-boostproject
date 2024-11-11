FROM node:20-alpine
WORKDIR /packages
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn workspace backend build
EXPOSE 3000
CMD ["yarn", "workspace", "backend", "start:prod"]
