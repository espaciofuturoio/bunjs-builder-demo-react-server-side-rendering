#!/bin/bash

# Ensure the dist directory exists
mkdir -p dist/client

# Build client-side JavaScript
echo "Building client-side JavaScript..."
bun build src/client/*.tsx --outdir dist/client --target browser

# Optional: Watch for changes during development
if [ "$1" == "--watch" ]; then
  echo "Watching for changes in client files..."
  bun build src/client/*.tsx --outdir dist/client --target browser --watch &
  WATCH_PID=$!
  
  # Watch the server with bun dev
  echo "Starting server in dev mode..."
  bun run --watch src/index.ts
  
  # When the server stops, kill the watch process
  kill $WATCH_PID
else
  echo "Build complete. Run with --watch to enable watch mode."
fi 