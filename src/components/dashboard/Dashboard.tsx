/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import type { SalesRecord } from '../../data/mockData';

// Report Viewer source
import '@boldreports/javascript-reporting-controls/Content/v2.0/tailwind-light/bold.report-viewer.min.css';
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/common/bold.reports.common.min';
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/common/bold.reports.widgets.min';
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/bold.report-viewer.min';

// Reports React base (gives you the React component wrapper)
import '@boldreports/react-reporting-components/Scripts/bold.reports.react.min';

declare global {
  interface Window {
    BoldReportViewerComponent: any;
  }
}

// Access the global component
const BoldReportViewerComponent = window.BoldReportViewerComponent;

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
        {/* Toolbar Placeholder/Controls (Optional) */}
        <div className="bg-[#fcfcfc] dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-2 flex items-center justify-between">
           {/* We can keep the dummy toolbar or remove it as Bold Reports has its own toolbar.
               Let's keep it minimal for now or remove if it conflicts visually.
               The user design had a toolbar, but Bold Viewer has one built-in.
               I will remove the custom dummy toolbar to avoid confusion with the real one.
           */}
           <div className="text-xs text-slate-500 dark:text-slate-400 px-2">
             Bold Reports Viewer Integration
           </div>
        </div>

        <div className="flex-1 bg-white dark:bg-slate-800 relative h-[600px] w-full">
            {/* Bold Report Viewer Component */}
            <div className="absolute inset-0">
                {BoldReportViewerComponent ? (
                  <BoldReportViewerComponent
                    id="reportviewer-container"
                    reportServiceUrl={'https://demos.boldreports.com/services/api/ReportViewer'}
                    reportPath={'~/Resources/docs/sales-order-detail.rdl'}
                    style={{ height: '100%', width: '100%' }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-red-500">
                    Error: BoldReportViewerComponent not found.
                  </div>
                )}
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
