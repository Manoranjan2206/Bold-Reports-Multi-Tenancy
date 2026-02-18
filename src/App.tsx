import { useState, useMemo, useEffect } from 'react'
import Layout from './components/layout/Layout'
import Dashboard from './components/dashboard/Dashboard'
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

  // Filter data based on selected Tenant
  const tenantId = TENANT_MAPPING[tenant] || 1
  const tenantData = useMemo(() => mockData.filter(d => d.TenantId === tenantId), [tenantId])

  // Get available users for this tenant
  const availableUsers = useMemo(() => {
     const users = Array.from(new Set(tenantData.map(d => d.UserName))).sort()
     return users.length > 0 ? users : ['No Users Found']
  }, [tenantData])

  // Automatically select the first user when tenant changes (or if current user is invalid for new tenant)
  useEffect(() => {
    if (availableUsers.length > 0 && !availableUsers.includes(user)) {
      setUser(availableUsers[0])
    }
  }, [availableUsers, user])

  // Filter data based on selected User (if any)
  const filteredData = useMemo(() => {
    if (!user) return tenantData
    return tenantData.filter(d => d.UserName === user)
  }, [tenantData, user])

  const handleRefresh = () => {
    // Add logic to refresh the report
    console.log('Refreshing report...')
  }

  return (
    <Layout
      model={model} setModel={setModel}
      tenant={tenant} setTenant={setTenant}
      user={user} setUser={setUser}
      availableUsers={availableUsers}
      onRefresh={handleRefresh}
    >
      <Dashboard model={model} tenant={tenant} user={user} data={filteredData} />

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
