#!/bin/bash

/docker-entrypoint.sh --disable-request-logging --disable-banner --global-response-templating &

# This script watches the current directory and all subdirectories for changes

if [ -z "$(which inotifywait)" ]; then
    echo "inotifywait not installed."
    echo "In most distros, it is available in the inotify-tools package."
    exit 1
fi

inotifywait --recursive --monitor --format "%e %w%f" \
--event modify,move,create,delete ./mappings \
| while read changed; do
    eval "$@"
done