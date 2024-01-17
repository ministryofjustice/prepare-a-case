FROM cypress/included:13.6.2

WORKDIR /e2e

COPY ./integration-tests/package.json ./integration-tests/package-lock.json ./

ENV CYPRESS_CRASH_REPORTS=0 
ENV CYPRESS_INSTALL_BINARY=0
ENV CYPRESS_COMMERCIAL_RECOMMENDATIONS=0

RUN npm i

ENTRYPOINT ["npx", "cypress"]