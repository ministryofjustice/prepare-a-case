FROM node:12-buster-slim

MAINTAINER MoJ Digital, Probation in Court <probation-in-court-team@digital.justice.gov.uk>

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

EXPOSE 3000
ENV NODE_ENV='production'
USER 2000

CMD [ "yarn", "start" ]
