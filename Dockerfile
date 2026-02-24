# Stage: base image (shared)
FROM ghcr.io/ministryofjustice/hmpps-node:24-alpine AS base

ARG BUILD_NUMBER
ARG GIT_REF
ARG GIT_BRANCH

# Dev-safe defaults; production enforcement happens in the build stage
ENV BUILD_NUMBER=${BUILD_NUMBER:-dev} \
    GIT_REF=${GIT_REF:-dev} \
    GIT_BRANCH=${GIT_BRANCH:-dev} \
    CYPRESS_INSTALL_BINARY=0

# Ensure junit output dir is writable for UID 2000 (CircleCI/Jest)
RUN mkdir -p /app/test-results/jest && chown -R appuser:appgroup /app/test-results

# Stage: build assets (production)
FROM base AS build

ARG BUILD_NUMBER
ARG GIT_REF
ARG GIT_BRANCH

# Fail fast for production builds
RUN test -n "$BUILD_NUMBER" || (echo "BUILD_NUMBER not set" && false)
RUN test -n "$GIT_REF" || (echo "GIT_REF not set" && false)
RUN test -n "$GIT_BRANCH" || (echo "GIT_BRANCH not set" && false)

# Toolchain for native deps during install/build
RUN apk add --no-cache --virtual .build-deps g++ make python3

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production \
    APP_VERSION=${BUILD_NUMBER}

RUN export APP_VERSION=${BUILD_NUMBER} && \
    export BUILD_NUMBER=${BUILD_NUMBER} && \
    export GIT_REF=${GIT_REF} && \
    ./bin/build-css && \
    ./bin/build-js && \
    npx webpack --config ./public/config/webpack.config.js && \
    ./bin/record-build-info

# Prod-only deps
RUN rm -rf node_modules && \
    npm ci --only=production --ignore-scripts

# Stage: production runtime (copy production assets and dependencies)
FROM base AS production

LABEL org.opencontainers.image.authors="MoJ Digital, Probation in Court <probation-in-court-team@digital.justice.gov.uk>"

ENV NODE_ENV=production \
    APP_VERSION=${BUILD_NUMBER}

COPY --from=build --chown=appuser:appgroup /app/package.json /app/package-lock.json ./
COPY --from=build --chown=appuser:appgroup /app/node_modules ./node_modules

# Runtime files
COPY --from=build --chown=appuser:appgroup /app/server ./server
COPY --from=build --chown=appuser:appgroup /app/public ./public
COPY --from=build --chown=appuser:appgroup /app/bin ./bin

EXPOSE 3000
USER 2000
CMD [ "node", "./bin/www" ]

# Stage: development / CI
FROM base AS development

# Toolchain + deps for dev
RUN apk add --no-cache g++ make python3

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm i -g concurrently
EXPOSE 3000 9229

USER 2000
ENTRYPOINT ["concurrently"]
CMD [ "\"./node_modules/.bin/webpack --config ./public/config/webpack.config.js\"", \
      "\"./node_modules/.bin/nodemon --watch ./server --inspect=0.0.0.0 ./bin/www\"", \
      "\"./node_modules/.bin/nodemon --ext scss --watch ./public/src/stylesheets ./bin/build-css\"", \
      "\"./node_modules/.bin/nodemon --ext js --watch ./public/src/javascripts ./bin/build-js\"" ]