#!/bin/bash

# Stop Next.js development server

PID_FILE="/Applications/MAMP/htdocs/bimverdi/frontend/dev-server.pid"

if [ ! -f "$PID_FILE" ]; then
    echo "❌ No PID file found. Server may not be running."
    echo "Checking for any running Next.js processes..."

    # Try to find and kill any npm/next dev processes
    pkill -f "next dev" && echo "✅ Killed running Next.js processes" || echo "ℹ️  No processes found"
    exit 0
fi

PID=$(cat "$PID_FILE")

if ps -p $PID > /dev/null 2>&1; then
    echo "🛑 Stopping dev server (PID: $PID)..."
    kill $PID

    # Wait a moment and check if it stopped
    sleep 1

    if ps -p $PID > /dev/null 2>&1; then
        echo "⚠️  Process didn't stop gracefully, forcing..."
        kill -9 $PID
    fi

    rm -f "$PID_FILE"
    echo "✅ Dev server stopped successfully"
else
    echo "ℹ️  Process $PID is not running"
    rm -f "$PID_FILE"
fi
