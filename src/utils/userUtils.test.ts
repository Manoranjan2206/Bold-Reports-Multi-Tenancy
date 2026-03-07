import { test } from 'node:test';
import assert from 'node:assert';
import { getUserRole } from './userUtils.ts';

test('getUserRole should return "Administrator" for strings containing "admin"', () => {
  assert.strictEqual(getUserRole('Admin User'), 'Administrator');
  assert.strictEqual(getUserRole('sysadmin'), 'Administrator');
  assert.strictEqual(getUserRole('ADMINISTRATOR'), 'Administrator');
});

test('getUserRole should return "Sales Representative" for strings containing "sales"', () => {
  assert.strictEqual(getUserRole('Sales Rep'), 'Sales Representative');
  assert.strictEqual(getUserRole('salesmanager'), 'Sales Representative');
  assert.strictEqual(getUserRole('SALES'), 'Sales Representative');
});

test('getUserRole should return "Viewer" for other strings', () => {
  assert.strictEqual(getUserRole('Regular User'), 'Viewer');
  assert.strictEqual(getUserRole('guest'), 'Viewer');
  assert.strictEqual(getUserRole(''), 'Viewer');
  assert.strictEqual(getUserRole(undefined as unknown as string), 'Viewer');
  assert.strictEqual(getUserRole(null as unknown as string), 'Viewer');
});

test('getUserRole should prioritize Administrator when string contains both "admin" and "sales"', () => {
  assert.strictEqual(getUserRole('Sales Admin'), 'Administrator');
  assert.strictEqual(getUserRole('Admin of Sales'), 'Administrator');
});
