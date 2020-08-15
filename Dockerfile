
FROM quay.io/eversolve/nodejs:master
MAINTAINER "igor.fischer@eversolve.io"

ENV NODE_ENV production

RUN apk add --update git python make gcc g++ openssh-client

COPY package.json /app/package.json
RUN cd /app && npm i --loglevel info
ADD . /app

ADD rootfs /
RUN chown -R node:node /app
EXPOSE 1337
ENV BABEL_CACHE_PATH "/app/.babel.json"
ENV S6_USE_CATCHALL_LOGGER 1
