FROM gplane/pnpm as Builder

RUN mkdir -p /home/openeuler-datastat/web
WORKDIR /home/openeuler-datastat/web
COPY . /home/openeuler-datastat/web

RUN pnpm install

RUN pnpm build:euler

FROM swr.cn-north-4.myhuaweicloud.com/opensourceway/openeuler/nginx:1.24.0-22.03-lts-sp1 as NginxBuilder


COPY --from=Builder /home/openeuler-datastat/web/dist/openeuler /usr/share/nginx/html/
RUN chmod -R 755 /usr/share/nginx/html
COPY ./deploy/euler/nginx.conf /etc/nginx/nginx.conf

ENV RUN_USER nginx
ENV RUN_GROUP nginx
EXPOSE 8080
ENTRYPOINT ["nginx", "-g", "daemon off;"]

