## use slim not alpine otherwise PACT binarys wont load due to missing libs
FROM node:20.10-slim as base

## common
RUN apt-get update
RUN apt-get install -y sqlite3 libsqlite3-dev
WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
COPY schema.sql ./
copy index.js ./
RUN npm i
RUN npm run seed
EXPOSE 3000



CMD [ "node",  "index.js"]