import { useState, useMemo } from 'react'
import Layout from './components/layout/Layout'
import IsolationDetailsModal from './components/dashboard/IsolationDetailsModal'
import ReportViewer from './components/dashboard/ReportViewer'
import { mockData } from './data/mockData'
import { tenants } from './data/tenantConfig'

const TENANT_MAPPING: Record<string, number> = tenants.reduce((acc, tenant) => {
  acc[tenant.name] = tenant.id;
  return acc;
}, {} as Record<string, number>);

function App() {
  // --- Selection State (Dropdowns in Sidebar) ---
  const [selectedModel, setSelectedModel] = useState('Database per Tenant')
  const [selectedTenant, setSelectedTenant] = useState(tenants[0].name)
  const [selectedUser, setSelectedUser] = useState('')

  // --- Applied State (Passed to Dashboard/Report) ---
  const [appliedModel, setAppliedModel] = useState('Database per Tenant')
  const [appliedTenant, setAppliedTenant] = useState(tenants[0].name)
  const [appliedUser, setAppliedUser] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [theme, setTheme] = useState('light')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // 1. Calculate available users based on *Selected* Tenant
  const selectedTenantId = TENANT_MAPPING[selectedTenant] || 1
  const selectedTenantData = useMemo(() => mockData.filter(d => d.TenantId === selectedTenantId), [selectedTenantId])

  const availableUsers = useMemo(() => {
     const users = Array.from(new Set(selectedTenantData.map(d => d.UserName))).sort()
     return users.length > 0 ? users : ['No Users Found']
  }, [selectedTenantData])

  // Derive "Effective" Selected User
  // Instead of syncing state with useEffect, we compute the valid user on the fly.
  const effectiveSelectedUser = useMemo(() => {
    if (availableUsers.includes(selectedUser)) {
      return selectedUser;
    }
    return availableUsers[0] || '';
  }, [availableUsers, selectedUser]);


  // 2. Derive Applied Data for Dashboard based on *Applied* state
  const appliedTenantId = TENANT_MAPPING[appliedTenant] || 1
  const appliedTenantData = useMemo(() => mockData.filter(d => d.TenantId === appliedTenantId), [appliedTenantId])


  // 3. Handle Refresh Button Click
  const handleRefresh = () => {
    // When refreshing, we commit the *effective* selected user to be the applied user.
    console.log('Refreshing report with:', selectedModel, selectedTenant, effectiveSelectedUser)
    setAppliedModel(selectedModel)
    setAppliedTenant(selectedTenant)
    setAppliedUser(effectiveSelectedUser)
  }

  // Initialize applied state correctly on first render if needed, or ensure defaults match.
  const effectiveAppliedUser = useMemo(() => {
      if (appliedUser) return appliedUser;
      const initialTenantData = mockData.filter(d => d.TenantId === 1);
      const initialUsers = Array.from(new Set(initialTenantData.map(d => d.UserName))).sort();
      return initialUsers[0] || '';
  }, [appliedUser]);

  // Re-derive reportUserId using effectiveAppliedUser
  const finalReportUserId = useMemo(() => {
      const userToUse = effectiveAppliedUser;
      if (!userToUse) return 0;
      const userRecord = appliedTenantData.find(u => u.UserName === userToUse);
      return userRecord ? userRecord.UserId : 0;
  }, [appliedTenantData, effectiveAppliedUser]);

  // Re-derive filteredData using effectiveAppliedUser
  const finalFilteredData = useMemo(() => {
    const userToUse = effectiveAppliedUser;
    if (!userToUse) return appliedTenantData
    return appliedTenantData.filter(d => d.UserName === userToUse)
  }, [appliedTenantData, effectiveAppliedUser])

  const userName = effectiveAppliedUser.split(' (')[0];
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newTheme;
    });
  }

  return (
    <Layout
      model={selectedModel} setModel={setSelectedModel}
      tenant={selectedTenant} setTenant={setSelectedTenant}
      user={effectiveSelectedUser} setUser={setSelectedUser}
      availableUsers={availableUsers}
      onRefresh={handleRefresh}
      onToggleModal={() => setIsModalOpen(true)}
      theme={theme}
      toggleTheme={toggleTheme}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
    >
      <div className="w-full h-full flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900">

        {/* Top Bar - Denser */}
        <div className="flex items-center justify-between px-6 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shrink-0">
            <div>
            <h1 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">Sales Order Detail</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Multi-Tenancy Demo Report</p>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 rounded bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                    <span className="size-2 rounded-full bg-theme-teal animate-pulse"></span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {appliedTenant} <span className="text-slate-400 mx-1">/</span> {userName}
                    </span>
                </div>
            </div>
        </div>

        {/* Main Content Area - Split View or just Full Viewer */}
        <div className="flex-1 flex flex-col overflow-hidden p-4 gap-4">

            {/* Report Viewer Container - Maximized space */}
            <ReportViewer
                tenantId={appliedTenantId}
                userId={finalReportUserId}
            />

            {/* Sample Data Table - Collapsible or smaller at bottom */}
            <div className="h-64 shrink-0 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
                <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-theme-blue dark:text-blue-400 text-lg">table_view</span>
                    <h3 className="font-bold text-sm text-slate-700 dark:text-white">Sample Data Preview</h3>
                </div>
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-700 shadow-sm">
                        <tr className="text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                            <th className="p-3 border-b border-slate-200 dark:border-slate-600">Customer</th>
                            <th className="p-3 border-b border-slate-200 dark:border-slate-600">Date</th>
                            <th className="p-3 border-b border-slate-200 dark:border-slate-600">Product</th>
                            <th className="p-3 border-b border-slate-200 dark:border-slate-600">Region</th>
                            <th className="p-3 text-right border-b border-slate-200 dark:border-slate-600">Amount</th>
                            <th className="p-3 text-center border-b border-slate-200 dark:border-slate-600">Status</th>
                        </tr>
                        </thead>
                        <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-700">
                        {finalFilteredData.map((record, index) => (
                            <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                            <td className="p-3 font-medium text-slate-800 dark:text-slate-200">
                                <div className="flex items-center gap-2">
                                <img src={record.ImageUrl} alt="" className="size-6 rounded-full object-cover bg-slate-200 dark:bg-slate-600" />
                                <span>{record.UserName}</span>
                                </div>
                            </td>
                            <td className="p-3 text-slate-700 dark:text-slate-300">{new Date(record.ReportDate).toLocaleDateString()}</td>
                            <td className="p-3 text-slate-800 dark:text-slate-200 font-medium">{record.Product}</td>
                            <td className="p-3 text-slate-600 dark:text-slate-400">{record.Region}</td>
                            <td className="p-3 text-right font-mono font-medium dark:text-slate-200">{formatter.format(record.TotalSales)}</td>
                            <td className="p-3 text-center">
                                <span className="px-2 py-0.5 rounded-full text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium">Paid</span>
                            </td>
                            </tr>
                        ))}
                        {finalFilteredData.length === 0 && (
                            <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-500 dark:text-slate-400 italic">
                                No records found for the selected criteria.
                            </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
      </div>

      {/* Modal shows technical details for the APPLIED configuration */}
      <IsolationDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        model={appliedModel}
        tenant={appliedTenant}
        user={userName}
      />

      {/* FAB */}
      <div className="fixed bottom-8 right-8 z-50">
        <a
          href="https://support.boldreports.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="size-14 rounded-full bg-fab-orange text-white shadow-lg hover:bg-orange-500 hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center group"
        >
          <span className="material-symbols-outlined text-[28px]">add</span>
          <div className="absolute bottom-full right-0 mb-2 w-max px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            New Query
          </div>
        </a>
      </div>
    </Layout>
  )
}

export default App
