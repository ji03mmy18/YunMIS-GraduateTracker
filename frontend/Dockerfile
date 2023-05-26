# Build Stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY . .
RUN apk add make g++ \
    && yarn install \
    && yarn run build

# Production Stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY ./site.conf /etc/nginx/conf.d/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
