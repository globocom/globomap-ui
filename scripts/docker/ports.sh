#!/bin/bash
if [ -z "${GMAP_UI_PORT}" ]; then
    echo "Environment variable GMAP_UI_PORT is not defined."
    echo "Setting default ..."
    GMAP_UI_PORT=7012
fi

cp -R docker-compose.yml docker-compose-temp.yml
sed -i '' "s/\${GMAP_UI_PORT}/$GMAP_UI_PORT/g" docker-compose-temp.yml