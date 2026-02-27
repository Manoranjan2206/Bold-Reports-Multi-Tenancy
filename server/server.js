import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { config } from './config.js';

const app = express();
const port = 3001;

// Simple in-memory cache: Map<string, { token: object, expiresAt: number }>
const tokenCache = new Map();

app.use(cors());
app.use(express.json());

app.post('/api/token', async (req, res) => {
  try {
    const { tenantId, userId } = req.body;

    // Check cache first
    const cacheKey = `${tenantId || ''}:${userId || ''}`;
    const cached = tokenCache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
      console.log('Returning cached token for:', cacheKey);
      return res.json(cached.token);
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

    console.log('Requesting token for:', config.credentials.user);
    console.log('Parameters:', tokenRequest.ReportParameters);

    const response = await axios.post(config.tokenUrl, tokenRequest, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('Token received successfully');

    // Cache the successful response
    // expires_in is in seconds. We subtract a 60s buffer to be safe.
    const expiresIn = response.data.expires_in || 3600;
    const expirationMs = (expiresIn * 1000) - 60000;
    const expiresAt = Date.now() + expirationMs;

    tokenCache.set(cacheKey, {
      token: response.data,
      expiresAt
    });

    // Schedule cleanup to prevent memory leaks
    setTimeout(() => {
      tokenCache.delete(cacheKey);
    }, expirationMs);

    res.json(response.data);
  } catch (error) {
    console.error('Error generating token:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
