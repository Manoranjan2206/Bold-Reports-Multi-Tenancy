export interface Tenant {
  id: number;
  name: string;
  slug: string;
  domain: string;
}

export const TENANTS: Tenant[] = [
  { id: 1, name: "Northwind Traders", slug: "northwind_traders", domain: "northwindtraders.com" },
  { id: 2, name: "Adventure Works", slug: "adventure_works", domain: "adventure-works.com" },
  { id: 3, name: "Contoso Ltd", slug: "contoso_ltd", domain: "contoso.com" }
];

export const getTenantById = (id: number): Tenant => {
  const tenant = TENANTS.find(t => t.id === id);
  if (tenant) return tenant;
  return { id, name: "Unknown Tenant", slug: "unknown", domain: "example.com" };
};

export const TENANT_MAPPING: Record<string, number> = TENANTS.reduce((acc, tenant) => {
  acc[tenant.name] = tenant.id;
  return acc;
}, {} as Record<string, number>);
