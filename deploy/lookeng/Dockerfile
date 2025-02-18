FROM gplane/pnpm as Builder

RUN mkdir -p /home/openlookeng-datastat/web
WORKDIR /home/openlookeng-datastat/web
COPY . /home/openlookeng-datastat/web

RUN pnpm install

RUN pnpm build:lookeng

FROM swr.cn-north-4.myhuaweicloud.com/opensourceway/openeuler/nginx:latest as NginxBuilder

COPY --from=Builder /home/openlookeng-datastat/web/dist/openlookeng /usr/share/nginx/html/
RUN chmod -R 755 /usr/share/nginx/html
COPY ./deploy/lookeng/nginx.conf /etc/nginx/nginx.conf

RUN touch /var/run/nginx.pid \
    && chown -R nginx:nginx /var/log/nginx \ 
    && chown -R nginx:nginx /var/run/nginx.pid \ 
    && chown -R nginx:nginx /etc/nginx
EXPOSE 8080
USER nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]

