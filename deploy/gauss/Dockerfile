FROM gplane/pnpm as Builder

RUN mkdir -p /home/opengauss-datastat/web
WORKDIR /home/opengauss-datastat/web
COPY . /home/opengauss-datastat/web

RUN pnpm install

RUN pnpm build:gauss

FROM swr.cn-north-4.myhuaweicloud.com/opensourceway/openeuler/nginx:1.24.0-22.03-lts-sp1 as NginxBuilder


COPY --from=Builder /home/opengauss-datastat/web/dist/opengauss /usr/share/nginx/html/
RUN chmod -R 755 /usr/share/nginx/html
COPY ./deploy/gauss/nginx.conf /etc/nginx/nginx.conf

ENV RUN_USER nginx
ENV RUN_GROUP nginx
EXPOSE 8080
ENTRYPOINT ["nginx", "-g", "daemon off;"]

