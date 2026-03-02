import { test } from 'node:test';
import assert from 'node:assert';
import { getTenantById, TENANTS, TENANT_MAPPING } from './tenantConfig.ts';

test('getTenantById returns correct tenant for known ID', () => {
    const tenant = getTenantById(1);
    assert.strictEqual(tenant.name, 'Northwind Traders');
    assert.strictEqual(tenant.slug, 'northwind_traders');
});

test('getTenantById returns default for unknown ID', () => {
    const tenant = getTenantById(999);
    assert.strictEqual(tenant.name, 'Unknown Tenant');
    assert.strictEqual(tenant.slug, 'unknown');
});

test('TENANT_MAPPING is correctly derived', () => {
    assert.strictEqual(TENANT_MAPPING['Northwind Traders'], 1);
    assert.strictEqual(TENANT_MAPPING['Adventure Works'], 2);
    assert.strictEqual(TENANT_MAPPING['Contoso Ltd'], 3);
});

test('TENANTS array contains all configured tenants', () => {
    assert.strictEqual(TENANTS.length, 3);
    assert.strictEqual(TENANTS[0].id, 1);
    assert.strictEqual(TENANTS[1].id, 2);
    assert.strictEqual(TENANTS[2].id, 3);
});
