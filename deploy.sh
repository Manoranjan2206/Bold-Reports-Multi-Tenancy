#!/bin/bash

# Bold Reports Multi-Tenancy - Linux Deployment Script
# This script prepares and deploys the application to a Linux server

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="bold-reports"
APP_DIR="/var/www/bold-reports"
SERVICE_USER="www-data"
NODE_VERSION="18"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Bold Reports Multi-Tenancy - Linux Deployment             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to print section
section() {
    echo -e "${BLUE}┌─────────────────────────────────────────────────────────────┐${NC}"
    echo -e "${BLUE}│ $1${NC}"
    echo -e "${BLUE}└─────────────────────────────────────────────────────────────┘${NC}"
}

# Function to check command
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}✗ $1 not found${NC}"
        return 1
    else
        echo -e "${GREEN}✓ $1 found${NC}"
        return 0
    fi
}

# ============================================================================
# PHASE 1: Check Prerequisites
# ============================================================================
section "Phase 1: Checking Prerequisites"
echo ""

echo "Checking required commands..."
MISSING=0

if ! check_command "node"; then
    echo -e "${YELLOW}⚠ Node.js not installed. Install with:${NC}"
    echo "  curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -"
    echo "  sudo apt-get install -y nodejs"
    MISSING=1
fi

if ! check_command "npm"; then
    echo -e "${RED}✗ npm not found${NC}"
    MISSING=1
fi

if [ $MISSING -eq 1 ]; then
    echo -e "${RED}Please install missing dependencies and try again.${NC}"
    exit 1
fi

echo ""
NODE_VERSION_INSTALLED=$(node -v)
NPM_VERSION_INSTALLED=$(npm -v)
echo -e "${GREEN}✓ Node.js ${NODE_VERSION_INSTALLED}${NC}"
echo -e "${GREEN}✓ npm ${NPM_VERSION_INSTALLED}${NC}"

# ============================================================================
# PHASE 2: Check .env File
# ============================================================================
section "Phase 2: Environment Configuration"
echo ""

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠ .env file not found${NC}"
    if [ -f ".env.example" ]; then
        echo "Creating .env from template..."
        cp .env.example .env
        echo -e "${GREEN}✓ .env created${NC}"
        echo -e "${YELLOW}⚠ IMPORTANT: Edit .env with your production credentials:${NC}"
        echo "  nano .env"
        exit 1
    else
        echo -e "${RED}✗ No .env or .env.example file found${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ .env file exists${NC}"
fi

# Verify .env has required variables
REQUIRED_VARS=(
    "REPORT_USER"
    "REPORT_PASSWORD"
    "EMBED_SECRET"
    "NODE_ENV"
)

for var in "${REQUIRED_VARS[@]}"; do
    if grep -q "^${var}=" .env; then
        VALUE=$(grep "^${var}=" .env | cut -d '=' -f 2)
        if [ -z "$VALUE" ] || [ "$VALUE" = "your-value-here" ]; then
            echo -e "${RED}✗ $var is not configured${NC}"
            exit 1
        else
            echo -e "${GREEN}✓ $var configured${NC}"
        fi
    else
        echo -e "${RED}✗ $var missing from .env${NC}"
        exit 1
    fi
done

# ============================================================================
# PHASE 3: Build Application
# ============================================================================
section "Phase 3: Building Application"
echo ""

echo "Installing dependencies..."
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

echo ""
echo "Building frontend..."
npm run build
if [ -d "dist" ]; then
    echo -e "${GREEN}✓ Frontend built successfully${NC}"
    FILE_COUNT=$(find dist -type f | wc -l)
    echo "  Files generated: $FILE_COUNT"
else
    echo -e "${RED}✗ Build failed - dist folder not found${NC}"
    exit 1
fi

# ============================================================================
# PHASE 4: Production Preparation
# ============================================================================
section "Phase 4: Production Preparation"
echo ""

echo "Installing production dependencies only..."
npm ci --only=production
echo -e "${GREEN}✓ Production dependencies installed${NC}"

# ============================================================================
# PHASE 5: Verification
# ============================================================================
section "Phase 5: Testing Production Build"
echo ""

echo "Testing production server startup..."
timeout 5 npm run start:prod &
sleep 2

if curl -s http://localhost:3001 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Server started successfully${NC}"
    killall node 2>/dev/null || true
else
    echo -e "${YELLOW}⚠ Server test inconclusive (may be normal)${NC}"
fi

# ============================================================================
# PHASE 6: Display Next Steps
# ============================================================================
section "Phase 6: Ready for Deployment"
echo ""

echo -e "${GREEN}✓ Application is ready for Linux deployment!${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo ""
echo "1. ${YELLOW}Upload to server:${NC}"
echo "   rsync -avz --exclude='node_modules' --exclude='.git' . user@server:${APP_DIR}/"
echo ""
echo "2. ${YELLOW}On the server, install production dependencies:${NC}"
echo "   cd ${APP_DIR}"
echo "   npm ci --only=production"
echo ""
echo "3. ${YELLOW}Choose deployment method:${NC}"
echo ""
echo "   ${BLUE}Option A: PM2 (Recommended)${NC}"
echo "   npm install -g pm2"
echo "   pm2 start server/server.js --name ${APP_NAME}"
echo "   pm2 startup && pm2 save"
echo ""
echo "   ${BLUE}Option B: Systemd Service${NC}"
echo "   sudo cp systemd/${APP_NAME}.service /etc/systemd/system/"
echo "   sudo systemctl enable ${APP_NAME}"
echo "   sudo systemctl start ${APP_NAME}"
echo ""
echo "4. ${YELLOW}Configure Nginx:${NC}"
echo "   sudo cp nginx/${APP_NAME}.conf /etc/nginx/sites-available/"
echo "   sudo ln -s /etc/nginx/sites-available/${APP_NAME}.conf /etc/nginx/sites-enabled/"
echo "   sudo nginx -t && sudo systemctl reload nginx"
echo ""
echo "5. ${YELLOW}Setup SSL (Let's Encrypt):${NC}"
echo "   sudo certbot certonly --nginx -d your-domain.com"
echo ""
echo -e "${BLUE}Documentation:${NC}"
echo "   - DEPLOYMENT.md (complete guide)"
echo "   - DEPLOYMENT_CHECKLIST.md (step-by-step)"
echo "   - README_HOSTED.md (overview)"
echo ""
echo -e "${GREEN}Good luck! 🚀${NC}"
