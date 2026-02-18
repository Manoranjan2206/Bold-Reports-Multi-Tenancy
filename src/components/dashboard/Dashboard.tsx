import React from 'react';
import type { SalesRecord } from '../../data/mockData';

interface DashboardProps {
  model: string;
  tenant: string;
  user: string;
  data: SalesRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ tenant, user, data }) => {
  const userName = user.split(' (')[0];
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Embedded Report — Multi-Tenancy Demo</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Demonstrating secure data isolation based on tenant context.</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="size-2.5 rounded-full bg-theme-teal animate-pulse"></span>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Active Context: <span className="text-theme-green dark:text-theme-teal">{tenant}</span> / <span className="text-theme-blue dark:text-blue-400">{userName}</span></span>
        </div>
      </div>

      {/* Report Viewer */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden min-h-[500px] flex flex-col">
        <div className="bg-[#fcfcfc] dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 dark:text-slate-400"><span className="material-symbols-outlined text-[20px]">print</span></button>
            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 dark:text-slate-400"><span className="material-symbols-outlined text-[20px]">save_alt</span></button>
            <div className="h-4 w-px bg-slate-300 dark:bg-slate-600 mx-1"></div>
            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 dark:text-slate-400"><span className="material-symbols-outlined text-[20px]">first_page</span></button>
            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 dark:text-slate-400"><span className="material-symbols-outlined text-[20px]">chevron_left</span></button>
            <span className="text-xs text-slate-600 dark:text-slate-300 mx-1">1 of 4</span>
            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 dark:text-slate-400"><span className="material-symbols-outlined text-[20px]">chevron_right</span></button>
            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 dark:text-slate-400"><span className="material-symbols-outlined text-[20px]">last_page</span></button>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 dark:text-slate-400"><span className="material-symbols-outlined text-[20px]">zoom_in</span></button>
            <span className="text-xs text-slate-600 dark:text-slate-300">100%</span>
            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 dark:text-slate-400"><span className="material-symbols-outlined text-[20px]">zoom_out</span></button>
          </div>
        </div>
        <div className="flex-1 bg-white dark:bg-slate-800 p-8 flex flex-col items-center justify-center relative">
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 opacity-80">
            <div className="bg-white dark:bg-slate-700 p-4 border border-slate-100 dark:border-slate-600 shadow-sm rounded">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4">Sales by Category</h4>
              <div className="flex items-end justify-between h-40 gap-2 px-4">
                <div className="w-full bg-theme-blue/80 h-[60%] rounded-t"></div>
                <div className="w-full bg-theme-blue/60 h-[80%] rounded-t"></div>
                <div className="w-full bg-theme-blue/40 h-[40%] rounded-t"></div>
                <div className="w-full bg-theme-teal h-[90%] rounded-t"></div>
                <div className="w-full bg-theme-blue/70 h-[50%] rounded-t"></div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-700 p-4 border border-slate-100 dark:border-slate-600 shadow-sm rounded">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4">Regional Distribution</h4>
              <div className="relative size-32 mx-auto rounded-full border-[16px] border-slate-100 dark:border-slate-600 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-[16px] border-theme-teal border-l-transparent border-b-transparent rotate-45"></div>
                <div className="text-center">
                  <span className="block text-2xl font-bold text-slate-700 dark:text-slate-200">68%</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">NA Region</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-6 py-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg text-center">
              <p className="text-theme-green dark:text-theme-teal font-bold">Bold Reports Viewer</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Live Component Placeholder</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
          <span className="material-symbols-outlined text-theme-blue dark:text-blue-400">table_view</span>
          <h3 className="font-bold text-slate-700 dark:text-white">Sample Data Structure</h3>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Product</th>
                <th className="p-4">Region</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
              {data.map((record, index) => (
                <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="p-4 font-medium text-slate-800 dark:text-slate-200">
                    <div className="flex items-center gap-3">
                      <img src={record.ImageUrl} alt="" className="size-8 rounded-full object-cover bg-slate-200 dark:bg-slate-600" />
                      <div>
                        <div className="font-bold">{record.UserName}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{record.Country}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300">{new Date(record.ReportDate).toLocaleDateString()}</td>
                  <td className="p-4 text-slate-800 dark:text-slate-200 font-medium">{record.Product}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{record.Region}</td>
                  <td className="p-4 text-right font-mono font-medium dark:text-slate-200">{formatter.format(record.TotalSales)}</td>
                  <td className="p-4 text-center">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium">Paid</span>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                 <tr>
                   <td colSpan={6} className="p-8 text-center text-slate-500 dark:text-slate-400 italic">
                     No records found for the selected criteria.
                   </td>
                 </tr>
              )}
            </tbody>
          </table>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 text-center border-t border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500 dark:text-slate-400">Showing {data.length} records</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
