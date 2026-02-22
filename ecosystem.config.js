/**
 * PM2 Ecosystem Configuration
 * Usage: pm2 start ecosystem.config.js
 * Docs: https://pm2.keymetrics.io/docs/usage/ecosystem-file/
 */

module.exports = {
  apps: [
    {
      name: 'bold-reports',
      script: 'server/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      // Watch for file changes (disable in production)
      watch: false,
      ignore_watch: ['node_modules', 'dist', 'logs'],
      
      // Logs
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      out_file: 'logs/pm2-out.log',
      error_file: 'logs/pm2-error.log',
      
      // Restart settings
      restart_delay: 4000,
      max_memory_restart: '500M',
      
      // Auto restart on crash
      autorestart: true,
      
      // Listen for signals
      listen_timeout: 3000,
      kill_timeout: 5000,
      
      // Graceful shutdown
      shutdown_with_message: true,
    }
  ],

  // Monitoring
  monitor_delay: 5000,

  // Deployment configuration
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:your-org/bold-reports.git',
      path: '/var/www/bold-reports',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-deploy-local': ''
    },
    staging: {
      user: 'ubuntu',
      host: 'staging.your-server.com',
      ref: 'origin/develop',
      repo: 'git@github.com:your-org/bold-reports.git',
      path: '/var/www/bold-reports',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env staging'
    }
  }
};
