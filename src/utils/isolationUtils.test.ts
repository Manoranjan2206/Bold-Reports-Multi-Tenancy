import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getConnectionString } from './isolationUtils.ts';

describe('getConnectionString', () => {
    it('should return connection string for "Database per Tenant"', () => {
        const model = 'Database per Tenant';
        const tenant = 'My Tenant';
        const expected = 'Server=tcp:demo.database.windows.net;Database=My_Tenant_Db;User ID=app_user;Password=******;';
        assert.strictEqual(getConnectionString(model, tenant), expected);
    });

    it('should return connection string for "Schema per Tenant"', () => {
        const model = 'Schema per Tenant';
        const tenant = 'My Tenant';
        const expected = 'Server=tcp:demo.database.windows.net;Database=Shared_Db;Schema=MyTenant;User ID=app_user;Password=******;';
        assert.strictEqual(getConnectionString(model, tenant), expected);
    });

    it('should return connection string for "Shared Database (RLS)"', () => {
        const model = 'Shared Database (RLS)';
        const tenant = 'My Tenant';
        const expected = 'Server=tcp:demo.database.windows.net;Database=Shared_Db;User ID=app_user;Password=******;';
        assert.strictEqual(getConnectionString(model, tenant), expected);
    });

    it('should return connection string for unknown model (default)', () => {
        const model = 'Unknown Model';
        const tenant = 'My Tenant';
        const expected = 'Server=tcp:demo.database.windows.net;Database=Shared_Db;User ID=app_user;Password=******;';
        assert.strictEqual(getConnectionString(model, tenant), expected);
    });

    it('should handle tenant name with multiple spaces', () => {
        const model = 'Database per Tenant';
        const tenant = 'My  Long  Tenant';
        const expected = 'Server=tcp:demo.database.windows.net;Database=My_Long_Tenant_Db;User ID=app_user;Password=******;';
        assert.strictEqual(getConnectionString(model, tenant), expected);
    });

    it('should handle single word tenant without spaces', () => {
        const model = 'Database per Tenant';
        const tenant = 'SingleWord';
        const expected = 'Server=tcp:demo.database.windows.net;Database=SingleWord_Db;User ID=app_user;Password=******;';
        assert.strictEqual(getConnectionString(model, tenant), expected);
    });

    it('should handle empty string tenant', () => {
        const model = 'Database per Tenant';
        const tenant = '';
        const expected = 'Server=tcp:demo.database.windows.net;Database=_Db;User ID=app_user;Password=******;';
        assert.strictEqual(getConnectionString(model, tenant), expected);
    });

    it('should handle single word tenant for Schema per Tenant', () => {
        const model = 'Schema per Tenant';
        const tenant = 'SingleWord';
        const expected = 'Server=tcp:demo.database.windows.net;Database=Shared_Db;Schema=SingleWord;User ID=app_user;Password=******;';
        assert.strictEqual(getConnectionString(model, tenant), expected);
    });

    it('should handle empty string tenant for Schema per Tenant', () => {
        const model = 'Schema per Tenant';
        const tenant = '';
        const expected = 'Server=tcp:demo.database.windows.net;Database=Shared_Db;Schema=;User ID=app_user;Password=******;';
        assert.strictEqual(getConnectionString(model, tenant), expected);
    });

    it('should handle single word tenant for Shared Database', () => {
        const model = 'Shared Database (RLS)';
        const tenant = 'SingleWord';
        const expected = 'Server=tcp:demo.database.windows.net;Database=Shared_Db;User ID=app_user;Password=******;';
        assert.strictEqual(getConnectionString(model, tenant), expected);
    });

    it('should handle empty string tenant for Shared Database', () => {
        const model = 'Shared Database (RLS)';
        const tenant = '';
        const expected = 'Server=tcp:demo.database.windows.net;Database=Shared_Db;User ID=app_user;Password=******;';
        assert.strictEqual(getConnectionString(model, tenant), expected);
    });
});
