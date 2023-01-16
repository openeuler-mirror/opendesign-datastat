FROM gplane/pnpm as Builder

RUN mkdir -p /home/openlookeng-datastat/web
WORKDIR /home/openlookeng-datastat/web
COPY . /home/openlookeng-datastat/web

RUN pnpm install

RUN pnpm build

FROM nginx:1.20.0

COPY --from=Builder /home/openlookeng-datastat/web/dist/lookeng /usr/share/nginx/html/
RUN chmod -R 755 /usr/share/nginx/html
COPY ./deploy/lookeng/nginx.conf /etc/nginx/nginx.conf

ENV RUN_USER nginx
ENV RUN_GROUP nginx
EXPOSE 8080
ENTRYPOINT ["nginx", "-g", "daemon off;"]

