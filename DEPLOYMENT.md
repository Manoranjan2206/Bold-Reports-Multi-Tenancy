# Deployment Guide - Bold Reports Multi-Tenancy

This guide covers deploying the Bold Reports application to a production Linux environment.

## Prerequisites

- Linux server (Ubuntu 20.04+ recommended)
- Node.js 16+ installed
- npm or yarn installed

## Step 1: Setup Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your production credentials:

```env
REPORT_SERVER_URL=https://cloud.boldreports.com/reporting/api/site/YOUR_SITE_ID
REPORT_SERVICE_URL=https://cloud.boldreports.com/reporting/reportservice/api/Viewer
TOKEN_URL=https://cloud.boldreports.com/reporting/api/site/YOUR_SITE_ID/token
REPORT_PATH=YOUR_REPORT_PATH_ID
SITE_NAME=YOUR_SITE_NAME
REPORT_USER=your-email@example.com
REPORT_PASSWORD=your-password
EMBED_SECRET=your-embed-secret
PORT=3001
NODE_ENV=production
```

⚠️ **IMPORTANT**: Never commit `.env` to git. It's already in `.gitignore`.

## Step 2: Build the Application

```bash
# Install dependencies
npm install

# Build frontend (creates dist folder)
npm run build

# For production deployment
npm run build:prod
```

## Step 3: Deploy to Server

### Option A: Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start the server
pm2 start server/server.js --name "bold-reports" --env NODE_ENV=production

# Save to auto-restart on reboot
pm2 startup
pm2 save

# View logs
pm2 logs bold-reports
```

### Option B: Using Systemd Service

Create `/etc/systemd/system/bold-reports.service`:

```ini
[Unit]
Description=Bold Reports Multi-Tenancy Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/bold-reports
EnvironmentFile=/var/www/bold-reports/.env
ExecStart=/usr/bin/node server/server.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable bold-reports
sudo systemctl start bold-reports
sudo systemctl status bold-reports
```

## Step 4: Configure Nginx Reverse Proxy

Create `/etc/nginx/sites-available/bold-reports`:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    client_max_body_size 100M;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/javascript application/json;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_redirect off;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/bold-reports /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

## Step 5: Setup SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com -d www.your-domain.com
```

Auto-renew certificates:

```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## Step 6: Monitor & Maintain

### View Logs

**PM2:**
```bash
pm2 logs bold-reports
pm2 monit
```

**Systemd:**
```bash
sudo journalctl -u bold-reports -f
```

**Nginx:**
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Update Application

```bash
cd /var/www/bold-reports
git pull origin main
npm install
npm run build
pm2 restart bold-reports
# OR: sudo systemctl restart bold-reports
```

## Troubleshooting

**Port 3001 already in use:**
```bash
# Find and kill process
lsof -i :3001
kill -9 <PID>
```

**Nginx errors:**
```bash
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

**Check if server is running:**
```bash
curl http://localhost:3001
```

## Security Best Practices

1. ✅ Never commit `.env` file to git
2. ✅ Use environment variables for all secrets
3. ✅ Enable HTTPS/SSL (Let's Encrypt)
4. ✅ Set strong passwords for Bold Reports credentials
5. ✅ Restrict file permissions: `chmod 600 .env`
6. ✅ Keep Node.js and dependencies updated
7. ✅ Use a process manager (PM2 or Systemd)
8. ✅ Monitor logs regularly

## Performance Optimization

- Enable Gzip compression (done in Nginx config)
- Cache static assets (done in Nginx config)
- Use a CDN for assets
- Monitor server resource usage
- Enable database connection pooling if applicable

## Backup

Regularly backup your `.env` file and database:

```bash
# Backup .env (store securely)
cp .env /backup/.env.backup

# Or use automated backup solutions
```

---

For more help, visit: https://support.boldreports.com/
