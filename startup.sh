#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e
# Treat unset variables as an error.
set -u
# Cause a pipeline to return the exit status of the last command in the pipe
# that returned a non-zero status, or zero if all commands in the pipe exit successfully.
set -o pipefail

# Navigate to the backend directory
echo "Navigating to backend directory..."
# This assumes the script is run from the project root directory that contains the 'backend' folder.
if [ ! -d "backend" ]; then
  echo "Error: 'backend' directory not found. Make sure you are in the project root."
  exit 1
fi
cd backend

# Install dependencies
# This ensures all Node.js packages required by the backend are installed.
echo "Installing backend dependencies..."
npm install

# Initialize the database (run seed script)
# This ensures the database schema and initial data are in place before starting the server.
# The 'db:init' script is defined in backend/package.json.
echo "Initializing database..."
npm run db:init

# Start the backend server
# The server will listen on port 9000 as configured in backend/server.js.
# In production, it may also serve the frontend application.
echo "Starting backend server on port 9000..."
# Ensure NODE_ENV is set appropriately in the execution environment or within the npm start script
# For example, to run in production: NODE_ENV=production npm start
# The 'start' script is defined in backend/package.json.
npm start
