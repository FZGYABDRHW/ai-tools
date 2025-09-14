#!/bin/bash

# Development startup script for Wowworks AI Tools
# This script sets up the proper environment for running Electron in a devcontainer

echo "🚀 Starting Wowworks AI Tools development environment..."

# Set up environment variables
export DISPLAY=:99
export ELECTRON_DISABLE_SANDBOX=1
export ELECTRON_NO_SANDBOX=1
export ELECTRON_DISABLE_GPU=1
export ELECTRON_DISABLE_GPU_SANDBOX=1
export ELECTRON_DISABLE_GPU_PROCESS_CRASH_LIMIT=1

# Ensure virtual display is running
if ! pgrep -x "Xvfb" > /dev/null; then
    echo "🖥️  Starting virtual display server..."
    Xvfb :99 -screen 0 1024x768x24 &
    sleep 2
fi

# Ensure D-Bus is running
if ! pgrep -x "dbus-daemon" > /dev/null; then
    echo "🔧 Starting D-Bus service..."
    sudo service dbus start
fi

# Start the application
echo "🎯 Launching Electron application..."
npm start
