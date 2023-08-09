FROM node:16-alpine AS builder
WORKDIR /app

# install and cache app dependencies
COPY package.json .
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/entrypoint.sh /entrypoint.sh

RUN chmod 755 /entrypoint.sh
RUN chmod 755 -R /etc/nginx

ENV LANG C.UTF-8
ENV APP_FREE_FONT_BASE_API https://wordshub.github.io/free-font/
ENV APP_VUE_FABRIC_EDITOR_STATIC_BASE_API https://nihaojob.github.io/vue-fabric-editor-static/

EXPOSE 3000
VOLUME [ "/etc/nginx" ]
ENTRYPOINT [ "/entrypoint.sh" ]
