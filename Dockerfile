FROM node:12.18.0-alpine3.12

MAINTAINER MoJ Digital, Probation in Court <probation-in-court-team@digital.justice.gov.uk>
ARG BUILD_NUMBER
ARG GIT_REF

ENV TZ=Europe/London
RUN ln -snf "/usr/share/zoneinfo/$TZ" /etc/localtime && echo "$TZ" > /etc/timezone

ENV BUILD_NUMBER ${BUILD_NUMBER:-1_0_0}
ENV GIT_REF ${GIT_REF:-dummy}

RUN mkdir -p /app
WORKDIR /app

COPY package*.json package-lock*.json ./

RUN npm i

COPY . .

RUN npm run css-build && \
    export BUILD_NUMBER=${BUILD_NUMBER} && \
    export GIT_REF=${GIT_REF} && \
    npm run record-build-info

RUN npm ci --only=production



EXPOSE 3000
ENV NODE_ENV='production'
USER 2000

CMD [ "node", "./bin/www" ]
