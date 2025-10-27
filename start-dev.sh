#!/bin/bash

# Robust Next.js development server starter
# This script ensures the server stays running even when other terminal commands are executed

FRONTEND_DIR="/Applications/MAMP/htdocs/bimverdi/frontend"
LOG_FILE="/Applications/MAMP/htdocs/bimverdi/frontend/dev-server.log"
PID_FILE="/Applications/MAMP/htdocs/bimverdi/frontend/dev-server.pid"

# Check if server is already running
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p $PID > /dev/null 2>&1; then
        echo "✅ Dev server is already running (PID: $PID)"
        echo "📍 URL: http://localhost:3000"
        echo "📋 Logs: tail -f $LOG_FILE"
        echo "🛑 Stop: kill $PID"
        exit 0
    else
        # PID file exists but process is not running, clean up
        rm -f "$PID_FILE"
    fi
fi

echo "🚀 Starting Next.js dev server in background..."
cd "$FRONTEND_DIR"

# Start server in background with nohup
nohup npm run dev > "$LOG_FILE" 2>&1 &
SERVER_PID=$!

# Save PID
echo $SERVER_PID > "$PID_FILE"

# Wait a moment for server to start
sleep 2

# Check if process is still running
if ps -p $SERVER_PID > /dev/null 2>&1; then
    echo "✅ Dev server started successfully!"
    echo "📍 URL: http://localhost:3000"
    echo "🆔 PID: $SERVER_PID"
    echo "📋 Logs: tail -f $LOG_FILE"
    echo "🛑 Stop: /Applications/MAMP/htdocs/bimverdi/stop-dev.sh"
    echo ""
    echo "Server will continue running in the background..."
else
    echo "❌ Failed to start server. Check logs:"
    tail -20 "$LOG_FILE"
    rm -f "$PID_FILE"
    exit 1
fi
