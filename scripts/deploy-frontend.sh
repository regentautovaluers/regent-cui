#!/bin/bash

# Set the tag for the frontend image
export FRONTEND_TAG=$1

# Navigate to your docker-compose.yml directory
cd /path/to/your/docker-compose

# Pull the latest image
docker-compose pull frontend

# Recreate the frontend service with the new image
docker-compose up -d frontend
