FROM node:lts-alpine as build-stage

WORKDIR /tmp

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build -- --mode development

FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /tmp/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]