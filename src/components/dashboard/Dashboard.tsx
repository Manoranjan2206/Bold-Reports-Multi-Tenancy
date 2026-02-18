import React from 'react';
import type { SalesRecord } from '../../data/mockData';

interface DashboardProps {
  model: string;
  tenant: string;
  user: string;
  data: SalesRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ model: _model, tenant, user, data }) => {
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
          <h1 className="text-2xl font-bold text-slate-800">Embedded Report — Multi-Tenancy Demo</h1>
          <p className="text-slate-500 mt-1">Demonstrating secure data isolation based on tenant context.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
          <span className="size-2.5 rounded-full bg-theme-teal animate-pulse"></span>
          <span className="text-xs font-semibold text-slate-600">Active Context: <span className="text-theme-green">{tenant}</span> / <span className="text-theme-blue">{userName}</span></span>
        </div>
      </div>

      {/* Report Viewer */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden min-h-[500px] flex flex-col">
        <div className="bg-[#fcfcfc] border-b border-slate-200 p-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500"><span className="material-symbols-outlined text-[20px]">print</span></button>
            <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500"><span className="material-symbols-outlined text-[20px]">save_alt</span></button>
            <div className="h-4 w-px bg-slate-300 mx-1"></div>
            <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500"><span className="material-symbols-outlined text-[20px]">first_page</span></button>
            <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500"><span className="material-symbols-outlined text-[20px]">chevron_left</span></button>
            <span className="text-xs text-slate-600 mx-1">1 of 4</span>
            <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500"><span className="material-symbols-outlined text-[20px]">chevron_right</span></button>
            <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500"><span className="material-symbols-outlined text-[20px]">last_page</span></button>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500"><span className="material-symbols-outlined text-[20px]">zoom_in</span></button>
            <span className="text-xs text-slate-600">100%</span>
            <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500"><span className="material-symbols-outlined text-[20px]">zoom_out</span></button>
          </div>
        </div>
        <div className="flex-1 bg-white p-8 flex flex-col items-center justify-center relative">
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 opacity-80">
            <div className="bg-white p-4 border border-slate-100 shadow-sm rounded">
              <h4 className="text-sm font-bold text-slate-700 mb-4">Sales by Category</h4>
              <div className="flex items-end justify-between h-40 gap-2 px-4">
                <div className="w-full bg-theme-blue/80 h-[60%] rounded-t"></div>
                <div className="w-full bg-theme-blue/60 h-[80%] rounded-t"></div>
                <div className="w-full bg-theme-blue/40 h-[40%] rounded-t"></div>
                <div className="w-full bg-theme-teal h-[90%] rounded-t"></div>
                <div className="w-full bg-theme-blue/70 h-[50%] rounded-t"></div>
              </div>
            </div>
            <div className="bg-white p-4 border border-slate-100 shadow-sm rounded">
              <h4 className="text-sm font-bold text-slate-700 mb-4">Regional Distribution</h4>
              <div className="relative size-32 mx-auto rounded-full border-[16px] border-slate-100 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-[16px] border-theme-teal border-l-transparent border-b-transparent rotate-45"></div>
                <div className="text-center">
                  <span className="block text-2xl font-bold text-slate-700">68%</span>
                  <span className="text-[10px] text-slate-500">NA Region</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-lg border border-slate-200 shadow-lg text-center">
              <p className="text-theme-green font-bold">Bold Reports Viewer</p>
              <p className="text-xs text-slate-500">Live Component Placeholder</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="material-symbols-outlined text-theme-blue">schema</span>
            <h3 className="font-bold text-slate-700">Data Isolation Model Visualization</h3>
          </div>
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm min-h-[300px] flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4 w-full max-w-md">
              <div className="flex items-center gap-8 w-full justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="size-12 rounded bg-theme-green text-white flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined">domain</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-600">Tenant A</span>
                </div>
                <div className="h-px bg-slate-300 flex-1 border-t border-dashed border-slate-400"></div>
                <div className="flex flex-col items-center gap-2 opacity-40">
                  <div className="size-12 rounded bg-slate-400 text-white flex items-center justify-center">
                    <span className="material-symbols-outlined">domain</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-600">Tenant B</span>
                </div>
              </div>
              <div className="h-8 w-px bg-slate-400 border-l border-dashed border-slate-400"></div>
              <div className="bg-white border-2 border-theme-blue rounded-lg p-4 w-full text-center shadow-lg relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-xs font-bold text-theme-blue">Active Connection</span>
                <div className="flex items-center justify-center gap-2 text-slate-700 font-mono text-sm">
                  <span className="material-symbols-outlined text-theme-blue">database</span>
                  Northwind_Db
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="material-symbols-outlined text-theme-blue">code</span>
            <h3 className="font-bold text-slate-700">Data Access Pattern</h3>
          </div>
          <div className="bg-slate-100 rounded-lg border border-slate-200 p-4 space-y-4 shadow-inner">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-500 uppercase">Resolved Connection String</span>
                <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 rounded">Secret</span>
              </div>
              <pre className="bg-slate-800 text-slate-200 p-3 rounded text-xs font-mono overflow-x-auto border border-slate-700"><code>Server=tcp:demo.database.windows.net;Database=<span className="text-theme-teal">Northwind_Db</span>;User ID=app_user;Password=******;</code></pre>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-500 uppercase">Generated SQL Query</span>
                <span className="text-[10px] bg-green-100 text-green-700 px-1.5 rounded border border-green-200">Executed</span>
              </div>
              <pre className="bg-white text-slate-700 p-3 rounded text-xs font-mono overflow-x-auto border border-slate-300 shadow-sm leading-relaxed"><code>
<span className="text-blue-600 font-bold">SELECT</span>{'\n'}
    Region, {'\n'}
    SUM(Amount) as TotalSales {'\n'}
<span className="text-blue-600 font-bold">FROM</span> {'\n'}
    SalesRecords {'\n'}
<span className="text-blue-600 font-bold">WHERE</span> {'\n'}
    TenantId = <span className="text-purple-600">'Guid-NW-883'</span> {'\n'}
    <span className="text-slate-400">-- Auto-injected filter</span>{'\n'}
<span className="text-blue-600 font-bold">GROUP BY</span> {'\n'}
    Region;</code></pre>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="material-symbols-outlined text-theme-blue">table_view</span>
          <h3 className="font-bold text-slate-700">Sample Data Structure</h3>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Product</th>
                <th className="p-4">Region</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {data.map((record, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-800">
                    <div className="flex items-center gap-3">
                      <img src={record.ImageUrl} alt="" className="size-8 rounded-full object-cover bg-slate-200" />
                      <div>
                        <div className="font-bold">{record.UserName}</div>
                        <div className="text-xs text-slate-500">{record.Country}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-700">{new Date(record.ReportDate).toLocaleDateString()}</td>
                  <td className="p-4 text-slate-800 font-medium">{record.Product}</td>
                  <td className="p-4 text-slate-600">{record.Region}</td>
                  <td className="p-4 text-right font-mono font-medium">{formatter.format(record.TotalSales)}</td>
                  <td className="p-4 text-center">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 font-medium">Paid</span>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                 <tr>
                   <td colSpan={6} className="p-8 text-center text-slate-500 italic">
                     No records found for the selected criteria.
                   </td>
                 </tr>
              )}
            </tbody>
          </table>
          <div className="bg-slate-50 p-3 text-center border-t border-slate-200">
            <span className="text-xs text-slate-500">Showing {data.length} records</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
