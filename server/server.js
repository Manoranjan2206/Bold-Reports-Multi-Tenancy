import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { config } from './config.js';

const app = express();
const port = process.env.PORT || 3001;

// Load environment variables from .env when present
dotenv.config();

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_URL || 'https://your-production-url.com']
  : ['http://localhost:5173', 'http://localhost:4173'];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
  }
}));
app.use(express.json());

app.post('/api/token', async (req, res) => {
  try {
    const { tenantId, userId } = req.body;

    // Validate server-side credentials are configured before calling external API
    const { user, password, embedSecret } = config.credentials;
    if (!user || !password || !embedSecret) {
      console.error('Missing Bold Reports credentials in environment variables');
      return res.status(500).json({ error: 'Server misconfiguration: missing Bold Reports credentials. Set BOLD_REPORTS_USER, BOLD_REPORTS_PASSWORD, BOLD_REPORTS_EMBED_SECRET' });
    }

    // Construct the request payload for Bold Reports Token API
    // Matching the curl command exactly
    const tokenRequest = {
      grant_type: 'embed_token',
      ReportServerUser: config.credentials.user,
      Password: config.credentials.password,
      Embed_Secret: config.credentials.embedSecret,
      ReportParameters: [
        { Key: 'TenantId', Values: [tenantId ? tenantId.toString() : ''] },
        { Key: 'UserId', Values: [userId ? userId.toString() : ''] }
      ]
    };

    // Request sent to token endpoint (sensitive info suppressed in logs)

    const response = await axios.post(config.tokenUrl, tokenRequest, {
      headers: { 'Content-Type': 'application/json' }
    });

    // Token successfully received from Bold Reports
    res.json(response.data);
  } catch (error) {
    // Provide more detailed logging for debugging (don't leak secrets)
    const errDetail = error && error.response ? error.response.data : (error && error.message) ? error.message : String(error);
    console.error('Error generating token:', errDetail);
    res.status(500).json({ error: 'Failed to generate token', detail: typeof errDetail === 'string' ? errDetail : undefined });
  }
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export { app };
