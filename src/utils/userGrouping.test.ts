import { describe, it } from 'node:test';
import assert from 'node:assert';
import { groupUsersByTenant, getTenantName, getTenantSlug, getTenantDomain } from './userGrouping.ts';
import type { SalesRecord } from '../data/mockData.ts';

const createMockRecord = (overrides: Partial<SalesRecord> = {}): SalesRecord => ({
  UserId: 1,
  UserName: 'Test User',
  Region: 'Test Region',
  Country: 'Test Country',
  TenantId: 1,
  Product: 'Test Product',
  TotalSales: 100,
  UnitsSold: 10,
  ReportDate: '2025-01-01',
  ImageUrl: 'http://test.com/image.png',
  ...overrides
});

describe('User Grouping Utility', () => {

  describe('Helper Functions', () => {
    it('getTenantName returns correct names', () => {
      assert.strictEqual(getTenantName(1), "Northwind Traders");
      assert.strictEqual(getTenantName(2), "Adventure Works");
      assert.strictEqual(getTenantName(3), "Contoso Ltd");
      assert.strictEqual(getTenantName(999), "Unknown Tenant");
    });

    it('getTenantSlug returns correct slugs', () => {
      assert.strictEqual(getTenantSlug(1), "northwind_traders");
      assert.strictEqual(getTenantSlug(2), "adventure_works");
      assert.strictEqual(getTenantSlug(3), "contoso_ltd");
      assert.strictEqual(getTenantSlug(999), "unknown");
    });

    it('getTenantDomain returns correct domains', () => {
      assert.strictEqual(getTenantDomain(1), "northwindtraders.com");
      assert.strictEqual(getTenantDomain(2), "adventure-works.com");
      assert.strictEqual(getTenantDomain(3), "contoso.com");
      assert.strictEqual(getTenantDomain(999), "example.com");
    });
  });

  describe('groupUsersByTenant', () => {
    it('should handle empty input', () => {
      const result = groupUsersByTenant([]);
      assert.deepStrictEqual(result, []);
    });

    it('should group users by TenantId', () => {
      const input = [
        createMockRecord({ TenantId: 1, UserName: 'User A' }),
        createMockRecord({ TenantId: 2, UserName: 'User B' }),
        createMockRecord({ TenantId: 1, UserName: 'User C' }),
      ];

      const result = groupUsersByTenant(input);

      assert.strictEqual(result.length, 2);

      const tenant1Group = result.find(g => g.tenantId === 1);
      assert.ok(tenant1Group);
      assert.strictEqual(tenant1Group.users.length, 2);
      assert.ok(tenant1Group.users.find(u => u.UserName === 'User A'));
      assert.ok(tenant1Group.users.find(u => u.UserName === 'User C'));

      const tenant2Group = result.find(g => g.tenantId === 2);
      assert.ok(tenant2Group);
      assert.strictEqual(tenant2Group.users.length, 1);
      assert.ok(tenant2Group.users.find(u => u.UserName === 'User B'));
    });

    it('should flatten duplicate users (same TenantId + UserName)', () => {
      const input = [
        createMockRecord({ TenantId: 1, UserName: 'User A', Product: 'P1' }),
        createMockRecord({ TenantId: 1, UserName: 'User A', Product: 'P2' }), // Duplicate user entry
      ];

      const result = groupUsersByTenant(input);

      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].users.length, 1);
      assert.strictEqual(result[0].users[0].UserName, 'User A');
    });

    it('should sort groups by TenantId', () => {
      const input = [
        createMockRecord({ TenantId: 3, UserName: 'User C' }),
        createMockRecord({ TenantId: 1, UserName: 'User A' }),
        createMockRecord({ TenantId: 2, UserName: 'User B' }),
      ];

      const result = groupUsersByTenant(input);

      assert.strictEqual(result.length, 3);
      assert.strictEqual(result[0].tenantId, 1);
      assert.strictEqual(result[1].tenantId, 2);
      assert.strictEqual(result[2].tenantId, 3);
    });

    it('should generate enriched fields correctly', () => {
      const input = [
        createMockRecord({ TenantId: 1, UserName: 'John Doe', Region: 'US' }),
      ];

      const result = groupUsersByTenant(input);
      const user = result[0].users[0];

      // Email generation
      assert.strictEqual(user.Email, 'john.doe@northwindtraders.com');

      // DB Mapping
      assert.strictEqual(user.DbMapping, "'sales_analysis_db':'northwind_traders_sales_analysis'");

      // Role inference (Starts with J -> Manager)
      assert.strictEqual(user.UserRole, 'Manager');
      assert.ok(user.RlsFilter.includes('Client-configured RLS'));

      // Viewer role check
      const viewerInput = [
        createMockRecord({ TenantId: 1, UserName: 'Alice', Region: 'EU' }),
      ];
      const viewerResult = groupUsersByTenant(viewerInput);
      const viewer = viewerResult[0].users[0];
      assert.strictEqual(viewer.UserRole, 'Viewer');
      assert.ok(viewer.RlsFilter.includes('Preconfigured RLS'));
    });
  });
});
