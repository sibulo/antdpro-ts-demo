FROM nginx:1.14-alpine

MAINTAINER changyuchun <changyuchun@dfwsgroup.com>

RUN apk update && apk add curl bash tree tzdata \
    && cp -r -f /usr/share/zoneinfo/Hongkong /etc/localtime \
    && rm -f /etc/nginx/conf.d/default.conf

ADD /dist /www/web

ADD nginx.conf /etc/nginx/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
