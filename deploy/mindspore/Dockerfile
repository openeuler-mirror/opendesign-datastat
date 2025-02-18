FROM gplane/pnpm as Builder

RUN mkdir -p /home/mindspore-datastat/web
WORKDIR /home/mindspore-datastat/web
COPY . /home/mindspore-datastat/web

RUN pnpm install

RUN pnpm build:mindspore

FROM swr.cn-north-4.myhuaweicloud.com/opensourceway/openeuler/nginx:latest as NginxBuilder
RUN yum update -y && yum install -y pcre-devel

COPY --from=Builder /home/mindspore-datastat/web/dist/mindspore /usr/share/nginx/html/
RUN chmod -R 755 /usr/share/nginx/html
COPY ./deploy/mindspore/nginx.conf /etc/nginx/nginx.conf


RUN touch /var/run/nginx.pid \
    && chown -R nginx:nginx /var/log/nginx \ 
    && chown -R nginx:nginx /var/run/nginx.pid \ 
    && chown -R nginx:nginx /etc/nginx
EXPOSE 8080
USER nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]

