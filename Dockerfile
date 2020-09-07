FROM node:8-alpine

MAINTAINER blingweiwei "liang.wei@free-sun.com.cn"

COPY . /var/app

WORKDIR /var/app

EXPOSE 4000

CMD ["-p", "4000", "-g", "postgres://postgres:123456@postgres-test:5432/Visit"]

ENTRYPOINT [ "node", "server.js" ]
