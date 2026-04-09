# Stage: base image
FROM ghcr.io/ministryofjustice/hmpps-node:24-alpine AS base

ARG BUILD_NUMBER
ARG GIT_REF
ARG GIT_BRANCH

RUN test -n "$BUILD_NUMBER" || (echo "BUILD_NUMBER not set" && false)
RUN test -n "$GIT_REF" || (echo "GIT_REF not set" && false)
RUN test -n "$GIT_BRANCH" || (echo "GIT_BRANCH not set" && false)

ENV BUILD_NUMBER=${BUILD_NUMBER}
ENV GIT_REF=${GIT_REF}
ENV GIT_BRANCH=${GIT_BRANCH}

ENV CYPRESS_INSTALL_BINARY=0

# Stage: build
FROM base AS build

RUN apk add --no-cache \
      python3 \
      make \
      g++ \
      linux-headers \
      libc6-compat \
      libpng

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG BUILD_NUMBER
ARG GIT_REF
ENV APP_VERSION=${BUILD_NUMBER}
ENV NODE_ENV=production

RUN export APP_VERSION=${BUILD_NUMBER} && \
    export BUILD_NUMBER=${BUILD_NUMBER} && \
    export GIT_REF=${GIT_REF} && \
    ./bin/build-css && \
    ./bin/build-js && \
    npx webpack --config ./public/config/webpack.config.js && \
    ./bin/record-build-info

# Keep only production deps
RUN npm prune --omit=dev --no-audit --no-fund

# Stage: development
FROM base AS development

RUN apk add --no-cache \
      python3 \
      make \
      g++ \
      linux-headers \
      libc6-compat \
      libpng

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm i -g concurrently

EXPOSE 3000 9229
ENV NODE_ENV=development
USER 2000

ENTRYPOINT ["concurrently"]
CMD [ \
  "\"./node_modules/.bin/webpack --config ./public/config/webpack.config.js\"", \
  "\"./node_modules/.bin/nodemon --watch ./server --inspect=0.0.0.0 ./bin/www\"", \
  "\"./node_modules/.bin/nodemon --ext scss --watch ./public/src/stylesheets ./bin/build-css\"", \
  "\"./node_modules/.bin/nodemon --ext js --watch ./public/src/javascripts ./bin/build-js\"" \
]

# Stage: production runtime
FROM base AS production

# Runtime libs only (no compiler toolchain)
RUN apk add --no-cache \
      libc6-compat \
      libpng

COPY --from=build --chown=appuser:appgroup /app /app

EXPOSE 3000
ENV NODE_ENV=production
USER 2000

ENTRYPOINT [ "node" ]
CMD [ "./bin/www" ]