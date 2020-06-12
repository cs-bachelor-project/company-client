FROM node:lts-alpine as build-stage

WORKDIR /tmp

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:lts-alpine as production-stage

COPY --from=build-stage /tmp/dist /company-client

WORKDIR ./company-client/

RUN npm install -g http-server

CMD http-server . -a=0.0.0.0 -p=8080