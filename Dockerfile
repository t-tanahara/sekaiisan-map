FROM node:13.7.0

RUN apt update && apt upgrade -y

WORKDIR /app
COPY . .

RUN npm install