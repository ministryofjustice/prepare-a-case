FROM wiremock/wiremock
MAINTAINER MoJ Digital, Probation in Court <probation-in-court-team@digital.justice.gov.uk>

ENV TZ=Europe/London
RUN ln -snf "/usr/share/zoneinfo/$TZ" /etc/localtime && echo "$TZ" > /etc/timezone
RUN apt-get update
RUN apt-get -y install inotify-tools curl

WORKDIR /home/wiremock

COPY wiremock/inotify-watch.sh ./

ENTRYPOINT ["./inotify-watch.sh", "curl -X POST \"http://localhost:8080/__admin/mappings/reset\""]