## use slim not alpine otherwise PACT binarys wont load due to missing libs
FROM node:20.10-slim as base

## common
ENV TZ=Europe/London
RUN ln -snf "/usr/share/zoneinfo/$TZ" /etc/localtime && echo "$TZ" > /etc/timezone
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get -y install g++ make python3 && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./

ENV CYPRESS_INSTALL_BINARY=0

RUN npm i
COPY . .
EXPOSE 3000

## only used for production
FROM base as production
MAINTAINER MoJ Digital, Probation in Court <probation-in-court-team@digital.justice.gov.uk>
ARG BUILD_NUMBER
ARG GIT_REF
ENV BUILD_NUMBER ${BUILD_NUMBER:-1_0_0}
ENV GIT_REF ${GIT_REF:-dummy}
ENV APP_VERSION=${BUILD_NUMBER}
ENV NODE_ENV='production'
COPY ./server ./server
COPY ./public ./public
COPY ./bin ./bin
RUN export APP_VERSION=${BUILD_NUMBER} && \
    export BUILD_NUMBER=${BUILD_NUMBER} && \
    export GIT_REF=${GIT_REF} && \
    ./bin/build-css && \
    ./bin/build-js && \
    npx webpack --config ./public/config/webpack.config.js && \
    ./bin/record-build-info
RUN rm -rf node_modules && \
    npm ci --only=production --ignore-scripts
USER 2000
ENTRYPOINT [ "node" ]
CMD [ "./bin/www" ]

## only use for development and ci
FROM base as development
RUN npm i -g concurrently
EXPOSE 9229
ENTRYPOINT ["concurrently"]
CMD [ "\"./node_modules/.bin/webpack --config ./public/config/webpack.config.js\"", "\"./node_modules/.bin/nodemon --watch ./server --inspect=0.0.0.0 ./bin/www\"", "\"./node_modules/.bin/nodemon --ext scss --watch ./public/src/stylesheets ./bin/build-css\"", "\"./node_modules/.bin/nodemon --ext js --watch ./public/src/javascripts ./bin/build-js\""]