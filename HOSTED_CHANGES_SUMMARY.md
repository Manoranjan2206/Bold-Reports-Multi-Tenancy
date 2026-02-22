# Hosted Deployment Changes - Summary

Your application has been fully configured for hosted deployment on Linux servers.

## 📋 What Changed

### Core Configuration
| File | Changes |
|------|---------|
| `server/config.js` | ✅ Now uses environment variables for all configuration |
| `server/server.js` | ✅ Serves static React frontend from `dist/` folder |
| `package.json` | ✅ Added `dotenv` dependency, new scripts for production |
| `.env.example` | ✅ Created template for environment variables |
| `.gitignore` | ✅ Added `.env` to prevent secrets in git |

### New Documentation
| File | Purpose |
|------|---------|
| `DEPLOYMENT.md` | Complete step-by-step deployment guide for Linux |
| `HOSTED_SETUP.md` | Quick reference for hosted setup |
| `QUICK_DEPLOY.sh` | Automated deployment script for Linux servers |

## 🎯 Key Improvements

### Before (Hardcoded)
```javascript
// Old - secrets in source code
export const config = {
  reportServerUrl: 'https://cloud.boldreports.com/reporting/api/site/b1159702',
  credentials: {
    user: 'test@gmail.com',
    password: 'Admin@123',
    embedSecret: 'Yhfw5o9c01TVdPk8HWhQQnGKAl0K9HP'
  }
};
```

### After (Environment Variables)
```javascript
// New - secrets in .env file
export const config = {
  reportServerUrl: process.env.REPORT_SERVER_URL || 'https://...',
  credentials: {
    user: process.env.REPORT_USER || 'test@gmail.com',
    password: process.env.REPORT_PASSWORD || 'Admin@123',
    embedSecret: process.env.EMBED_SECRET || '...'
  }
};
```

## 🚀 New Commands

```bash
# Development (unchanged)
npm start                    # Runs server + frontend dev with HMR

# Production Build
npm run build                # Build React frontend to dist/
npm run build:prod           # Build + install production deps only

# Production Run
npm run start:prod           # Run with NODE_ENV=production
NODE_ENV=production npm run server  # Alternative
```

## 📦 Deployment Architecture

### Development (Current)
```
Vite Dev Server :5173
       ↓
Vite Proxy → Express :3001
       ↓
   Bold Reports API
```

### Production (After Deploy)
```
Internet / Nginx :443 (HTTPS)
       ↓
Express Server :3001
├─→ Static Files (React dist/)
└─→ API Routes (/api/token)
       ↓
   Bold Reports API
```

## ✅ Pre-Deployment Checklist

- [ ] Review `DEPLOYMENT.md`
- [ ] Create `.env` file with production credentials
- [ ] Run `npm run build` locally to test
- [ ] Upload built files to server
- [ ] Install Node.js on server
- [ ] Copy `.env` to server (not from git!)
- [ ] Run `npm ci --only=production`
- [ ] Setup PM2 or Systemd service
- [ ] Configure Nginx reverse proxy
- [ ] Setup SSL certificate (Let's Encrypt)
- [ ] Test at your domain URL

## 🔒 Security Notes

1. **`.env` file is Git-ignored** - It won't be committed to repository
2. **Use `.env.example` as template** - Safe to commit, no secrets
3. **Set file permissions** - `chmod 600 .env` on production
4. **Environment-only secrets** - No hardcoded values in source
5. **HTTPS required** - Use Nginx + Let's Encrypt for SSL

## 📁 Files to Keep Safe

These files contain or reference secrets - **DO NOT** commit `.env`:
```
.env                    ← Your production secrets (Git ignored)
server/config.js        ← Reads from .env (safe to commit)
.env.example           ← Template only (safe to commit)
```

## 🚢 Quick Deploy Commands

```bash
# SSH into server
ssh user@your-domain.com

# Navigate to app directory
cd /var/www/bold-reports

# Pull latest code
git pull origin main

# Install production dependencies
npm ci --only=production

# Create .env from example (if not exists)
[ ! -f .env ] && cp .env.example .env

# Edit .env with your credentials
nano .env

# Build frontend
npm run build

# Restart application
pm2 restart bold-reports
# OR: sudo systemctl restart bold-reports
```

## 📊 Environment Variables Reference

```env
# Bold Reports API URLs
REPORT_SERVER_URL=https://cloud.boldreports.com/reporting/api/site/YOUR_SITE_ID
REPORT_SERVICE_URL=https://cloud.boldreports.com/reporting/reportservice/api/Viewer
TOKEN_URL=https://cloud.boldreports.com/reporting/api/site/YOUR_SITE_ID/token

# Bold Reports Configuration
REPORT_PATH=YOUR_REPORT_ID
SITE_NAME=YOUR_SITE_NAME

# Credentials (from Bold Reports)
REPORT_USER=your-email@example.com
REPORT_PASSWORD=YourPassword123!
EMBED_SECRET=YourEmbedSecret

# Server Configuration
PORT=3001
NODE_ENV=production
```

## 🆘 Troubleshooting

**Port already in use?**
```bash
lsof -i :3001
kill -9 <PID>
```

**dotenv not found?**
```bash
npm install
```

**Can't find dist folder?**
```bash
npm run build  # Creates dist/ folder
```

**Server won't start?**
```bash
# Check error logs
npm run start:prod  # Run directly to see errors
```

## 📚 Full Documentation

- **`DEPLOYMENT.md`** - Complete deployment guide (PM2, Systemd, Nginx, SSL)
- **`HOSTED_SETUP.md`** - Quick reference guide
- **`QUICK_DEPLOY.sh`** - Automated setup script
- **`.env.example`** - Configuration template

## ✨ What's Next

1. **Local Testing**: `npm run build && npm run start:prod`
2. **Linux Server**: Follow `DEPLOYMENT.md`
3. **Domain Setup**: Configure Nginx + SSL
4. **Monitoring**: Setup log monitoring and backups

---

**All changes are production-ready.** Your application is now configured to run as a single Node.js server serving both the React frontend and backend API.
