import { useState, useMemo } from 'react'
import Layout from './components/layout/Layout'
import Dashboard from './components/dashboard/Dashboard'
import IsolationDetailsModal from './components/dashboard/IsolationDetailsModal'
import { mockData } from './data/mockData'

const TENANT_MAPPING: Record<string, number> = {
  "Northwind Traders": 1,
  "Adventure Works": 2,
  "Contoso Ltd": 3
}

function App() {
  const [model, setModel] = useState('Database per Tenant')
  const [tenant, setTenant] = useState('Northwind Traders')
  const [user, setUser] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [theme, setTheme] = useState('light')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Filter data based on selected Tenant
  const tenantId = TENANT_MAPPING[tenant] || 1
  const tenantData = useMemo(() => mockData.filter(d => d.TenantId === tenantId), [tenantId])

  // Get available users for this tenant
  const availableUsers = useMemo(() => {
     const users = Array.from(new Set(tenantData.map(d => d.UserName))).sort()
     return users.length > 0 ? users : ['No Users Found']
  }, [tenantData])

  // Derive the effectively selected user
  // If the current 'user' state is not in the available users list (or empty), default to the first available user.
  const effectiveUser = useMemo(() => {
    if (user && availableUsers.includes(user)) {
      return user
    }
    return availableUsers[0] || ''
  }, [availableUsers, user])

  // Filter data based on effectiveUser
  const filteredData = useMemo(() => {
    if (!effectiveUser) return tenantData
    return tenantData.filter(d => d.UserName === effectiveUser)
  }, [tenantData, effectiveUser])

  // Derive userId for the report viewer
  const userId = useMemo(() => {
      if (!effectiveUser) return 0;
      const userRecord = tenantData.find(u => u.UserName === effectiveUser);
      return userRecord ? userRecord.UserId : 0;
  }, [tenantData, effectiveUser]);

  const handleRefresh = () => {
    // Add logic to refresh the report
    console.log('Refreshing report...')
  }

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
      model={model} setModel={setModel}
      tenant={tenant} setTenant={setTenant}
      user={effectiveUser} setUser={setUser}
      availableUsers={availableUsers}
      onRefresh={handleRefresh}
      onToggleModal={() => setIsModalOpen(true)}
      theme={theme}
      toggleTheme={toggleTheme}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
    >
      <Dashboard
        model={model}
        tenant={tenant}
        user={effectiveUser}
        data={filteredData}
        tenantId={tenantId}
        userId={userId}
      />

      {/* Modal */}
      <IsolationDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        model={model}
      />

      {/* FAB */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="size-14 rounded-full bg-fab-orange text-white shadow-lg hover:bg-orange-500 hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center group">
          <span className="material-symbols-outlined text-[28px]">add</span>
          <div className="absolute bottom-full right-0 mb-2 w-max px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            New Query
          </div>
        </button>
      </div>
    </Layout>
  )
}

export default App
