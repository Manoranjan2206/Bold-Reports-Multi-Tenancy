import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { config } from './config.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = config.port;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

app.post('/api/token', async (req, res) => {
  try {
    const { tenantId, userId } = req.body;

    // Validate inputs
    if (!tenantId || !userId) {
      console.error('Invalid request: Missing tenantId or userId', { tenantId, userId });
      return res.status(400).json({ error: 'Missing tenantId or userId' });
    }

    // Construct the request payload for Bold Reports Token API
    // Matching the curl command exactly
    const tokenRequest = {
      grant_type: 'embed_token',
      ReportServerUser: config.credentials.user,
      Password: config.credentials.password,
      Embed_Secret: config.credentials.embedSecret,
      ReportParameters: [
        { Key: 'TenantId', Values: [tenantId.toString()] },
        { Key: 'UserId', Values: [userId.toString()] }
      ]
    };

    console.log('Requesting token for:', config.credentials.user);
    console.log('Token URL:', config.tokenUrl);
    console.log('Parameters:', tokenRequest.ReportParameters);

    const response = await axios.post(config.tokenUrl, tokenRequest, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('Token received successfully');
    res.json(response.data);
  } catch (error) {
    console.error('Error generating token:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      res.status(error.response.status).json({ 
        error: 'Failed to generate token',
        details: error.response.data 
      });
    } else {
      console.error('Message:', error.message);
      res.status(500).json({ 
        error: 'Failed to generate token',
        details: error.message 
      });
    }
  }
});

// SPA Fallback - Route all unmatched requests to index.html
app.get(/^(?!\/api\/).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${config.nodeEnv}`);
});
