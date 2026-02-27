
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getTenantId, getAvailableUsers, getEffectiveUser, type SalesRecord } from '../utils/userSelectionUtils.ts';

const mockData: SalesRecord[] = [
  { UserId: 1, UserName: 'User 1', TenantId: 1 } as SalesRecord,
  { UserId: 2, UserName: 'User 2', TenantId: 1 } as SalesRecord,
  { UserId: 3, UserName: 'User 3', TenantId: 2 } as SalesRecord,
  { UserId: 4, UserName: 'User 4', TenantId: 2 } as SalesRecord,
  { UserId: 5, UserName: 'User 1', TenantId: 3 } as SalesRecord // Same name as tenant 1 user
];

describe('User Selection Utilities', () => {

  describe('getTenantId', () => {
    it('should return correct ID for Northwind Traders', () => {
      assert.strictEqual(getTenantId('Northwind Traders'), 1);
    });

    it('should return correct ID for Adventure Works', () => {
      assert.strictEqual(getTenantId('Adventure Works'), 2);
    });

    it('should return correct ID for Contoso Ltd', () => {
      assert.strictEqual(getTenantId('Contoso Ltd'), 3);
    });

    it('should return default ID (1) for unknown tenant', () => {
      assert.strictEqual(getTenantId('Unknown Tenant'), 1);
    });
  });

  describe('getAvailableUsers', () => {
    it('should return users for tenant 1 sorted', () => {
      const users = getAvailableUsers(1, mockData);
      assert.deepStrictEqual(users, ['User 1', 'User 2']);
    });

    it('should return users for tenant 2 sorted', () => {
        // Just checking basic retrieval
        const users = getAvailableUsers(2, mockData);
        assert.deepStrictEqual(users, ['User 3', 'User 4']);
    });

    it('should return unique users for tenant 3 (if there were duplicates)', () => {
      const duplicateData = [
          { UserId: 5, UserName: 'User 1', TenantId: 3 } as SalesRecord,
          { UserId: 6, UserName: 'User 1', TenantId: 3 } as SalesRecord
      ];
      const users = getAvailableUsers(3, duplicateData);
      assert.deepStrictEqual(users, ['User 1']);
    });

    it('should return ["No Users Found"] if no users exist for tenant', () => {
      const users = getAvailableUsers(99, mockData);
      assert.deepStrictEqual(users, ['No Users Found']);
    });
  });

  describe('getEffectiveUser', () => {
    it('should return selected user if available', () => {
      const available = ['User A', 'User B', 'User C'];
      const effective = getEffectiveUser(available, 'User B');
      assert.strictEqual(effective, 'User B');
    });

    it('should return first available user if selected is not available', () => {
      const available = ['User A', 'User B', 'User C'];
      const effective = getEffectiveUser(available, 'User X');
      assert.strictEqual(effective, 'User A');
    });

    it('should return empty string if no users available', () => {
      const available: string[] = [];
      const effective = getEffectiveUser(available, 'User X');
      assert.strictEqual(effective, '');
    });

    it('should handle "No Users Found" case gracefully (as it is a valid string)', () => {
        const available = ['No Users Found'];
        const effective = getEffectiveUser(available, 'User X');
        assert.strictEqual(effective, 'No Users Found');
    });
  });

});
