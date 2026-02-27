import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { config } from './config.js';
import { fileURLToPath } from 'url';

export const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/token', async (req, res) => {
  try {
    const { tenantId, userId } = req.body;

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

    console.log('Requesting token for:', config.credentials.user);
    console.log('Parameters:', tokenRequest.ReportParameters);

    const response = await axios.post(config.tokenUrl, tokenRequest, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('Token received successfully');
    res.json(response.data);
  } catch (error) {
    console.error('Error generating token:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
