import React from 'react';
import { TENANTS, TENANT_MAPPING } from '../../data/tenantConfig';
import { mockDataByTenantAndUser } from '../../data/mockData';

interface SidebarProps {
  model: string;
  setModel: (value: string) => void;
  tenant: string;
  setTenant: (value: string) => void;
  user: string;
  setUser: (value: string) => void;
  availableUsers: string[];
  onRefresh: () => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ model, setModel, tenant, setTenant, user, setUser, availableUsers, onRefresh, isOpen }) => {
  // Derive numeric tenant id from tenant name
  const derivedTenantId = TENANT_MAPPING[tenant] ?? null;

  // Derive selected user id from mockData for the current tenant
  const selectedUserRecord = derivedTenantId && user ? mockDataByTenantAndUser[derivedTenantId]?.[user] : null;
  const selectedUserId = selectedUserRecord ? selectedUserRecord.UserId : null;
  return (
    <aside
      className={`
        bg-theme-green border-r border-white/10 shrink-0 overflow-y-auto text-white z-20 shadow-xl sidebar-scroll transition-all duration-300 ease-in-out
        ${isOpen ? 'w-[320px] translate-x-0' : 'w-0 -translate-x-full overflow-hidden opacity-0'}
      `}
    >
      <div className="p-6 flex flex-col gap-6 w-[320px]">
        <div className="mb-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-theme-teal mb-4">Configuration</h2>
        </div>

        {/* Data Isolation Model */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-slate-300">Data Isolation Model</label>
          <div className="relative">
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-black/20 border border-white/20 text-white text-sm rounded focus:ring-theme-teal focus:border-theme-teal block p-2.5 appearance-none"
            >
              <option>Database per Tenant</option>
              <option>Schema per Tenant</option>
              <option>Shared Database (RLS)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-300">
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </div>
          </div>
        </div>

        {/* Tenant */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-slate-300">Tenant</label>
          <div className="relative">
            <select
              value={tenant}
              onChange={(e) => setTenant(e.target.value)}
              className="w-full bg-black/20 border border-white/20 text-white text-sm rounded focus:ring-theme-teal focus:border-theme-teal block p-2.5 appearance-none"
            >
              {TENANTS.map((t) => (
                <option key={t.id}>{t.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-300">
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </div>
          </div>
            <div className="text-xs text-slate-400 mt-1">Tenant ID: {derivedTenantId ?? '-'}</div>
        </div>

        {/* User */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-slate-300">User</label>
          <div className="relative">
            <select
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full bg-black/20 border border-white/20 text-white text-sm rounded focus:ring-theme-teal focus:border-theme-teal block p-2.5 appearance-none"
            >
              {availableUsers.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-300">
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </div>
          </div>
          <div className="text-xs text-slate-400 mt-1">User ID: {selectedUserId ?? '-'}</div>
        </div>

        <button
          onClick={onRefresh}
          className="w-full flex items-center justify-center gap-2 bg-theme-blue hover:bg-blue-600 text-white font-semibold py-2.5 px-4 rounded transition-colors shadow-md mt-2"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Refresh Report
        </button>

        <div className="h-px bg-white/10 my-2"></div>

      </div>
    </aside>
  );
};

export default Sidebar;
