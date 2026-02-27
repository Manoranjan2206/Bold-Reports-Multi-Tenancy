/// <reference types="node" />
import assert from 'node:assert';
import { test } from 'node:test';
import { generateConnectionString } from './isolationUtils.ts';

test('generateConnectionString - Database per Tenant', () => {
    const model = 'Database per Tenant';
    const tenant = 'My Tenant';
    const expected = 'Server=tcp:demo.database.windows.net;Database=My_Tenant_Db;User ID=app_user;Password=******;';
    const actual = generateConnectionString(model, tenant);
    assert.strictEqual(actual, expected);
});

test('generateConnectionString - Schema per Tenant', () => {
    const model = 'Schema per Tenant';
    const tenant = 'My Tenant';
    const expected = 'Server=tcp:demo.database.windows.net;Database=Shared_Db;Schema=MyTenant;User ID=app_user;Password=******;';
    const actual = generateConnectionString(model, tenant);
    assert.strictEqual(actual, expected);
});

test('generateConnectionString - Shared Database (RLS)', () => {
    const model = 'Shared Database (RLS)';
    const tenant = 'My Tenant';
    const expected = 'Server=tcp:demo.database.windows.net;Database=Shared_Db;User ID=app_user;Password=******;';
    const actual = generateConnectionString(model, tenant);
    assert.strictEqual(actual, expected);
});

test('generateConnectionString - Default Case', () => {
    const model = 'Unknown Model';
    const tenant = 'My Tenant';
    const expected = 'Server=tcp:demo.database.windows.net;Database=Shared_Db;User ID=app_user;Password=******;';
    const actual = generateConnectionString(model, tenant);
    assert.strictEqual(actual, expected);
});
