import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import axios from 'axios';
import { app } from './server.js';

// Store original implementation
const originalPost = axios.post;

describe('Server API Token Endpoint', () => {
  let server;
  let baseUrl;

  before(async () => {
    // Start the server on an ephemeral port
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://localhost:${port}`;
        resolve();
      });
    });
  });

  after((done) => {
    // Restore original axios implementation
    axios.post = originalPost;
    server.close(done);
  });

  test('should return 500 when token generation fails', async () => {
    const errorMessage = 'Simulated upstream failure';

    // Monkey-patch axios.post to simulate a failure
    axios.post = async () => {
        const error = new Error(errorMessage);
        error.response = { data: errorMessage };
        throw error;
    };

    if (!baseUrl) {
        throw new Error('Server not started properly, baseUrl is undefined');
    }

    const response = await fetch(`${baseUrl}/api/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantId: '1', userId: '1' })
    });

    assert.strictEqual(response.status, 500);
    const data = await response.json();
    assert.deepStrictEqual(data, { error: 'Failed to generate token' });
  });
});
