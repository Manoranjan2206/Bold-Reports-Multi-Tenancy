import React, { useRef, useEffect } from 'react';

interface ProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: string;
}

const ProfileDialog: React.FC<ProfileDialogProps> = ({ isOpen, onClose, user }) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Infer details from the user string
  const userInitial = user && user.length > 0 ? user.charAt(0).toUpperCase() : '?';
  const role = user.toLowerCase().includes('admin') ? 'Administrator' :
               user.toLowerCase().includes('sales') ? 'Sales Representative' : 'Viewer';

  return (
    <div className="fixed inset-0 z-[2147483647] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div
        ref={dialogRef}
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-sm flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
           <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
             <span className="material-symbols-outlined text-theme-teal">account_circle</span>
             User Profile
           </h2>
           <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 flex flex-col items-center space-y-6">
             <div className="size-20 rounded-full bg-theme-teal/10 flex items-center justify-center border-4 border-theme-teal/30 text-theme-teal font-bold text-3xl shadow-lg ring-4 ring-white dark:ring-slate-700">
                {userInitial}
             </div>

             <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">{user}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">{user.replace(/\s+/g, '.').toLowerCase()}@boldreports.com</p>
             </div>

             <div className="w-full bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4 text-sm text-slate-600 dark:text-slate-300 space-y-2 border border-slate-100 dark:border-slate-600/50">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-600/50">
                    <span className="font-medium text-slate-500 dark:text-slate-400">Role</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        role === 'Administrator' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                        role === 'Sales Representative' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-300'
                    }`}>
                        {role}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-500 dark:text-slate-400">Status</span>
                    <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium text-xs">
                        <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
                        Active
                    </span>
                </div>
             </div>

             <button
                onClick={onClose}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 group mt-2"
             >
                <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">logout</span>
                Sign Out
             </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDialog;
