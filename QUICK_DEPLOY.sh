#!/bin/bash
# Quick Deployment Script for Bold Reports Multi-Tenancy
# Run this on your Linux server

set -e

echo "🚀 Bold Reports Multi-Tenancy - Quick Deploy Script"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js not found. Installing Node.js 18...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓${NC} Node.js ${NODE_VERSION} found"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${BLUE}⚠️  Edit .env file with your production credentials${NC}"
    echo "   nano .env"
    exit 1
else
    echo -e "${GREEN}✓${NC} .env file exists"
fi

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install

# Build frontend
echo -e "${BLUE}Building frontend...${NC}"
npm run build

# Install production dependencies only
echo -e "${BLUE}Installing production dependencies...${NC}"
npm ci --only=production

echo -e "${GREEN}✓ Build complete!${NC}"
echo ""
echo -e "${BLUE}Deploy using one of these methods:${NC}"
echo ""
echo "1. PM2 (Recommended):"
echo "   npm install -g pm2"
echo "   pm2 start server/server.js --name 'bold-reports'"
echo "   pm2 startup && pm2 save"
echo ""
echo "2. Systemd Service:"
echo "   sudo cp bold-reports.service /etc/systemd/system/"
echo "   sudo systemctl daemon-reload"
echo "   sudo systemctl enable bold-reports"
echo "   sudo systemctl start bold-reports"
echo ""
echo "3. Docker (if available):"
echo "   docker build -t bold-reports ."
echo "   docker run -p 3001:3001 --env-file .env bold-reports"
echo ""
echo -e "${YELLOW}Next: Configure Nginx reverse proxy and SSL${NC}"
echo "See DEPLOYMENT.md for detailed instructions"
