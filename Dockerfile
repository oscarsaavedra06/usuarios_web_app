FROM nginx:stable-alpine

COPY build/ /usr/share/nginx/html 

COPY nginx.conf /etc/nginx/conf.d