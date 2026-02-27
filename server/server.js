import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { config } from './config.js';

const app = express();
const port = 3001;

// Configure CORS to only allow requests from the frontend development server
const allowedOrigins = ['http://localhost:5173', 'http://localhost:4173'];
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
};

app.use(cors(corsOptions));
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
