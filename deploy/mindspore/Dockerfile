FROM swr.cn-north-4.myhuaweicloud.com/opensourceway/node:latest as Builder

RUN mkdir -p /home/mindspore-datastat/web
WORKDIR /home/mindspore-datastat/web
COPY . /home/mindspore-datastat/web

RUN npm install pnpm -g
RUN pnpm install
RUN pnpm build:mindspore

FROM swr.cn-north-4.myhuaweicloud.com/opensourceway/openeuler/nginx:latest as NginxBuilder
RUN yum update -y && yum install -y pcre-devel

COPY --from=Builder /home/mindspore-datastat/web/dist/mindspore /usr/share/nginx/html/
RUN chmod -R 755 /usr/share/nginx/html
COPY ./deploy/mindspore/nginx.conf /etc/nginx/nginx.conf


ENV RUN_USER nginx
ENV RUN_GROUP nginx
EXPOSE 8080
ENTRYPOINT ["nginx", "-g", "daemon off;"]

