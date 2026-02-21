import React, { type ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  model: string;
  setModel: (value: string) => void;
  tenant: string;
  setTenant: (value: string) => void;
  user: string;
  setUser: (value: string) => void;
  availableUsers: string[];
  onRefresh: () => void;
  onToggleModal: () => void;
  theme: string;
  toggleTheme: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  model, setModel,
  tenant, setTenant,
  user, setUser,
  availableUsers,
  onRefresh,
  onToggleModal,
  theme,
  toggleTheme,
  isSidebarOpen,
  setIsSidebarOpen
}) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-page-bg dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-display transition-colors">
      <Header
        onToggleModal={onToggleModal}
        theme={theme}
        toggleTheme={toggleTheme}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          model={model} setModel={setModel}
          tenant={tenant} setTenant={setTenant}
          user={user} setUser={setUser}
          availableUsers={availableUsers}
          onRefresh={onRefresh}
          isOpen={isSidebarOpen}
        />
        <main className="flex-1 flex flex-col relative bg-page-bg dark:bg-slate-900 transition-colors overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
