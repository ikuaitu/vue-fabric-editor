FROM node:18-alpine3.18 as build

WORKDIR /app
COPY . .

RUN npm install -g pnpm --registry=https://registry.npmmirror.com
RUN pnpm config set registry https://registry.npmmirror.com
RUN pnpm install

RUN ["pnpm", "build"]

FROM nginx:1.25.3
COPY --from=0 /app/dist /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/

