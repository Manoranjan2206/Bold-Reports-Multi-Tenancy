// Environment-based configuration for hosted deployment
export const config = {
  reportServerUrl: process.env.REPORT_SERVER_URL || 'https://cloud.boldreports.com/reporting/api/site/b1159702',
  reportServiceUrl: process.env.REPORT_SERVICE_URL || 'https://cloud.boldreports.com/reporting/reportservice/api/Viewer',
  tokenUrl: process.env.TOKEN_URL || 'https://cloud.boldreports.com/reporting/api/site/b1159702/token',
  reportPath: process.env.REPORT_PATH || '8e0df3f5-267f-45e1-8674-693d89133851',
  siteName: process.env.SITE_NAME || 'b1159702',
  credentials: {
    user: process.env.REPORT_USER || 'test@gmail.com',
    password: process.env.REPORT_PASSWORD || 'Admin@123',
    embedSecret: process.env.EMBED_SECRET || 'Yhfw5o9c01TVdPk8HWhQQnGKAl0K9HP'
  },
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development'
};
