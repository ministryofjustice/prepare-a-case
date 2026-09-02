# Stage: base
FROM ghcr.io/ministryofjustice/hmpps-node:24-alpine AS base

ARG BUILD_NUMBER
ARG GIT_REF
ARG GIT_BRANCH

RUN test -n "$BUILD_NUMBER" || (echo "BUILD_NUMBER not set" && false) \
 && test -n "$GIT_REF" || (echo "GIT_REF not set" && false) \
 && test -n "$GIT_BRANCH" || (echo "GIT_BRANCH not set" && false)

ENV BUILD_NUMBER=${BUILD_NUMBER} \
    GIT_REF=${GIT_REF} \
    GIT_BRANCH=${GIT_BRANCH} \
    CYPRESS_INSTALL_BINARY=0

WORKDIR /app

# Stage: dependencies shared by build and development
FROM base AS dependencies

RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    linux-headers \
    libc6-compat \
    libpng

COPY package.json package-lock.json ./
RUN npm ci

# Stage: build production assets
FROM dependencies AS build

COPY . .

ENV APP_VERSION=${BUILD_NUMBER} \
    NODE_ENV=production

RUN ./bin/build-css \
 && ./bin/build-js \
 && npx webpack --config ./public/config/webpack.config.js \
 && ./bin/record-build-info \
 && npm prune --omit=dev --no-audit --no-fund

# Stage: development
FROM dependencies AS development

COPY . .

RUN npm install --global concurrently

ENV NODE_ENV=development

EXPOSE 3000 9229
USER 2000

ENTRYPOINT ["concurrently"]
CMD [ \
  "\"./node_modules/.bin/webpack --config ./public/config/webpack.config.js\"", \
  "\"./node_modules/.bin/nodemon --watch ./server --inspect=0.0.0.0 ./bin/www\"", \
  "\"./node_modules/.bin/nodemon --ext scss --watch ./public/src/stylesheets ./bin/build-css\"", \
  "\"./node_modules/.bin/nodemon --ext js --watch ./public/src/javascripts ./bin/build-js\"" \
]

# Stage: production runtime
FROM ghcr.io/ministryofjustice/hmpps-node:24-alpine-runtime AS production

ARG BUILD_NUMBER
ARG GIT_REF
ARG GIT_BRANCH

ENV BUILD_NUMBER=${BUILD_NUMBER} \
    GIT_REF=${GIT_REF} \
    GIT_BRANCH=${GIT_BRANCH} \
    APP_VERSION=${BUILD_NUMBER} \
    NODE_ENV=production

WORKDIR /app

COPY --from=build --chown=appuser:appgroup \
    /app/package.json \
    /app/package-lock.json \
    /app/build-info.json \
    ./

COPY --from=build --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=build --chown=appuser:appgroup /app/server ./server
COPY --from=build --chown=appuser:appgroup /app/public/build ./public/build
COPY --from=build --chown=appuser:appgroup /app/bin/www ./bin/www

EXPOSE 3000
USER 2000

CMD ["node", "./bin/www"]