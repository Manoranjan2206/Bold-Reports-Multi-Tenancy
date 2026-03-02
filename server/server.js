import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { config } from './config.js';

const app = express();
const port = 3001;

// Load environment variables from .env when present
dotenv.config();

app.use(cors());
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

    console.log('Requesting token for site user:', config.credentials.user ? config.credentials.user : '<<missing user>>');
    console.log('Parameters:', tokenRequest.ReportParameters);

    const response = await axios.post(config.tokenUrl, tokenRequest, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('Token received successfully');
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
