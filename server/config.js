export const config = {
  reportServerUrl: 'https://cloud.boldreports.com/reporting/api/site/b1159702',
  reportServiceUrl: 'https://cloud.boldreports.com/reporting/reportservice/api/Viewer',
  tokenUrl: 'https://cloud.boldreports.com/reporting/api/site/b1159702/token',
  reportPath: '/Sample Reports/Product Line Sales',
  siteName: 'b1159702',
  credentials: {
    user: process.env.BOLD_REPORTS_USER,
    password: process.env.BOLD_REPORTS_PASSWORD,
    embedSecret: process.env.BOLD_REPORTS_EMBED_SECRET
  }
};
