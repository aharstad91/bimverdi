#!/bin/bash

# Check Next.js development server status

PID_FILE="/Applications/MAMP/htdocs/bimverdi/frontend/dev-server.pid"
LOG_FILE="/Applications/MAMP/htdocs/bimverdi/frontend/dev-server.log"

echo "🔍 Checking dev server status..."
echo ""

if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")

    if ps -p $PID > /dev/null 2>&1; then
        echo "✅ Server is RUNNING"
        echo "🆔 PID: $PID"
        echo "📍 URL: http://localhost:3000"
        echo "📋 Log file: $LOG_FILE"
        echo ""
        echo "Recent logs:"
        echo "─────────────────────────────────────"
        tail -10 "$LOG_FILE"
        echo "─────────────────────────────────────"
        echo ""
        echo "Commands:"
        echo "  View logs: tail -f $LOG_FILE"
        echo "  Stop server: /Applications/MAMP/htdocs/bimverdi/stop-dev.sh"
    else
        echo "❌ Server is NOT running (stale PID file)"
        rm -f "$PID_FILE"
    fi
else
    echo "❌ Server is NOT running"
    echo ""
    echo "Start server: /Applications/MAMP/htdocs/bimverdi/start-dev.sh"
fi
