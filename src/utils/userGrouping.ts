import type { SalesRecord } from '../data/mockData';

export interface EnrichedUserDetail {
    TenantId: number;
    TenantName: string;
    UserName: string;
    Email: string;
    UserRole: string;
    Region: string;
    DbMapping: string;
    RlsFilter: string;
}

export interface GroupedUser {
    tenantId: number;
    tenantName: string;
    users: EnrichedUserDetail[];
}

export const getTenantName = (id: number) => {
    if (id === 1) return "Northwind Traders";
    if (id === 2) return "Adventure Works";
    if (id === 3) return "Contoso Ltd";
    return "Unknown Tenant";
};

export const getTenantSlug = (id: number) => {
    if (id === 1) return "northwind_traders";
    if (id === 2) return "adventure_works";
    if (id === 3) return "contoso_ltd";
    return "unknown";
};

export const getTenantDomain = (id: number) => {
    if (id === 1) return "northwindtraders.com";
    if (id === 2) return "adventure-works.com";
    if (id === 3) return "contoso.com";
    return "example.com";
};

export const groupUsersByTenant = (data: SalesRecord[]): GroupedUser[] => {
    // 1. Flatten mockData to unique (TenantId, UserName) tuples
    const uniqueUserMap = new Map<string, EnrichedUserDetail>();

    data.forEach((record: SalesRecord) => {
        const key = `${record.TenantId}-${record.UserName}`;
        if (!uniqueUserMap.has(key)) {
            const email = `${record.UserName.toLowerCase().replace(' ', '.')}@${getTenantDomain(record.TenantId)}`;
            const dbMapping = `'sales_analysis_db':'${getTenantSlug(record.TenantId)}_sales_analysis'`;

            // Infer role/RLS based on mock data patterns or just random assignment for demo variety
            // In a real app, this comes from the auth provider
            const isManager = record.UserName.startsWith("O") || record.UserName.startsWith("J");
            const userRole = isManager ? "Manager" : "Viewer";

            const rlsFilter = isManager
                ? `Region=${record.Region}, Other (Client-configured RLS)`
                : `Region=${record.Region} (Preconfigured RLS)`;

            uniqueUserMap.set(key, {
                TenantId: record.TenantId,
                TenantName: getTenantName(record.TenantId),
                UserName: record.UserName,
                Email: email,
                UserRole: userRole,
                Region: record.Region,
                DbMapping: dbMapping,
                RlsFilter: rlsFilter
            });
        }
    });

    const allUsers = Array.from(uniqueUserMap.values());

    // Group by TenantId
    const groups: Record<number, EnrichedUserDetail[]> = {};
    allUsers.forEach(u => {
        if (!groups[u.TenantId]) groups[u.TenantId] = [];
        groups[u.TenantId].push(u);
    });

    // Sort tenants by ID
    return Object.keys(groups).map(id => Number(id)).sort((a,b) => a - b).map(id => ({
        tenantId: id,
        tenantName: getTenantName(id),
        users: groups[id]
    }));
};
