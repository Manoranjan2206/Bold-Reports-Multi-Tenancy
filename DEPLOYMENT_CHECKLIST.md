# Deployment Checklist - Bold Reports Multi-Tenancy

Use this checklist to ensure a smooth production deployment.

## 🔵 Phase 1: Pre-Deployment (Local Testing)

### Configuration
- [ ] Copy `.env.example` to `.env`
- [ ] Update `.env` with production credentials:
  - [ ] `REPORT_USER`
  - [ ] `REPORT_PASSWORD`
  - [ ] `EMBED_SECRET`
  - [ ] `REPORT_SERVER_URL` (if different)
  - [ ] `TOKEN_URL` (if different)
  - [ ] `REPORT_PATH` (if different)
  - [ ] Set `NODE_ENV=production`
- [ ] Verify `.env` is listed in `.gitignore`
- [ ] Do NOT commit `.env` to git

### Local Build
- [ ] Run `npm install`
- [ ] Run `npm run build` (should create `dist/` folder)
- [ ] Verify `dist/` folder exists with:
  - [ ] `index.html`
  - [ ] `assets/` folder with JS/CSS files
- [ ] Run `npm run start:prod`
- [ ] Test in browser at `http://localhost:3001`
- [ ] Verify token generation works
- [ ] Verify report viewer loads

### Testing Scenarios
- [ ] Test with Tenant 1 (Northwind Traders)
- [ ] Test with Tenant 2 (Adventure Works)
- [ ] Test with Tenant 3 (Contoso Ltd)
- [ ] Verify user switching works
- [ ] Check browser console for errors
- [ ] Check server console for token requests
- [ ] Test network requests in DevTools

### Production Dependencies
- [ ] Run `npm ci --only=production`
- [ ] Verify `node_modules` size is reasonable
- [ ] Run `npm run start:prod` again
- [ ] Verify everything still works with production deps

## 🟢 Phase 2: Server Preparation (Linux)

### Server Setup
- [ ] SSH into Linux server as root or sudo user
- [ ] Create deploy directory: `mkdir -p /var/www/bold-reports`
- [ ] Set permissions: `sudo chown $USER:$USER /var/www/bold-reports`
- [ ] Verify Node.js installed: `node --version` (16+ required)
- [ ] Verify npm installed: `npm --version`
- [ ] If needed, install Node.js:
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

### Upload Application
- [ ] Copy application to server:
  ```bash
  rsync -avz --exclude='node_modules' --exclude='.env' . user@server:/var/www/bold-reports/
  ```
- [ ] Or use git:
  ```bash
  cd /var/www/bold-reports
  git clone <repo-url> .
  ```
- [ ] Verify files copied: `ls -la /var/www/bold-reports/`

### Install Dependencies
- [ ] Navigate to app: `cd /var/www/bold-reports`
- [ ] Run `npm ci --only=production`
- [ ] Verify installation: `npm list` (check for errors)

### Configure Environment
- [ ] Create `.env` file on server (DO NOT use git)
  ```bash
  nano /var/www/bold-reports/.env
  ```
- [ ] Copy exact credentials from local `.env`
- [ ] Verify .env has all variables:
  ```bash
  cat .env | grep REPORT_
  ```
- [ ] Set file permissions: `chmod 600 .env`
- [ ] Verify only you can read it: `ls -la .env`

### Build Frontend
- [ ] Run `npm run build`
- [ ] Verify `dist/` folder created
- [ ] Check file count: `ls dist/assets/ | wc -l`
- [ ] Run `npm run start:prod` briefly to test
- [ ] Kill process: `Ctrl+C`

## 🟡 Phase 3: Process Management (Choose One)

### Option A: PM2 (Recommended)
- [ ] Install PM2: `sudo npm install -g pm2`
- [ ] Verify installation: `pm2 --version`
- [ ] Start app: `pm2 start server/server.js --name "bold-reports"`
- [ ] Verify running: `pm2 status`
- [ ] Setup auto-start: `pm2 startup`
- [ ] Save config: `pm2 save`
- [ ] Verify saved: `pm2 startup` (should show "already installed")
- [ ] Monitor: `pm2 logs bold-reports`

### Option B: Systemd Service
- [ ] Create service file:
  ```bash
  sudo nano /etc/systemd/system/bold-reports.service
  ```
- [ ] Copy service config from DEPLOYMENT.md
- [ ] Update `WorkingDirectory` path
- [ ] Reload daemon: `sudo systemctl daemon-reload`
- [ ] Enable service: `sudo systemctl enable bold-reports`
- [ ] Start service: `sudo systemctl start bold-reports`
- [ ] Verify status: `sudo systemctl status bold-reports`
- [ ] Check logs: `sudo journalctl -u bold-reports -f`

## 🔵 Phase 4: Web Server (Nginx)

### Installation
- [ ] Install Nginx: `sudo apt-get install nginx`
- [ ] Verify: `nginx -v`
- [ ] Start Nginx: `sudo systemctl start nginx`
- [ ] Check status: `sudo systemctl status nginx`

### Configuration
- [ ] Create config file:
  ```bash
  sudo nano /etc/nginx/sites-available/bold-reports
  ```
- [ ] Copy Nginx config from DEPLOYMENT.md
- [ ] Update `server_name` to your domain
- [ ] Update SSL certificate paths (see next)
- [ ] Test config: `sudo nginx -t`
- [ ] Enable site:
  ```bash
  sudo ln -s /etc/nginx/sites-available/bold-reports /etc/nginx/sites-enabled/
  ```
- [ ] Disable default:
  ```bash
  sudo rm /etc/nginx/sites-enabled/default
  ```
- [ ] Reload Nginx: `sudo systemctl reload nginx`

### SSL Certificate (Let's Encrypt)
- [ ] Install Certbot: `sudo apt-get install certbot python3-certbot-nginx`
- [ ] Get certificate:
  ```bash
  sudo certbot certonly --standalone -d your-domain.com
  ```
- [ ] Follow Certbot prompts
- [ ] Verify certificate created:
  ```bash
  sudo ls -la /etc/letsencrypt/live/your-domain.com/
  ```
- [ ] Update Nginx config with correct paths
- [ ] Test Nginx config: `sudo nginx -t`
- [ ] Reload Nginx: `sudo systemctl reload nginx`
- [ ] Setup auto-renewal:
  ```bash
  sudo systemctl enable certbot.timer
  sudo systemctl start certbot.timer
  ```

## 🟢 Phase 5: Testing

### Local Connectivity
- [ ] Test server is running: `ps aux | grep node`
- [ ] Test port 3001: `curl http://localhost:3001`
- [ ] Should return HTML (not error)

### Nginx Connectivity
- [ ] Test HTTP redirect:
  ```bash
  curl -I http://your-domain.com/
  ```
- [ ] Should redirect to HTTPS
- [ ] Test HTTPS:
  ```bash
  curl -I https://your-domain.com/
  ```
- [ ] Should return 200 OK

### Browser Testing
- [ ] Open browser to `https://your-domain.com`
- [ ] Should load application
- [ ] Check browser console for errors
- [ ] Select different tenants
- [ ] Verify token is generated (check server logs)
- [ ] Verify report viewer loads
- [ ] Try downloading/printing report

### Error Testing
- [ ] Check server logs:
  ```bash
  pm2 logs bold-reports
  # OR
  sudo journalctl -u bold-reports -f
  ```
- [ ] Check Nginx logs:
  ```bash
  sudo tail -f /var/log/nginx/access.log
  sudo tail -f /var/log/nginx/error.log
  ```
- [ ] Look for any error messages
- [ ] Verify token requests are logged

## 🟡 Phase 6: Performance & Monitoring

### Performance
- [ ] Test page load speed (DevTools)
- [ ] Check asset sizes (should be gzipped)
- [ ] Monitor CPU usage: `top` or `htop`
- [ ] Monitor memory: `free -h`
- [ ] Monitor disk: `df -h`

### Monitoring Setup
- [ ] Setup PM2 monitoring:
  ```bash
  pm2 monit
  ```
- [ ] Or setup Systemd logging:
  ```bash
  sudo journalctl --unit=bold-reports -f
  ```
- [ ] Consider setting up alerting (optional):
  - [ ] Email alerts for crashes
  - [ ] Uptime monitoring
  - [ ] Performance monitoring

### Logging
- [ ] Verify logs capture token requests
- [ ] Verify logs capture errors
- [ ] Setup log rotation (optional):
  ```bash
  sudo apt-get install logrotate
  ```

## 🔵 Phase 7: Backup & Recovery

### Backup Strategy
- [ ] Backup `.env` file securely
- [ ] Store backup in secure location (not git)
- [ ] Document restore process
- [ ] Backup `package.json` and `package-lock.json`
- [ ] Setup automated backups (optional)

### Disaster Recovery
- [ ] Document how to restore from backup
- [ ] Document how to roll back to previous version
- [ ] Document how to recover from server failure
- [ ] Test restore process (optional but recommended)

## 🟢 Phase 8: Security Hardening

### File Permissions
- [ ] Verify `.env` is readable only by app user:
  ```bash
  ls -la .env  # Should be -rw------- (600)
  ```
- [ ] Verify `node_modules` not world-writable
- [ ] Verify application directory permissions

### Firewall
- [ ] Allow port 80 (HTTP): `sudo ufw allow 80`
- [ ] Allow port 443 (HTTPS): `sudo ufw allow 443`
- [ ] Block port 3001 (Express internal): `sudo ufw default deny incoming`
- [ ] Enable firewall: `sudo ufw enable`

### Nginx Security
- [ ] Update Nginx: `sudo apt-get update && sudo apt-get install nginx`
- [ ] Review Nginx config for security best practices
- [ ] Disable directory listing (already done)
- [ ] Add security headers (optional):
  ```nginx
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  ```

### Application Security
- [ ] Verify no console.log with sensitive data
- [ ] Verify error messages don't expose internals
- [ ] Test with incorrect credentials (should fail gracefully)
- [ ] Test with missing .env variables (should use defaults)

## 🟡 Phase 9: Documentation

### Create Runbooks
- [ ] Document how to restart application
- [ ] Document how to check logs
- [ ] Document how to update application
- [ ] Document how to scale to multiple servers
- [ ] Document emergency contact procedures

### Update Team
- [ ] Document production URL
- [ ] Document how to access logs
- [ ] Document escalation procedures
- [ ] Share documentation with team

## 🟢 Phase 10: Go Live

### Final Checks
- [ ] All checklist items complete
- [ ] Team has been notified
- [ ] Backups verified
- [ ] Monitoring active
- [ ] Support plan in place

### Post-Launch
- [ ] Monitor application closely first 24 hours
- [ ] Check logs for any errors
- [ ] Verify all features working
- [ ] Gather user feedback
- [ ] Document any issues
- [ ] Plan follow-up improvements

## 🟡 Phase 11: Maintenance

### Regular Tasks
- [ ] Daily: Check logs for errors
- [ ] Weekly: Review performance metrics
- [ ] Monthly: Update dependencies
- [ ] Monthly: Verify backups working
- [ ] Quarterly: Security audit
- [ ] Quarterly: Performance optimization

### Scheduled Maintenance
- [ ] SSL certificate renewal (auto with Let's Encrypt)
- [ ] OS security updates (monthly)
- [ ] Node.js updates (quarterly)
- [ ] Application updates (as needed)
- [ ] Database backups (daily)

## 🆘 Troubleshooting

### Can't Connect to Server
```bash
# Test connectivity
ssh user@your-domain.com

# Check firewall
sudo ufw status

# Check Nginx
sudo systemctl status nginx
sudo nginx -t
```

### Application Won't Start
```bash
# Check PM2
pm2 status
pm2 logs bold-reports

# Check Systemd
sudo systemctl status bold-reports
sudo journalctl -u bold-reports -f

# Check if port in use
lsof -i :3001
```

### Report Viewer Not Loading
```bash
# Check server logs
pm2 logs bold-reports

# Check .env variables
cat .env

# Verify token generation
curl -X POST http://localhost:3001/api/token \
  -H "Content-Type: application/json" \
  -d '{"tenantId": 1, "userId": 5}'
```

### SSL Certificate Error
```bash
# Verify certificate
sudo openssl x509 -in /etc/letsencrypt/live/your-domain.com/fullchain.pem -text -noout

# Renew certificate
sudo certbot renew --dry-run

# Check renewal status
sudo certbot certificates
```

---

**When in doubt, check the logs!** Most issues will be revealed in:
- Server logs: `pm2 logs bold-reports`
- Nginx logs: `/var/log/nginx/error.log`
- Systemd logs: `journalctl -u bold-reports -f`

**Need help?** See DEPLOYMENT.md or contact https://support.boldreports.com/
