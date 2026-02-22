# Hosted Deployment Setup - Summary

This application is now configured for hosted deployment. Here's what changed:

## ✅ Changes Made

### 1. **Environment-Based Configuration** (`server/config.js`)
- Configuration now uses environment variables instead of hardcoded values
- Falls back to defaults if environment variables are not set
- Includes `port` and `nodeEnv` settings

**Environment Variables Supported:**
```
REPORT_SERVER_URL
REPORT_SERVICE_URL
TOKEN_URL
REPORT_PATH
SITE_NAME
REPORT_USER
REPORT_PASSWORD
EMBED_SECRET
PORT
NODE_ENV
```

### 2. **Production Server Setup** (`server/server.js`)
- Added support for serving static React frontend
- Configured SPA fallback (all routes → index.html)
- Uses `dotenv` to load environment variables
- Serves built files from `dist/` folder
- Logs Node environment on startup

### 3. **Package.json Updates**
Added new scripts:
- `npm run start:prod` - Run in production mode
- `npm run build:prod` - Build and install only production dependencies

Added dependency:
- `dotenv` - For environment variable management

### 4. **Environment Files**
- **`.env.example`** - Template for configuration (safe to commit)
- **`.env`** - Your actual secrets (Git ignored, create locally)
- **`.gitignore`** - Updated to exclude `.env` files

### 5. **Deployment Guide** (`DEPLOYMENT.md`)
Complete guide for deploying to Linux:
- Environment setup
- Build process
- PM2 or Systemd service configuration
- Nginx reverse proxy setup
- SSL/HTTPS configuration
- Monitoring and maintenance
- Security best practices

## 🚀 Quick Start for Hosted Environment

### Local Development (unchanged)
```bash
npm start              # Runs both server and frontend dev
```

### Production Deployment

```bash
# 1. Build the application
npm run build

# 2. Copy and configure environment variables
cp .env.example .env
# Edit .env with your production credentials

# 3. Install production dependencies only
npm ci --only=production

# 4. Start the server (uses dist/ folder)
npm run start:prod

# Server runs on http://localhost:3001
# Both frontend and backend served from single Node process
```

## 📁 File Structure After Build

```
bold-reports-multi-tenancy/
├── server/
│   ├── server.js           (Express server + static file serving)
│   └── config.js           (Environment-based configuration)
├── dist/                   (Built React frontend - created by npm run build)
├── node_modules/
├── package.json
├── .env                    (Local - Git ignored)
├── .env.example            (Template - Safe to commit)
└── DEPLOYMENT.md           (Production deployment guide)
```

## 🔧 Environment Setup Example

Create `.env` file with your production values:

```env
# Bold Reports API Configuration
REPORT_SERVER_URL=https://cloud.boldreports.com/reporting/api/site/YOUR_SITE_ID
REPORT_SERVICE_URL=https://cloud.boldreports.com/reporting/reportservice/api/Viewer
TOKEN_URL=https://cloud.boldreports.com/reporting/api/site/YOUR_SITE_ID/token
REPORT_PATH=YOUR_REPORT_ID
SITE_NAME=YOUR_SITE_NAME

# Bold Reports Credentials
REPORT_USER=your-email@boldreports.com
REPORT_PASSWORD=SecurePassword123!
EMBED_SECRET=YourEmbedSecretKey

# Server Configuration
PORT=3001
NODE_ENV=production
```

## 🔒 Security Features

1. ✅ Secrets stored in `.env` (Git ignored)
2. ✅ No hardcoded credentials in source code
3. ✅ Environment variables used for all configuration
4. ✅ Template `.env.example` shows structure without secrets
5. ✅ Production deployment guide includes SSL/HTTPS setup

## 📦 Single Server Architecture

After build, the entire application runs from **one Node.js process**:

```
Internet
    ↓
Nginx (Reverse Proxy) - http://domain.com
    ↓
Node.js (Port 3001)
├─→ Serves React Frontend (from dist/)
└─→ Handles /api/* routes (Express backend)
```

## 🚢 Deployment Options

See `DEPLOYMENT.md` for detailed setup with:
- **PM2** (Process Manager) - Recommended for simplicity
- **Systemd** (Linux Service) - System-level control
- **Nginx** - Reverse proxy configuration
- **Let's Encrypt** - Free SSL certificates
- **Monitoring** - Logs and health checks

## ✨ What Stays the Same

- Frontend React code unchanged
- ReportViewer component unchanged
- API endpoints unchanged (`/api/token`)
- Local development workflow unchanged (`npm start`)
- All existing features working as before

## 🎯 Next Steps

1. **Review** `DEPLOYMENT.md` for your hosting platform
2. **Create** `.env` file with production credentials
3. **Run** `npm run build` to create production build
4. **Deploy** to your Linux server following the guide
5. **Configure** Nginx and SSL
6. **Monitor** application logs

---

**Questions?** Check `DEPLOYMENT.md` or visit https://support.boldreports.com/
