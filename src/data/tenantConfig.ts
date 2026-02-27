export interface Tenant {
  id: number;
  name: string;
  slug: string;
  domain: string;
}

export const tenants: Tenant[] = [
  {
    id: 1,
    name: "Northwind Traders",
    slug: "northwind_traders",
    domain: "northwindtraders.com"
  },
  {
    id: 2,
    name: "Adventure Works",
    slug: "adventure_works",
    domain: "adventure-works.com"
  },
  {
    id: 3,
    name: "Contoso Ltd",
    slug: "contoso_ltd",
    domain: "contoso.com"
  }
];

export const getTenantById = (id: number): Tenant | undefined => {
  return tenants.find(t => t.id === id);
};

export const getTenantByName = (name: string): Tenant | undefined => {
  return tenants.find(t => t.name === name);
};
