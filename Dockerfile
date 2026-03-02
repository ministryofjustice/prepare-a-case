# HMPPS base (includes: appuser/appgroup UID/GID 2000, tzdata+ca-certs, TZ setup, apk upgrade, WORKDIR /app)
FROM ghcr.io/ministryofjustice/hmpps-node:24-alpine AS base

# Match prior behaviour
ENV CYPRESS_INSTALL_BINARY=0

# Build toolchain needed for npm install (native deps) and your webpack/css/js build steps
# Use a virtual package so we can remove it later in the production stage (like your old apt purge)
RUN apk add --no-cache --virtual .build-deps \
      python3 \
      make \
      g++ \
      linux-headers

# Runtime libs commonly needed on Alpine when moving from Debian/glibc-based images
# (kept minimal; libc6-compat helps with some glibc-linked prebuilt binaries)
RUN apk add --no-cache \
      libc6-compat \
      libstdc++ \
      libgcc \
      libpng

COPY package.json ./
COPY package-lock.json ./
RUN npm i

COPY . .
EXPOSE 3000


## only used for production
FROM base AS production

LABEL org.opencontainers.image.authors="MoJ Digital, Probation in Court <probation-in-court-team@digital.justice.gov.uk>"

ARG BUILD_NUMBER
ARG GIT_REF
ENV BUILD_NUMBER=${BUILD_NUMBER:-1_0_0} \
    GIT_REF=${GIT_REF:-dummy} \
    APP_VERSION=${BUILD_NUMBER:-1_0_0} \
    NODE_ENV=production

# Keep explicit copies as per old Dockerfile (even though base already has source)
COPY ./server ./server
COPY ./public ./public
COPY ./bin ./bin

RUN export APP_VERSION=${BUILD_NUMBER} && \
    export BUILD_NUMBER=${BUILD_NUMBER} && \
    export GIT_REF=${GIT_REF} && \
    ./bin/build-css && \
    ./bin/build-js && \
    npx webpack --config ./public/config/webpack.config.js && \
    ./bin/record-build-info && \
    echo "=== BUILD OUTPUT ===" && \
    ls -R public/build

# Production deps only (same as old)
RUN rm -rf node_modules && \
    npm ci --only=production --ignore-scripts

# Strip build toolchain from the final image (Alpine equivalent of apt purge)
RUN apk del .build-deps

USER 2000
ENTRYPOINT [ "node" ]
CMD [ "./bin/www" ]


## only use for development and ci
FROM base AS development

RUN npm i -g concurrently

EXPOSE 9229

USER 2000
ENTRYPOINT ["concurrently"]
CMD [ "\"./node_modules/.bin/webpack --config ./public/config/webpack.config.js\"", \
      "\"./node_modules/.bin/nodemon --watch ./server --inspect=0.0.0.0 ./bin/www\"", \
      "\"./node_modules/.bin/nodemon --ext scss --watch ./public/src/stylesheets ./bin/build-css\"", \
      "\"./node_modules/.bin/nodemon --ext js --watch ./public/src/javascripts ./bin/build-js\"" ]