#!/bin/bash
set -e

# Install missing node modules
yarn install --frozen-lockfile --check-files --silent

printf "API_SERVER=$API_SERVER\nAPI_TOKEN=$API_TOKEN\n" > .env.production

# Empty previous build contents
rm  build/*

yarn build

# Then exec the container's main process (what's set as CMD in the Dockerfile).
exec "$@"
