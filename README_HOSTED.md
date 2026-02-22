# Bold Reports Multi-Tenancy - Hosted Deployment Ready ✅

Your application is now fully configured for production deployment on Linux servers.

## 📚 Documentation Overview

### Getting Started
| Document | Purpose |
|----------|---------|
| **README.md** | Original project README |
| **HOSTED_SETUP.md** | Quick reference for hosted deployment |
| **HOSTED_CHANGES_SUMMARY.md** | What changed for hosted support |

### Detailed Guides
| Document | Purpose |
|----------|---------|
| **DEPLOYMENT.md** | Complete step-by-step deployment guide (PM2, Systemd, Nginx, SSL) |
| **ARCHITECTURE.md** | System architecture and data flow diagrams |
| **QUICK_DEPLOY.sh** | Automated deployment script for Linux |

## 🚀 Quick Start (5 minutes)

### 1. Local Build Test
```bash
npm install
npm run build
npm run start:prod
```
Visit `http://localhost:3001`

### 2. Prepare for Server
```bash
cp .env.example .env
# Edit .env with your production credentials
nano .env
```

### 3. Deploy to Linux Server
```bash
# Follow DEPLOYMENT.md for detailed steps
# Quick version:
scp -r . user@server:/var/www/bold-reports
ssh user@server
cd /var/www/bold-reports
npm install
npm run build:prod
pm2 start server/server.js --name bold-reports
```

## 🎯 What's New

### Configuration
- ✅ Environment-based configuration (no hardcoded secrets)
- ✅ `.env` file for production credentials
- ✅ `.env.example` template for safe sharing
- ✅ Automatic SPA routing for React

### Scripts
```json
{
  "npm start": "Run dev server + frontend (original)",
  "npm run build": "Build React frontend",
  "npm run start:prod": "Run production server",
  "npm run build:prod": "Build + production dependencies"
}
```

### Files Changed
```
server/config.js       ← Now uses environment variables
server/server.js       ← Now serves React frontend + SPA routing
package.json           ← Added dotenv, new scripts
.env.example           ← Template for environment variables
.gitignore             ← Prevents .env from being committed
```

### New Documentation
```
DEPLOYMENT.md                    ← Full deployment guide
HOSTED_SETUP.md                 ← Quick reference
HOSTED_CHANGES_SUMMARY.md       ← What changed
ARCHITECTURE.md                 ← System architecture
QUICK_DEPLOY.sh                 ← Automated setup script
README_HOSTED.md               ← This file
```

## 📋 Environment Variables

Create `.env` file in project root:

```env
# Bold Reports API
REPORT_SERVER_URL=https://cloud.boldreports.com/reporting/api/site/YOUR_SITE_ID
REPORT_SERVICE_URL=https://cloud.boldreports.com/reporting/reportservice/api/Viewer
TOKEN_URL=https://cloud.boldreports.com/reporting/api/site/YOUR_SITE_ID/token
REPORT_PATH=YOUR_REPORT_ID
SITE_NAME=YOUR_SITE_NAME

# Credentials
REPORT_USER=your-email@example.com
REPORT_PASSWORD=YourSecurePassword
EMBED_SECRET=YourEmbedSecret

# Server
PORT=3001
NODE_ENV=production
```

## 🔒 Security

- ✅ `.env` is Git-ignored (won't commit secrets)
- ✅ No hardcoded credentials in source code
- ✅ Uses environment variables (production standard)
- ✅ HTTPS/SSL setup included in guides
- ✅ Secure token handling

## 🚢 Deployment Options

### PM2 (Recommended - Simplest)
```bash
npm install -g pm2
pm2 start server/server.js --name bold-reports
pm2 startup && pm2 save
```

### Systemd (Linux Service)
```bash
sudo cp systemd/bold-reports.service /etc/systemd/system/
sudo systemctl enable bold-reports
sudo systemctl start bold-reports
```

### Docker (Container)
```bash
docker build -t bold-reports .
docker run -p 3001:3001 --env-file .env bold-reports
```

See **DEPLOYMENT.md** for detailed instructions.

## 🌐 Nginx Reverse Proxy

Configure Nginx to proxy requests to your Node.js server:

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Full guide: **DEPLOYMENT.md**

## 📊 Architecture

### Development
```
User Browser
    ↓
Vite Dev Server :5173 (with HMR)
    ↓
Vite Proxy → Express :3001
    ↓
Bold Reports API
```

### Production
```
User Browser (HTTPS)
    ↓
Nginx Reverse Proxy :443
    ↓
Node.js Express :3001
├─ Serves React Frontend
└─ Handles /api endpoints
    ↓
Bold Reports API
```

Full architecture: **ARCHITECTURE.md**

## ✅ Pre-Flight Checklist

Before deploying to production:

- [ ] Test locally: `npm run build && npm run start:prod`
- [ ] Create `.env` with production credentials
- [ ] Review `DEPLOYMENT.md` for your platform
- [ ] Have Linux server ready (Ubuntu 20.04+)
- [ ] Have Node.js 16+ on server
- [ ] Have domain name registered
- [ ] Have SSL certificate ready (or use Let's Encrypt)
- [ ] Test Nginx reverse proxy configuration
- [ ] Setup monitoring/logging
- [ ] Plan backup strategy

## 🆘 Common Issues

### "Cannot find dist folder"
```bash
npm run build  # Creates dist/
```

### "Port 3001 already in use"
```bash
lsof -i :3001  # Find process
kill -9 <PID>   # Kill process
```

### "dotenv not found"
```bash
npm install
```

### "Express won't start"
```bash
npm run start:prod  # Run directly to see errors
```

See **DEPLOYMENT.md** troubleshooting section for more.

## 📈 Performance Tips

1. **Enable Gzip compression** (Nginx config included)
2. **Cache static assets** (Nginx config included)
3. **Use CDN** for static files (optional)
4. **Monitor server resources** (logs, CPU, memory)
5. **Setup auto-restart** (PM2 or Systemd)
6. **Regular backups** of application data

## 🔄 Continuous Deployment

To update your application after deployment:

```bash
cd /var/www/bold-reports
git pull origin main
npm install
npm run build
pm2 restart bold-reports
# OR: sudo systemctl restart bold-reports
```

## 📞 Support Resources

- **Bold Reports Docs**: https://support.boldreports.com/
- **Node.js Docs**: https://nodejs.org/docs/
- **Express Docs**: https://expressjs.com/
- **Nginx Docs**: https://nginx.org/en/docs/
- **Let's Encrypt**: https://letsencrypt.org/

## 🎓 Learning Path

1. **Start Here**: Read this file (README_HOSTED.md)
2. **Quick Setup**: Read HOSTED_SETUP.md
3. **Test Locally**: `npm run build && npm run start:prod`
4. **Understand Architecture**: Read ARCHITECTURE.md
5. **Deploy**: Follow DEPLOYMENT.md
6. **Go Live**: Setup Nginx + SSL

## 📦 What's Included

```
bold-reports-multi-tenancy/
├── README.md                          (Original README)
├── README_HOSTED.md                   (This file)
├── HOSTED_SETUP.md                    (Quick reference)
├── HOSTED_CHANGES_SUMMARY.md          (What changed)
├── DEPLOYMENT.md                      (Full deployment guide)
├── ARCHITECTURE.md                    (System design)
├── QUICK_DEPLOY.sh                    (Auto-deploy script)
│
├── src/                               (React frontend)
│   ├── App.tsx
│   ├── components/
│   │   ├── dashboard/ReportViewer.tsx
│   │   └── layout/
│   └── ...
│
├── server/                            (Express backend)
│   ├── server.js                      (✨ Updated for production)
│   └── config.js                      (✨ Environment variables)
│
├── dist/                              (Built React - created by npm run build)
│
├── .env.example                       (✨ Configuration template)
├── .gitignore                         (✨ Updated for .env)
├── package.json                       (✨ New scripts)
└── ...
```

## 🎉 You're Ready!

Your application is production-ready. Next steps:

1. Test locally: `npm run build && npm run start:prod`
2. Read DEPLOYMENT.md for your hosting platform
3. Follow the deployment steps
4. Configure Nginx and SSL
5. Go live! 🚀

---

**Questions?** Check the detailed guides or visit https://support.boldreports.com/

**Last Updated**: February 21, 2026
**Version**: Production Ready v1.0
