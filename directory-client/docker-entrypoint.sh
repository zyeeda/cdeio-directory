#!/bin/bash
set -e

if [ "$1" = "mvn" ]; then
    for n; do
        if [ "$n" = "jetty:run" ]; then
            echo "Starting Jetty server from Maven ..."
            mvn flyway:migrate

            if [ ! -h /opt/zyeeda/cdeio-directory/directory-server/src/main/webapp/scripts/cdeio ]; then
                echo "No symbolic link to colorvest found, create one."
                ln -s /opt/zyeeda/colorvest/cdeio /opt/zyeeda/cdeio-directory/directory-server/src/main/webapp/scripts/cdeio
            fi
        fi
    done
fi

exec "$@"
