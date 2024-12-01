#!/bin/bash

export PATH="/root/.nvm/versions/node/v20.11.1/bin:$PATH"

# Restart the server using PM2 with compiled JavaScript files
pm2 stop war-theatre || true
pm2 start dist/server-root.js --name war-theatre
