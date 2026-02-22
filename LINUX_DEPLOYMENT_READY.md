# ✅ Linux Deployment - READY!

Your Bold Reports Multi-Tenancy application is now **fully prepared for Linux hosting**.

## 📦 What's New (Linux Deployment Files)

### 🚀 Deployment Scripts
- **`deploy.sh`** - Automated deployment preparation script
- **`LINUX_SETUP.md`** - Complete Linux setup guide

### 🐳 Container Support
- **`Dockerfile`** - Multi-stage Docker build
- **`docker-compose.yml`** - Docker Compose configuration
- **`.dockerignore`** - Docker build ignore file

### 🔧 Configuration Files
- **`ecosystem.config.js`** - PM2 configuration
- **`systemd/bold-reports.service`** - Systemd service file
- **`nginx/bold-reports.conf`** - Nginx reverse proxy config
- **`.env.production`** - Production environment template

### 📖 Documentation
- **`LINUX_SETUP.md`** - Complete step-by-step Linux guide

---

## ⚡ Quick Deployment (3 Steps)

### Step 1: Prepare Locally
```bash
chmod +x deploy.sh
./deploy.sh
```

### Step 2: Upload to Server
```bash
rsync -avz --exclude='node_modules' --exclude='.git' . user@server:/var/www/bold-reports/
```

### Step 3: Start on Server
```bash
# SSH into server
ssh user@server
cd /var/www/bold-reports

# Install production dependencies
npm ci --only=production

# Choose one of these:

# Option A: PM2
npm install -g pm2
pm2 start ecosystem.config.js --env production

# Option B: Systemd
sudo cp systemd/bold-reports.service /etc/systemd/system/
sudo systemctl enable bold-reports
sudo systemctl start bold-reports

# Option C: Docker
docker-compose up -d
```

---

## 🎯 Deployment Methods

| Method | Best For | Effort | Features |
|--------|----------|--------|----------|
| **PM2** | Small teams | Easy | Clustering, monitoring, auto-restart |
| **Systemd** | Enterprise | Medium | System-level control, journald logs |
| **Docker** | DevOps/Scaling | Medium | Isolation, easy updates, clustering |

---

## 📋 Complete Process

```
┌─────────────────────────────────────────────────────────┐
│ 1. LOCAL PREPARATION                                    │
│    ✓ Run deploy.sh script                              │
│    ✓ Test npm run start:prod                           │
│    ✓ Verify .env configuration                         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 2. UPLOAD TO SERVER                                     │
│    ✓ rsync or scp application files                    │
│    ✓ Copy .env.production → .env                       │
│    ✓ Update .env with credentials                      │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 3. INSTALL DEPENDENCIES                                 │
│    ✓ npm ci --only=production                          │
│    ✓ Verify Node.js version                            │
│    ✓ Check npm packages                                │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 4. START APPLICATION                                    │
│    Choose: PM2 / Systemd / Docker                      │
│    ✓ Start service/container                           │
│    ✓ Verify application running                        │
│    ✓ Check logs                                        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 5. CONFIGURE WEB SERVER                                 │
│    ✓ Install Nginx                                     │
│    ✓ Copy configuration                                │
│    ✓ Update domain name                                │
│    ✓ Test Nginx config                                 │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 6. SETUP SSL CERTIFICATE                                │
│    ✓ Install Certbot                                   │
│    ✓ Get Let's Encrypt certificate                     │
│    ✓ Enable auto-renewal                               │
│    ✓ Test HTTPS                                        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 7. TESTING & VERIFICATION                               │
│    ✓ Test application in browser                       │
│    ✓ Verify token generation                           │
│    ✓ Check logs for errors                             │
│    ✓ Performance testing                               │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 8. GO LIVE 🎉                                           │
│    ✓ Point DNS to server                               │
│    ✓ Monitor application                               │
│    ✓ Setup backups                                     │
│    ✓ Celebrate! 🚀                                     │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 File Organization

```
PROJECT ROOT:
├── deploy.sh                          ← Run this first!
├── .env.production                    ← Copy to .env on server
├── .env.example                       ← Template (reference)
├── LINUX_SETUP.md                     ← Complete setup guide
│
├── systemd/
│   └── bold-reports.service          ← For Systemd deployment
│
├── nginx/
│   └── bold-reports.conf             ← Nginx reverse proxy config
│
├── Docker files:
├── Dockerfile                         ← Multi-stage build
├── docker-compose.yml                 ← Docker Compose
├── .dockerignore                      ← Build ignore
│
├── PM2 config:
├── ecosystem.config.js                ← PM2 configuration
│
└── Application code (unchanged):
    ├── server/
    ├── src/
    ├── dist/                          ← Built frontend
    └── ...
```

---

## 🔒 Security Checklist

Before going live:

- [ ] .env file created with production credentials
- [ ] .env file permissions set: `chmod 600 .env`
- [ ] .env file not committed to git
- [ ] Firewall configured (UFW)
- [ ] SSH key-based authentication enabled
- [ ] Root login disabled
- [ ] SSL/HTTPS configured
- [ ] Nginx headers configured
- [ ] Regular backups planned
- [ ] Monitoring configured
- [ ] Log rotation configured
- [ ] fail2ban installed
- [ ] System updates installed

---

## 🚀 Launch Commands

### PM2 Method
```bash
npm install -g pm2
cd /var/www/bold-reports
npm ci --only=production
pm2 start ecosystem.config.js --env production
pm2 startup
pm2 save
```

### Systemd Method
```bash
sudo cp systemd/bold-reports.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable bold-reports
sudo systemctl start bold-reports
```

### Docker Method
```bash
docker-compose up -d
docker-compose logs -f bold-reports
```

---

## 📊 System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| OS | Ubuntu 20.04 | Ubuntu 22.04+ |
| Node.js | 16 | 18+ |
| RAM | 512MB | 2GB+ |
| Disk | 2GB | 10GB+ |
| CPU | 1 core | 2+ cores |

---

## 📈 Scaling Options

### Single Server
```
1 Server
├─ Node.js App
├─ Nginx Proxy
└─ Bold Reports API
```

### Multiple Servers (Load Balanced)
```
Load Balancer (Nginx/HAProxy)
├─ Node.js Server 1
├─ Node.js Server 2
└─ Node.js Server N
    ↓
Bold Reports API
```

### Kubernetes (Container Orchestration)
```
Kubernetes Cluster
├─ Pod 1: bold-reports
├─ Pod 2: bold-reports
├─ Pod N: bold-reports
├─ Service (Load Balancer)
└─ Ingress (Nginx/HTTPS)
    ↓
Bold Reports API
```

---

## 🆘 Troubleshooting

### Application Won't Start
1. Check .env file exists: `cat .env`
2. Check permissions: `ls -la .env`
3. Check logs: `pm2 logs bold-reports`
4. Test manually: `node server/server.js`

### Nginx Not Connecting
1. Check config: `sudo nginx -t`
2. Check Express running: `curl http://localhost:3001`
3. View error logs: `sudo tail -f /var/log/nginx/error.log`

### SSL Certificate Issues
1. Verify certificate: `sudo ls -la /etc/letsencrypt/live/`
2. Check renewal: `sudo certbot certificates`
3. Renew manually: `sudo certbot renew`

See `LINUX_SETUP.md` for more troubleshooting.

---

## 📞 Support & Resources

- **LINUX_SETUP.md** - Complete step-by-step guide
- **deploy.sh** - Automated preparation script
- **DEPLOYMENT_CHECKLIST.md** - Detailed checklist
- **Bold Reports Support**: https://support.boldreports.com/

---

## ✨ Key Files You'll Use

| Frequency | File | Purpose |
|-----------|------|---------|
| Once | `deploy.sh` | Initial preparation |
| Once | `.env.production` | Copy to `.env` |
| Ongoing | `ecosystem.config.js` | PM2 management |
| Ongoing | `systemd/bold-reports.service` | Systemd management |
| Reference | `nginx/bold-reports.conf` | Nginx config |
| Reference | `LINUX_SETUP.md` | Setup guide |

---

## 🎯 Next Steps

1. **Locally**: Run `chmod +x deploy.sh && ./deploy.sh`
2. **Verify**: Check output looks good
3. **Upload**: `rsync --exclude='node_modules' . user@server:/var/www/bold-reports/`
4. **Server**: SSH in and follow `LINUX_SETUP.md`
5. **Configure**: Set .env, Nginx, SSL
6. **Test**: Verify everything works
7. **Launch**: Go live! 🚀

---

## 📊 Summary

✅ **Application Prepared**: Yes  
✅ **Docker Support**: Yes  
✅ **PM2 Config**: Yes  
✅ **Systemd Service**: Yes  
✅ **Nginx Config**: Yes  
✅ **Documentation**: Yes  
✅ **Deployment Script**: Yes  
✅ **Security Hardening**: Ready  

**Status**: 🟢 **READY FOR LINUX DEPLOYMENT**

---

**Ready to deploy?** Start with:
```bash
chmod +x deploy.sh
./deploy.sh
```

Then follow `LINUX_SETUP.md` for complete deployment.

Good luck! 🚀
