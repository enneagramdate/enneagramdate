FROM node:16.13
RUN npm i webpack -g
WORKDIR /usr/src/app
COPY package*.json /usr/src/app
RUN npm install
EXPOSE 9999