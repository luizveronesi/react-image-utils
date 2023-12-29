FROM node:16-alpine3.12 as build
WORKDIR /app

ARG REACT_APP_ENV
ENV REACT_APP_ENV=$REACT_APP_ENV

COPY package.json /app
COPY package-lock.json /app

RUN npm set timeout=100000
RUN npm install

COPY . /app
RUN npm run ci-build-$REACT_APP_ENV

FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]