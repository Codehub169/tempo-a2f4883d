#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e
# Treat unset variables as an error.
set -u
# Cause a pipeline to return the exit status of the last command in the pipe
# that returned a non-zero status, or zero if all commands in the pipe exit successfully.
set -o pipefail

# Navigate to the frontend directory
echo "Navigating to frontend directory..."
# This assumes the script is run from the project root directory that contains the 'frontend' folder.
if [ ! -d "frontend" ]; then
  echo "Error: 'frontend' directory not found. Make sure you are in the project root."
  exit 1
fi
cd frontend

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install --loglevel error --legacy-peer-deps

# Build the frontend application
echo "Building frontend application..."
npm run build # This will create the frontend/dist directory

# Navigate to the backend directory (relative to project root)
echo "Navigating to backend directory..."
cd ../backend
# The following check is redundant if 'set -e' is active and cd ../backend succeeds.
# If cd ../backend fails, 'set -e' will terminate the script.
# If cd ../backend succeeds, '.' will always be a directory.
# Kept as per original script's comment indicating awareness of redundancy.
if [ ! -d "." ]; then 
  echo "Error: 'backend' directory not found after attempting to navigate from frontend. Structure error."
  exit 1
fi

# Install backend dependencies
echo "Installing backend dependencies..."
npm install --loglevel error --legacy-peer-deps

# Initialize the database (run seed script)
echo "Initializing database..."
npm run db:init

# Start the backend server in production mode
echo "Starting backend server on port 9000 in production mode..."
NODE_ENV=production npm start
