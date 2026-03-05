// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  reportServerUrl: 'https://cloud.boldreports.com/reporting/api/site/b1159702',
  reportServiceUrl: 'https://cloud.boldreports.com/reporting/reportservice/api/Viewer',
  tokenUrl: 'https://cloud.boldreports.com/reporting/api/site/b1159702/token',
  reportPath: '/Sample Reports/Product Line Sales',
  siteName: 'b1159702',
  credentials: {
    user: process.env.BOLD_REPORTS_USER || 'test@gmail.com',
    password: process.env.BOLD_REPORTS_PASSWORD || 'Admin@123',
    embedSecret: process.env.BOLD_REPORTS_EMBED_SECRET || 'Yhfw5o9c01TVdPk8HWhQQnGKAl0K9HP'
  }
};
