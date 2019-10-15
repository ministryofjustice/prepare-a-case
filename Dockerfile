FROM node:10.16.3

MAINTAINER probation-in-court-team@digital.justice.gov.uk

WORKDIR /usr/src/app

COPY package*.json yarn*.lock ./

RUN yarn

COPY . .

EXPOSE 3000

CMD [ "node", "./bin/www" ]
