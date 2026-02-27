import React, { useState, useMemo } from 'react';
import siloImg from '../../assets/silo.png';
import schemaImg from '../../assets/schema.png';
import rowImg from '../../assets/row.png';
import { mockData } from '../../data/mockData';
import type { SalesRecord } from '../../data/mockData';

interface IsolationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: string;
  tenant: string;
  user: string;
}

interface EnrichedUserDetail {
    TenantId: number;
    TenantName: string;
    UserName: string;
    Email: string;
    UserRole: string;
    Region: string;
    DbMapping: string;
    RlsFilter: string;
}

const IsolationDetailsModal: React.FC<IsolationDetailsModalProps> = ({ isOpen, onClose, model, tenant, user }) => {
  const [activeTab, setActiveTab] = useState<'visualization' | 'accessPattern' | 'userDetails'>('visualization');

  const getVisualizationImage = () => {
    switch (model) {
      case 'Database per Tenant':
        return siloImg;
      case 'Schema per Tenant':
        return schemaImg;
      case 'Shared Database (RLS)':
        return rowImg;
      default:
        return siloImg;
    }
  };

  const getTenantName = (id: number) => {
      if (id === 1) return "Northwind Traders";
      if (id === 2) return "Adventure Works";
      if (id === 3) return "Contoso Ltd";
      return "Unknown Tenant";
  };

  const getTenantSlug = (id: number) => {
      if (id === 1) return "northwind_traders";
      if (id === 2) return "adventure_works";
      if (id === 3) return "contoso_ltd";
      return "unknown";
  };

  const getTenantDomain = (id: number) => {
      if (id === 1) return "northwindtraders.com";
      if (id === 2) return "adventure-works.com";
      if (id === 3) return "contoso.com";
      return "example.com";
  };

  // Group users by TenantId
  const groupedUsers = useMemo(() => {
    // 1. Flatten mockData to unique (TenantId, UserName) tuples
    const uniqueUserMap = new Map<string, EnrichedUserDetail>();

    mockData.forEach((record: SalesRecord) => {
        const key = `${record.TenantId}-${record.UserName}`;
        if (!uniqueUserMap.has(key)) {
            const email = `${record.UserName.toLowerCase().replace(' ', '.')}@${getTenantDomain(record.TenantId)}`;

            let dbMapping = "";
            if (model === 'Database per Tenant') {
                 dbMapping = `'sales_analysis_db':'${getTenantSlug(record.TenantId)}_sales_analysis'`;
            } else if (model === 'Schema per Tenant') {
                 dbMapping = `'sales_analysis_db':'Shared_Db', 'schema':'${getTenantSlug(record.TenantId)}'`;
            } else {
                 dbMapping = `'sales_analysis_db':'Shared_Db'`;
            }

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
  }, [model]);

  // Find current user's details for access pattern logic
  // We just take the first matching user record regardless of tenant context for this specific demo logic,
  // or filter by the passed `tenant` prop if needed.
  // For simplicity in the "Access Pattern" tab, we assume the user is valid.
  const isTenantAdmin = user.includes("Admin");

  const currentUserRegion = useMemo(() => mockData.find(u => u.UserName === user)?.Region || 'North America', [user]);

  const getConnectionString = () => {
      if (model === 'Database per Tenant') {
          return `Server=tcp:demo.database.windows.net;Database=${tenant.replace(/\s+/g, '_')}_Db;User ID=app_user;Password=******;`;
      } else if (model === 'Schema per Tenant') {
          return `Server=tcp:demo.database.windows.net;Database=Shared_Db;Schema=${tenant.replace(/\s+/g, '')};User ID=app_user;Password=******;`;
      } else {
          return `Server=tcp:demo.database.windows.net;Database=Shared_Db;User ID=app_user;Password=******;`;
      }
  };

  const getFilterLogic = () => {
      const regionFilter = isTenantAdmin ? null : (
          <>    AND Region = <span className="text-purple-600 dark:text-purple-400">'North America'</span> <span className="text-slate-400">-- Role-based filter</span>{'\n'}</>
      );

      if (model === 'Shared Database (RLS)') {
          return (
            <>
<span className="text-blue-600 dark:text-blue-400 font-bold">WHERE</span> {'\n'}
    TenantId = <span className="text-purple-600 dark:text-purple-400">'Guid-{tenant.substring(0,2).toUpperCase()}-883'</span> {'\n'}
    <span className="text-slate-400">-- Auto-injected RLS filter</span>{'\n'}
{isTenantAdmin ? null : (
<>    AND UserName = <span className="text-purple-600 dark:text-purple-400">'{user}'</span> <span className="text-slate-400">-- User context filter</span>{'\n'}</>
)}
{regionFilter}
            </>
          );
      } else if (model === 'Schema per Tenant') {
          if (isTenantAdmin) {
               return (
                <>
    <span className="text-slate-400">-- No WHERE clause needed (Admin Access + Isolated Schema)</span>{'\n'}
                </>
              );
          } else {
              return (
                <>
<span className="text-blue-600 dark:text-blue-400 font-bold">WHERE</span> {'\n'}
    Region = <span className="text-purple-600 dark:text-purple-400">'{currentUserRegion}'</span> {'\n'}
    <span className="text-slate-400">-- Region-based filter within isolated Schema</span>{'\n'}
                </>
              );
          }
      } else {
          if (isTenantAdmin) {
               return (
                <>
    <span className="text-slate-400">-- No WHERE clause needed (Admin Access + Isolated DB)</span>{'\n'}
                </>
              );
          } else {
              return (
                <>
<span className="text-blue-600 dark:text-blue-400 font-bold">WHERE</span> {'\n'}
    UserName = <span className="text-purple-600 dark:text-purple-400">'{user}'</span> {'\n'}
    <span className="text-slate-400">-- User context filter within isolated DB</span>{'\n'}
                </>
              );
          }
      }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2147483647] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Data Isolation Details</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 px-6 shrink-0 bg-white dark:bg-slate-800">
          <button
            onClick={() => setActiveTab('visualization')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'visualization'
                ? 'border-theme-teal text-theme-teal'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Visualization
          </button>
          <button
            onClick={() => setActiveTab('accessPattern')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'accessPattern'
                ? 'border-theme-teal text-theme-teal'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Access Pattern
          </button>
          <button
            onClick={() => setActiveTab('userDetails')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'userDetails'
                ? 'border-theme-teal text-theme-teal'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            User Details
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50 dark:bg-slate-900/50">
          {activeTab === 'visualization' && (
            <div className="flex flex-col items-center justify-center space-y-4 h-full">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 w-full flex justify-center">
                 <img
                   src={getVisualizationImage()}
                   alt={`${model} Visualization`}
                   className="max-h-[400px] w-auto object-contain"
                 />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-2xl">
                Current Model: <span className="font-semibold text-slate-700 dark:text-slate-300">{model}</span>.
                This diagram illustrates how data is physically separated or logically isolated based on the selected strategy.
              </p>
            </div>
          )}

          {activeTab === 'accessPattern' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Resolved Connection String</span>
                  <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 rounded">Secret</span>
                </div>
                <pre className="bg-slate-800 text-slate-200 p-4 rounded text-xs font-mono overflow-x-auto border border-slate-700">
                  <code>
                    {getConnectionString()}
                  </code>
                </pre>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Generated SQL Query</span>
                  <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-1.5 rounded border border-green-200 dark:border-green-800">Executed</span>
                </div>
                <pre className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 p-4 rounded text-xs font-mono overflow-x-auto border border-slate-300 dark:border-slate-700 shadow-sm leading-relaxed">
                  <code>
<span className="text-blue-600 dark:text-blue-400 font-bold">SELECT</span>{'\n'}
    Region, {'\n'}
    SUM(Amount) as TotalSales {'\n'}
<span className="text-blue-600 dark:text-blue-400 font-bold">FROM</span> {'\n'}
    SalesRecords {'\n'}
{getFilterLogic()}
<span className="text-blue-600 dark:text-blue-400 font-bold">GROUP BY</span> {'\n'}
    Region;
                  </code>
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'userDetails' && (
             <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                 <table className="min-w-full text-left text-sm whitespace-nowrap border-collapse">
                    <thead className="bg-[#f0f4f8] dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 font-bold text-xs border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th className="px-6 py-4 border-r border-slate-200 dark:border-slate-700">Tenant</th>
                            <th className="px-6 py-4 border-r border-slate-200 dark:border-slate-700">Username</th>
                            <th className="px-6 py-4 border-r border-slate-200 dark:border-slate-700">User Email</th>
                            <th className="px-6 py-4 border-r border-slate-200 dark:border-slate-700">Database Mapping (Custom Attribute)</th>
                            <th className="px-6 py-4">Row-Level Security (Filter Parameter)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-600 dark:text-slate-300">
                        {groupedUsers.map((group) => (
                            <React.Fragment key={group.tenantId}>
                                {group.users.map((u, idx) => {
                                    const isFirst = idx === 0;
                                    const isSelected = u.UserName === user; // Highlight if matches current user context
                                    return (
                                        <tr
                                            key={`${u.TenantId}-${u.UserName}`}
                                            className={`
                                                transition-colors
                                                ${isSelected ? 'bg-yellow-50 dark:bg-yellow-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}
                                            `}
                                        >
                                            {isFirst && (
                                                <td
                                                    rowSpan={group.users.length}
                                                    className="px-6 py-4 font-medium text-slate-900 dark:text-white bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 align-middle"
                                                >
                                                    {group.tenantName}
                                                </td>
                                            )}

                                            <td className="px-6 py-4 border-r border-slate-200 dark:border-slate-700 bg-inherit">
                                                <div className="flex items-center gap-2">
                                                    {u.UserName}
                                                    {isSelected && <span className="material-symbols-outlined text-fab-orange text-sm" title="Active Context">check_circle</span>}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 border-r border-slate-200 dark:border-slate-700 font-mono text-xs bg-inherit">
                                                {u.Email}
                                            </td>

                                            {isFirst && (
                                                <td
                                                    rowSpan={group.users.length}
                                                    className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 align-middle"
                                                >
                                                    {u.DbMapping}
                                                </td>
                                            )}

                                            <td className="px-6 py-4 text-xs bg-inherit">
                                                {u.RlsFilter}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </tbody>
                 </table>
             </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end bg-slate-50 dark:bg-slate-800 shrink-0">
            <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded text-sm font-medium transition-colors"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default IsolationDetailsModal;
