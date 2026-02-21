/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
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
    $: any;
    jQuery: any;
  }
}

// Access the global component
const BoldReportViewerComponent = window.BoldReportViewerComponent;

interface DashboardProps {
  model: string;
  tenant: string;
  user: string;
  data: SalesRecord[];
  tenantId: number;
  userId: number;
}

const Dashboard: React.FC<DashboardProps> = ({ tenant, user, data, tenantId, userId }) => {
  const userName = user.split(' (')[0];
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  // Effect to update report parameters when tenant or user changes
  useEffect(() => {
    // Ensure jQuery and the viewer object are available
    if (window.$) {
        const viewerObj = window.$('#reportviewer-container').data('boldReportViewer');
        if (viewerObj && typeof viewerObj.setModel === 'function') {
            console.log(`Updating report parameters: TenantId=${tenantId}, UserId=${userId}`);
            const parameters = [
                { Name: 'TenantId', Values: [tenantId.toString()] },
                { Name: 'UserId',   Values: [userId.toString()]   }
            ];
            try {
                viewerObj.setModel({ parameters: parameters });
            } catch (err) {
                console.error("Failed to update report parameters:", err);
            }
        }
    }
  }, [tenantId, userId]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900">

      {/* Top Bar - Denser */}
      <div className="flex items-center justify-between px-6 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shrink-0">
        <div>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">Sales Order Detail</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Multi-Tenancy Demo Report</p>
        </div>
        <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-3 py-1 rounded bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                <span className="size-2 rounded-full bg-theme-teal animate-pulse"></span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {tenant} <span className="text-slate-400 mx-1">/</span> {userName}
                </span>
             </div>
        </div>
      </div>

      {/* Main Content Area - Split View or just Full Viewer */}
      <div className="flex-1 flex flex-col overflow-hidden p-4 gap-4">

        {/* Report Viewer Container - Maximized space */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col min-h-0">
            <div className="flex-1 relative w-full h-full">
                {/* Bold Report Viewer Component */}
                <div className="absolute inset-0">
                    {BoldReportViewerComponent ? (
                      <BoldReportViewerComponent
                        id="reportviewer-container"
                        reportServiceUrl={'https://demos.boldreports.com/services/api/ReportViewer'}
                        reportPath={'~/Resources/docs/sales-order-detail.rdl'}
                        style={{ height: '100%', width: '100%' }}
                        parameters={[
                            { name: 'TenantId', values: [tenantId.toString()] },
                            { name: 'UserId',   values: [userId.toString()]   }
                        ]}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-red-500">
                        Error: BoldReportViewerComponent not found.
                      </div>
                    )}
                </div>
            </div>
        </div>

        {/* Sample Data Table - Collapsible or smaller at bottom */}
        {/* For "Advanced Look", let's make this section smaller/scrollable or keep it as a bottom panel */}
        <div className="h-64 shrink-0 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
             <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-theme-blue dark:text-blue-400 text-lg">table_view</span>
                <h3 className="font-bold text-sm text-slate-700 dark:text-white">Sample Data Preview</h3>
             </div>
             <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-700 shadow-sm">
                    <tr className="text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                        <th className="p-3 border-b border-slate-200 dark:border-slate-600">Customer</th>
                        <th className="p-3 border-b border-slate-200 dark:border-slate-600">Date</th>
                        <th className="p-3 border-b border-slate-200 dark:border-slate-600">Product</th>
                        <th className="p-3 border-b border-slate-200 dark:border-slate-600">Region</th>
                        <th className="p-3 text-right border-b border-slate-200 dark:border-slate-600">Amount</th>
                        <th className="p-3 text-center border-b border-slate-200 dark:border-slate-600">Status</th>
                    </tr>
                    </thead>
                    <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-700">
                    {data.map((record, index) => (
                        <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="p-3 font-medium text-slate-800 dark:text-slate-200">
                            <div className="flex items-center gap-2">
                            <img src={record.ImageUrl} alt="" className="size-6 rounded-full object-cover bg-slate-200 dark:bg-slate-600" />
                            <span>{record.UserName}</span>
                            </div>
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">{new Date(record.ReportDate).toLocaleDateString()}</td>
                        <td className="p-3 text-slate-800 dark:text-slate-200 font-medium">{record.Product}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">{record.Region}</td>
                        <td className="p-3 text-right font-mono font-medium dark:text-slate-200">{formatter.format(record.TotalSales)}</td>
                        <td className="p-3 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium">Paid</span>
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
             </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
