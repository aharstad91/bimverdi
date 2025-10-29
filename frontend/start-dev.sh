#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting BimVerdi Development Environment${NC}"
echo ""

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo -e "${BLUE}📍 Working directory: $(pwd)${NC}"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    echo ""
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Check if port 3000 is in use
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 3000 is in use. Killing existing process...${NC}"
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    sleep 2
    echo -e "${GREEN}✓ Port 3000 is now free${NC}"
    echo ""
fi

# Clear Next.js cache (optional, comment out if not needed)
if [ -d ".next" ]; then
    echo -e "${YELLOW}🧹 Clearing Next.js cache...${NC}"
    rm -rf .next
    echo -e "${GREEN}✓ Cache cleared${NC}"
    echo ""
fi

# Start the development server with auto-restart
echo -e "${GREEN}✨ Starting Next.js with auto-restart enabled${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

node scripts/dev-server.js
