import type { SalesRecord } from '../data/mockData.ts';
import { TENANT_MAPPING } from '../data/tenantConfig.ts';

export function getTenantId(tenantName: string): number {
  return TENANT_MAPPING[tenantName] || 1;
}

export function getAvailableUsers(tenantId: number, data: SalesRecord[]): string[] {
  const tenantData = data.filter(d => d.TenantId === tenantId);
  const users = Array.from(new Set(tenantData.map(d => d.UserName))).sort();
  return users.length > 0 ? users : ['No Users Found'];
}

export function getEffectiveUser(availableUsers: string[], selectedUser: string): string {
  if (availableUsers.includes(selectedUser)) {
    return selectedUser;
  }
  return availableUsers[0] || '';
}

// Re-export SalesRecord for tests that might be importing it from here
export type { SalesRecord };
