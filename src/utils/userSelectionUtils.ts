
// Mocking the SalesRecord interface since imports are failing in test runner
export interface SalesRecord {
    UserId: number;
    UserName: string;
    Region: string;
    Country: string;
    TenantId: number;
    Product: string;
    TotalSales: number;
    UnitsSold: number;
    ReportDate: string;
    ImageUrl: string;
}

export const TENANT_MAPPING: Record<string, number> = {
  "Northwind Traders": 1,
  "Adventure Works": 2,
  "Contoso Ltd": 3
};

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
