#!/bin/bash

# Initialize mounted volume with built assets if it's empty
if [ -z "$(ls -A /app/.output/public 2>/dev/null)" ]; then
    echo "Initializing public assets..."
    cp -r /app/.output/public-backup/* /app/.output/public/
fi

# Execute the original command
exec "$@"