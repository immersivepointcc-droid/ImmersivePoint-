#!/bin/bash
cd "$(dirname "$0")"

echo ""
echo "  Starting ImmersivePoint Platform..."
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "  ERROR: Node.js is not installed."
    echo "  Download it from https://nodejs.org"
    echo ""
    read -p "  Press Enter to exit..."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "  Installing dependencies..."
    npm install
    echo ""
fi

# Open browser after a short delay
(sleep 2 && open "http://localhost:3000") &

# Start the server
node server.js
