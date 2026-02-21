import React from 'react';

interface HeaderProps {
  onToggleModal: () => void;
  theme: string;
  toggleTheme: () => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleModal, theme, toggleTheme, onToggleSidebar }) => {
  return (
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
        <button
          onClick={onToggleModal}
          className="flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors"
          title="Data Isolation Details"
        >
          <span className="material-symbols-outlined text-[20px]">info</span>
        </button>

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

        <a className="text-sm hover:text-white transition-colors" href="#">Help</a>
        <a className="text-sm hover:text-white transition-colors" href="#">Profile</a>
        <div className="size-8 rounded-full bg-theme-teal/20 flex items-center justify-center border border-theme-teal/40 text-theme-teal font-bold text-xs">
          JD
        </div>
      </div>
    </header>
  );
};

export default Header;
