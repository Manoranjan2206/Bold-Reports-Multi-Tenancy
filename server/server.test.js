import { test, before, after, mock } from 'node:test';
import assert from 'node:assert';
import axios from 'axios';
import { app } from './server.js';
import { config } from './config.js';

let server;
let baseUrl;

// Start server before tests
before(async () => {
  return new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

// Clean up server after tests
after(async () => {
  if (server) {
    return new Promise((resolve) => {
      server.close(resolve);
    });
  }
});

test('POST /api/token - Success', async (t) => {
  const tenantId = 'tenant123';
  const userId = 'user456';
  const mockTokenResponse = {
    Token: 'fake-jwt-token',
    TokenExpiry: '2023-12-31T23:59:59Z'
  };

  // Create a mock for axios.post
  const axiosMock = mock.method(axios, 'post', () => {
    return Promise.resolve({ data: mockTokenResponse });
  });

  const response = await fetch(`${baseUrl}/api/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tenantId, userId })
  });

  const data = await response.json();

  assert.strictEqual(response.status, 200);
  assert.deepStrictEqual(data, mockTokenResponse);

  // Verify axios was called
  assert.strictEqual(axiosMock.mock.calls.length, 1);
  const [url, payload] = axiosMock.mock.calls[0].arguments;

  assert.strictEqual(url, config.tokenUrl);
  assert.strictEqual(payload.grant_type, 'embed_token');
  assert.strictEqual(payload.ReportServerUser, config.credentials.user);

  // Verify RLS parameters
  const reportParams = payload.ReportParameters;
  const tenantParam = reportParams.find(p => p.Key === 'TenantId');
  const userParam = reportParams.find(p => p.Key === 'UserId');

  assert.strictEqual(tenantParam.Values[0], tenantId);
  assert.strictEqual(userParam.Values[0], userId);

  // Restore the mock
  axiosMock.mock.restore();
});

test('POST /api/token - Error', async (t) => {
  // Create a mock for axios.post that fails
  const axiosMock = mock.method(axios, 'post', () => {
    const error = new Error('API Error');
    error.response = { data: { Message: 'Invalid credentials' } };
    return Promise.reject(error);
  });

  const response = await fetch(`${baseUrl}/api/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tenantId: 't1', userId: 'u1' })
  });

  const data = await response.json();

  assert.strictEqual(response.status, 500);
  assert.strictEqual(data.error, 'Failed to generate token');

  // Restore the mock
  axiosMock.mock.restore();
});
