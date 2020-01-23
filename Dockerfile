FROM node:12.13.0

MAINTAINER MoJ Digital, Probation in Court <probation-in-defaultParams-team@digital.justice.gov.uk>

ARG BUILD_NUMBER
ARG GIT_REF

ENV TZ=Europe/London
RUN ln -snf "/usr/share/zoneinfo/$TZ" /etc/localtime && echo "$TZ" > /etc/timezone

RUN mkdir -p /app
WORKDIR /app

COPY package*.json yarn*.lock ./

ENV BUILD_NUMBER ${BUILD_NUMBER:-1_0_0}
ENV GIT_REF ${GIT_REF:-dummy}

RUN yarn

COPY . .

RUN export BUILD_NUMBER=${BUILD_NUMBER} && \
    export GIT_REF=${GIT_REF} && \
    yarn record-build-info

EXPOSE 3000
ENV NODE_ENV='production'
USER 2000

CMD [ "yarn", "start" ]
