FROM node:18.14.1 as Builder

RUN mkdir -p /home/opengauss-datastat/web
WORKDIR /home/opengauss-datastat/web
COPY . /home/opengauss-datastat/web

RUN npm install pnpm -g
RUN pnpm install
RUN pnpm build:gauss

FROM swr.cn-north-4.myhuaweicloud.com/opensourceway/openeuler/nginx:latest as NginxBuilder
RUN yum update -y && yum install -y pcre-devel

COPY --from=Builder /home/opengauss-datastat/web/dist/opengauss /usr/share/nginx/html/
RUN chmod -R 755 /usr/share/nginx/html
COPY ./deploy/gauss/nginx.conf /etc/nginx/nginx.conf

RUN touch /var/run/nginx.pid \
    && chown -R nginx:nginx /var/log/nginx \ 
    && chown -R nginx:nginx /var/run/nginx.pid \ 
    && chown -R nginx:nginx /etc/nginx
EXPOSE 8080
USER nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]

