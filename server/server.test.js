import test from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import axios from 'axios';
import { mock } from 'node:test';
import { app } from './server.js';

test('POST /api/token - Success', async (t) => {
  const mockToken = { access_token: 'mock_token_123' };

  // Mock axios.post to return a successful response
  mock.method(axios, 'post', async () => {
    return { data: mockToken };
  });

  // Ensure mock is reset after test
  t.after(() => {
    mock.reset();
  });

  const response = await request(app)
    .post('/api/token')
    .send({ tenantId: 1, userId: 1 })
    .expect('Content-Type', /json/)
    .expect(200);

  assert.deepStrictEqual(response.body, mockToken);
});

test('POST /api/token - Error Handling', async (t) => {
  // Mock axios.post to throw an error
  mock.method(axios, 'post', async () => {
    const error = new Error('Network Error');
    error.response = {
      data: 'Backend Service Unavailable'
    };
    throw error;
  });

  // Ensure mock is reset after test
  t.after(() => {
    mock.reset();
  });

  const response = await request(app)
    .post('/api/token')
    .send({ tenantId: 1, userId: 1 })
    .expect('Content-Type', /json/)
    .expect(500);

  assert.deepStrictEqual(response.body, { error: 'Failed to generate token' });
});
