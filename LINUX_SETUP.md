# Linux Setup Guide - Bold Reports Multi-Tenancy

Complete guide for setting up your application on a Linux server.

## 📋 Prerequisites

- Ubuntu 20.04+ or Debian 11+
- SSH access to server
- sudo privileges
- Domain name (for SSL)
- Bold Reports API credentials

## 🚀 Quick Start (30 minutes)

```bash
# 1. Run the deployment script
chmod +x deploy.sh
./deploy.sh

# 2. Upload to server
rsync -avz --exclude='node_modules' --exclude='.git' . user@server:/var/www/bold-reports/

# 3. SSH into server and complete deployment
ssh user@server
cd /var/www/bold-reports

# 4. Install production dependencies
npm ci --only=production

# 5. Start with PM2 or Systemd (see below)
```

## 🛠️ Installation Methods

### Method 1: PM2 (Easiest)

#### Install PM2
```bash
sudo npm install -g pm2
pm2 --version
```

#### Start Application
```bash
pm2 start ecosystem.config.js --env production
pm2 startup
pm2 save
```

#### Manage with PM2
```bash
pm2 status              # Check status
pm2 logs bold-reports   # View logs
pm2 restart all         # Restart
pm2 stop all            # Stop
pm2 delete all          # Remove
```

---

### Method 2: Systemd Service (Recommended for Production)

#### Copy Service File
```bash
sudo cp systemd/bold-reports.service /etc/systemd/system/
sudo systemctl daemon-reload
```

#### Enable and Start
```bash
sudo systemctl enable bold-reports
sudo systemctl start bold-reports
sudo systemctl status bold-reports
```

#### Manage with Systemd
```bash
sudo systemctl status bold-reports       # Check status
sudo journalctl -u bold-reports -f      # View logs
sudo systemctl restart bold-reports     # Restart
sudo systemctl stop bold-reports        # Stop
```

---

### Method 3: Docker (Recommended for Scalability)

#### Install Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker
```

#### Build and Run
```bash
# Build image
docker build -t bold-reports:latest .

# Run container
docker run -d \
  --name bold-reports \
  --env-file .env \
  -p 3001:3001 \
  --restart unless-stopped \
  bold-reports:latest
```

#### Docker Compose (Easier)
```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f bold-reports

# Stop
docker-compose down
```

---

## 🌐 Nginx Configuration

### Install Nginx
```bash
sudo apt-get update
sudo apt-get install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Configure Nginx
```bash
# Copy configuration
sudo cp nginx/bold-reports.conf /etc/nginx/sites-available/

# Enable site
sudo ln -s /etc/nginx/sites-available/bold-reports.conf /etc/nginx/sites-enabled/

# Disable default site (optional)
sudo rm -f /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Edit Domain Name
```bash
# Edit the Nginx config and replace your-domain.com
sudo nano /etc/nginx/sites-available/bold-reports.conf

# Find and replace:
# - your-domain.com (appears twice)
# - www.your-domain.com
```

---

## 🔒 SSL Configuration (Let's Encrypt)

### Install Certbot
```bash
sudo apt-get install -y certbot python3-certbot-nginx
```

### Get Certificate
```bash
# First time
sudo certbot certonly --nginx -d your-domain.com -d www.your-domain.com

# Or using standalone (if Nginx not running)
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com
```

### Update Nginx Config
```bash
# The Certbot should update Nginx automatically
# Verify in /etc/nginx/sites-available/bold-reports.conf

# Check certificate files
sudo ls -la /etc/letsencrypt/live/your-domain.com/
```

### Auto-Renewal
```bash
# Check renewal status
sudo systemctl status certbot.timer

# Or enable if not active
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

## 📁 Directory Structure on Server

```
/var/www/bold-reports/
├── server/
│   ├── server.js
│   └── config.js
├── dist/                   (React build)
├── node_modules/           (Production only)
├── .env                    (Production config - SECURE!)
├── package.json
├── ecosystem.config.js     (PM2 config)
└── ...
```

---

## 🔐 Security Hardening

### Set File Permissions
```bash
# Application directory
sudo chown -R www-data:www-data /var/www/bold-reports
sudo chmod 755 /var/www/bold-reports

# Environment file (VERY IMPORTANT)
sudo chmod 600 /var/www/bold-reports/.env
sudo chown www-data:www-data /var/www/bold-reports/.env
```

### Firewall Configuration
```bash
# Enable UFW firewall
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Block port 3001 (Express internal)
# (already handled by Nginx reverse proxy)

# Check status
sudo ufw status
```

### System Hardening
```bash
# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install fail2ban (prevent brute-force)
sudo apt-get install -y fail2ban
sudo systemctl enable fail2ban
```

---

## 📊 Monitoring

### PM2 Monitoring
```bash
# Monitor in real-time
pm2 monit

# Or with status
pm2 status

# View logs
pm2 logs bold-reports

# Streaming logs
pm2 logs bold-reports --lines 100 --stream
```

### Systemd Monitoring
```bash
# View logs
sudo journalctl -u bold-reports -f

# Last 100 lines
sudo journalctl -u bold-reports -n 100

# Today's logs
sudo journalctl -u bold-reports --since today

# Time range
sudo journalctl -u bold-reports --since "2024-02-01" --until "2024-02-22"
```

### Log Rotation
```bash
# Create logrotate config
sudo nano /etc/logrotate.d/bold-reports
```

Add:
```
/var/www/bold-reports/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        # Restart app if using PM2
        pm2 restart bold-reports > /dev/null 2>&1 || true
    endscript
}
```

---

## 🔄 Backup Strategy

### Backup Application
```bash
# Create backup directory
mkdir -p /backups/bold-reports

# Backup application (excluding node_modules)
rsync -av --exclude='node_modules' --exclude='.git' /var/www/bold-reports/ /backups/bold-reports/

# Or using tar
tar --exclude='node_modules' --exclude='.git' -czf /backups/bold-reports-$(date +%Y%m%d).tar.gz /var/www/bold-reports/
```

### Backup .env (CRITICAL!)
```bash
# SECURE backup of credentials
sudo cp /var/www/bold-reports/.env /backups/.env-$(date +%Y%m%d).backup
sudo chmod 600 /backups/.env-*.backup

# Store backup securely (consider encrypted storage)
```

### Automated Backup
```bash
# Add to crontab
crontab -e

# Add this line for daily backup at 2 AM
0 2 * * * rsync -av --exclude='node_modules' /var/www/bold-reports /backups/ >> /var/log/bold-reports-backup.log 2>&1
```

---

## 🧪 Testing

### Test Server Connectivity
```bash
# SSH into server
ssh user@server

# Check if server is running
curl http://localhost:3001

# Check if responsive
curl -v http://localhost:3001
```

### Test API Endpoint
```bash
# Test token endpoint
curl -X POST http://localhost:3001/api/token \
  -H "Content-Type: application/json" \
  -d '{"tenantId": 1, "userId": 5}'

# Should return token response
```

### Test through Nginx
```bash
# HTTP redirect
curl -I http://your-domain.com

# HTTPS
curl -I https://your-domain.com

# Should get 200 OK
```

### Test in Browser
```
1. Open https://your-domain.com
2. Verify page loads
3. Check browser console for errors
4. Test token generation
5. Verify report viewer works
```

---

## 🐛 Troubleshooting

### Port 3001 Already in Use
```bash
# Find process using port
sudo lsof -i :3001

# Kill process
sudo kill -9 <PID>

# Or use fuser
sudo fuser -k 3001/tcp
```

### Nginx Not Connecting
```bash
# Check Nginx config
sudo nginx -t

# Check if Express is running
curl http://localhost:3001

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check Nginx access logs
sudo tail -f /var/log/nginx/access.log
```

### Application Won't Start
```bash
# Check .env file
cat /var/www/bold-reports/.env

# Check permissions
ls -la /var/www/bold-reports/.env

# Check for errors
node server/server.js

# View logs
pm2 logs bold-reports
# OR
sudo journalctl -u bold-reports -f
```

### SSL Certificate Issues
```bash
# Check certificate
sudo openssl x509 -in /etc/letsencrypt/live/your-domain.com/cert.pem -text -noout

# Renew certificate (test)
sudo certbot renew --dry-run

# Renew certificate (force)
sudo certbot renew --force-renewal

# Check renewal status
sudo certbot certificates
```

---

## 🔄 Updates & Maintenance

### Update Application
```bash
cd /var/www/bold-reports

# Pull latest code
git pull origin main

# Install dependencies
npm ci --only=production

# Build frontend
npm run build

# Restart application
pm2 restart bold-reports
# OR
sudo systemctl restart bold-reports
```

### Update Node.js
```bash
# Check current version
node --version

# Update Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Restart application
pm2 restart bold-reports
```

### Update System
```bash
# Update package lists
sudo apt-get update

# Upgrade packages
sudo apt-get upgrade -y

# Reboot if needed
sudo reboot
```

---

## 📝 Deployment Checklist

- [ ] Server prepared (Ubuntu 20.04+, Node.js installed)
- [ ] Application uploaded to server
- [ ] .env file created with credentials
- [ ] npm ci --only=production completed
- [ ] Application starts successfully
- [ ] Process manager configured (PM2 or Systemd)
- [ ] Nginx installed and configured
- [ ] Domain name configured in Nginx
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] SSL renewal automated
- [ ] Monitoring configured
- [ ] Backups configured
- [ ] Logs monitored
- [ ] Application tested in browser
- [ ] Performance verified
- [ ] Monitoring active

---

## 📞 Support & Resources

- **Bold Reports Docs**: https://support.boldreports.com/
- **Node.js Docs**: https://nodejs.org/docs/
- **Express Docs**: https://expressjs.com/
- **Nginx Docs**: https://nginx.org/en/docs/
- **Certbot Docs**: https://certbot.eff.org/docs/
- **PM2 Docs**: https://pm2.keymetrics.io/

---

## ✨ Next Steps

1. Run: `chmod +x deploy.sh && ./deploy.sh`
2. Upload application to server
3. SSH into server
4. Choose installation method (PM2, Systemd, or Docker)
5. Configure Nginx
6. Setup SSL
7. Test and go live!

Good luck! 🚀
