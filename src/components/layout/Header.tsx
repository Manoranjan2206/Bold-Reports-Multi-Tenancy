import React, { useState } from 'react';
import ProfileDialog from './ProfileDialog';

interface HeaderProps {
  onToggleModal: () => void;
  theme: string;
  toggleTheme: () => void;
  onToggleSidebar: () => void;
  user?: string; // Add user prop
  tenant?: string;
  tenantId?: number;
  userId?: number;
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ onToggleModal, theme, toggleTheme, onToggleSidebar, user, tenant, tenantId, userId, userName }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Extract initial for avatar
  const userInitial = user && user.length > 0 ? user.charAt(0).toUpperCase() : '?';

  return (
    <>
      <header className="h-16 bg-theme-green flex items-center justify-between px-4 shrink-0 shadow-md z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="text-white hover:bg-white/10 rounded-full p-2 transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
          <div className="flex items-center gap-2 text-white">
            <span className="material-symbols-outlined text-[24px]">analytics</span>
            <h1 className="text-lg font-bold tracking-wide">Bold Reports — Multi-Tenancy Demo</h1>
          </div>
        </div>
        <div className="flex items-center gap-4 text-white/90">

          {/* Tenant/User summary */}
          <div className="hidden sm:flex flex-col text-right text-white/90 mr-2">
            <span className="text-xs text-white/90">{tenant || 'Tenant'}</span>
            <span className="text-[11px] text-white/80">{userName || user || 'User'}</span>
            <span className="text-[10px] text-white/60">ID: {userId ?? '-' } / TID: {tenantId ?? '-'}</span>
          </div>

          {/* Info/Modal Button */}
          <button
            onClick={onToggleModal}
            className="flex items-center gap-2 px-3 py-1 rounded-full hover:bg-white/10 transition-colors"
            title="Data Isolation Details"
          >
            <span className="material-symbols-outlined text-[20px]">architecture</span>
            <span className="text-sm font-medium text-white/90">Details</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          <div className="h-6 w-px bg-white/20 mx-2"></div>

          {/* Help Button */}
          <a
            href="#"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full hover:bg-white/10 hover:text-white transition-all group"
          >
            <span className="material-symbols-outlined text-[18px] text-theme-teal group-hover:text-white transition-colors">help</span>
            <span>Help</span>
          </a>

          {/* Profile Button - Now opens Dialog */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-white/10 transition-all group ml-1"
          >
            <span className="text-sm font-medium group-hover:text-white transition-colors">Profile</span>
            <div className="size-8 rounded-full bg-theme-teal/20 flex items-center justify-center border border-theme-teal/40 text-theme-teal font-bold text-xs shadow-sm ring-2 ring-transparent group-hover:ring-white/20 transition-all">
              {userInitial}
            </div>
          </button>

        </div>
      </header>

      <ProfileDialog
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user || 'Guest User'}
      />
    </>
  );
};

export default Header;
