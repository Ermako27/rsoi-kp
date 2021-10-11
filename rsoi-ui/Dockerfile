FROM node:14-alpine as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /var/www

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]