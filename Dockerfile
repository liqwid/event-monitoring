FROM node:8-alpine

WORKDIR /app

RUN yarn global add \
  nodemon \
  ts-node \
  typescript

COPY package.json ./
COPY yarn.lock ./
RUN yarn

CMD ["nodemon"]
