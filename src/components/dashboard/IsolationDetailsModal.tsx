import React, { useState } from 'react';
import siloImg from '../../assets/silo.png';
import schemaImg from '../../assets/schema.png';
import rowImg from '../../assets/row.png';
import { mockData } from '../../data/mockData';

interface IsolationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: string;
  tenant: string;
  user: string;
}

interface UserDetail {
    TenantId: number;
    UserName: string;
    Email: string;
    UserRole: string;
    Region: string;
}

const IsolationDetailsModal: React.FC<IsolationDetailsModalProps> = ({ isOpen, onClose, model, tenant, user }) => {
  const [activeTab, setActiveTab] = useState<'visualization' | 'accessPattern' | 'userDetails'>('visualization');

  if (!isOpen) return null;

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

  // We want to show one row per user, not per order.
  // Let's filter unique users by email/name
  const uniqueUsers = Object.values(mockData.reduce((acc, curr) => {
      const key = curr.UserName;
      if (!acc[key]) {
          acc[key] = {
            TenantId: curr.TenantId,
            UserName: curr.UserName,
            Email: curr.Email,
            UserRole: curr.UserRole,
            // Just inferring region from the first record for display
            Region: curr.Region
          };
      }
      return acc;
  }, {} as Record<string, UserDetail>)).sort((a, b) => a.TenantId - b.TenantId);

  const getTenantName = (id: number) => {
      if (id === 1) return "Northwind Traders";
      if (id === 2) return "Adventure Works";
      if (id === 3) return "Contoso Ltd";
      return "Unknown";
  }

  const getConnectionString = () => {
      if (model === 'Database per Tenant') {
          return `Server=tcp:demo.database.windows.net;Database=${tenant.replace(/\s+/g, '_')}_Db;User ID=app_user;Password=******;`;
      } else if (model === 'Schema per Tenant') {
          return `Server=tcp:demo.database.windows.net;Database=Shared_Db;Schema=${tenant.replace(/\s+/g, '')};User ID=app_user;Password=******;`;
      } else {
          return `Server=tcp:demo.database.windows.net;Database=Shared_Db;User ID=app_user;Password=******;`;
      }
  }

  const getFilterLogic = () => {
      if (model === 'Shared Database (RLS)') {
          return (
            <>
<span className="text-blue-600 dark:text-blue-400 font-bold">WHERE</span> {'\n'}
    TenantId = <span className="text-purple-600 dark:text-purple-400">'Guid-{tenant.substring(0,2).toUpperCase()}-883'</span> {'\n'}
    <span className="text-slate-400">-- Auto-injected RLS filter</span>{'\n'}
            </>
          );
      } else {
          return (
            <>
    <span className="text-slate-400">-- No WHERE clause needed (Isolated by {model === 'Schema per Tenant' ? 'Schema' : 'Database'})</span>{'\n'}
            </>
          );
      }
  }

  return (
    <div className="fixed inset-0 z-[2147483647] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Data Isolation Details</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 px-6 overflow-x-auto">
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
            <div className="flex flex-col items-center justify-center space-y-4">
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
             <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                 <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-[#f0f4f8] dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 uppercase font-semibold text-xs border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th className="px-6 py-3">Tenant</th>
                            <th className="px-6 py-3">Username</th>
                            <th className="px-6 py-3">User Email</th>
                            <th className="px-6 py-3">Access Scope</th>
                            <th className="px-6 py-3">Role</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-600 dark:text-slate-300">
                        {uniqueUsers.map((u, idx) => {
                            const isSelected = u.UserName === user;
                            return (
                                <tr
                                    key={idx}
                                    className={`
                                        transition-colors
                                        ${isSelected
                                            ? 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-l-fab-orange'
                                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}
                                    `}
                                >
                                    <td className="px-6 py-3 font-medium text-slate-900 dark:text-white">{getTenantName(u.TenantId)}</td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-2">
                                            {isSelected && <span className="material-symbols-outlined text-fab-orange text-sm">check_circle</span>}
                                            {u.UserName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 font-mono text-xs">{u.Email}</td>
                                    <td className="px-6 py-3">{u.Region}</td>
                                    <td className="px-6 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                            u.UserRole === 'Admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                            u.UserRole === 'Manager' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                            'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                                        }`}>
                                            {u.UserRole}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                 </table>
             </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end bg-slate-50 dark:bg-slate-800">
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
