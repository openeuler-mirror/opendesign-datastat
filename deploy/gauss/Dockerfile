FROM swr.cn-north-4.myhuaweicloud.com/opensourceway/node:latest as Builder

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

ENV RUN_USER nginx
ENV RUN_GROUP nginx
EXPOSE 8080
ENTRYPOINT ["nginx", "-g", "daemon off;"]

