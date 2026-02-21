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
  // --- Selection State (Dropdowns in Sidebar) ---
  const [selectedModel, setSelectedModel] = useState('Database per Tenant')
  const [selectedTenant, setSelectedTenant] = useState('Northwind Traders')
  const [selectedUser, setSelectedUser] = useState('')

  // --- Applied State (Passed to Dashboard/Report) ---
  const [appliedModel, setAppliedModel] = useState('Database per Tenant')
  const [appliedTenant, setAppliedTenant] = useState('Northwind Traders')
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
  // If the user manually selected something valid, use it.
  // If the current selection is invalid for the new tenant, default to the first available.
  const effectiveSelectedUser = useMemo(() => {
    if (availableUsers.includes(selectedUser)) {
      return selectedUser;
    }
    return availableUsers[0] || '';
  }, [availableUsers, selectedUser]);

  // Note: We need to update the dropdown 'value' to use this effective user,
  // but we also need a way to capture explicit user interaction.
  // The Sidebar's onChange will call setSelectedUser directly.

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
  // The initial state for appliedUser is empty string, which might be wrong if we want a default user.
  // We can use a useMemo to provide a fallback applied user if the state is empty, similar to above.
  const effectiveAppliedUser = useMemo(() => {
      if (appliedUser) return appliedUser;
      // If no applied user yet, try to default to the first user of the applied tenant (Northwind)
      // This logic mirrors the initial state setup.
      const initialTenantData = mockData.filter(d => d.TenantId === 1);
      const initialUsers = Array.from(new Set(initialTenantData.map(d => d.UserName))).sort();
      return initialUsers[0] || '';
  }, [appliedUser]);

  // If we really want to ensure the "appliedUser" state is populated initially without effect:
  // We can initialize the state with a calculated value if we move the logic outside the component or use lazy init.
  // For simplicity, let's just use `effectiveAppliedUser` wherever we used `appliedUser`.

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
      <Dashboard
        model={appliedModel}
        tenant={appliedTenant}
        user={effectiveAppliedUser}
        data={finalFilteredData}
        tenantId={appliedTenantId}
        userId={finalReportUserId}
      />

      {/* Modal shows technical details for the APPLIED configuration */}
      <IsolationDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        model={appliedModel}
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
