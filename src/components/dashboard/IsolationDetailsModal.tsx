import React, { useState } from 'react';
import siloImg from '../../assets/silo.png';
import schemaImg from '../../assets/schema.png';
import rowImg from '../../assets/row.png';

interface IsolationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: string;
}

const IsolationDetailsModal: React.FC<IsolationDetailsModalProps> = ({ isOpen, onClose, model }) => {
  const [activeTab, setActiveTab] = useState<'visualization' | 'accessPattern'>('visualization');

  if (!isOpen) return null;

  const getVisualizationImage = () => {
    switch (model) {
      case 'Database per Tenant':
        return siloImg;
      case 'Schema per Tenant':
        return schemaImg;
      case 'Shared Database (RLS)':
        return rowImg;
      default:
        return siloImg;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Data Isolation Details</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 px-6">
          <button
            onClick={() => setActiveTab('visualization')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'visualization'
                ? 'border-theme-teal text-theme-teal'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Visualization
          </button>
          <button
            onClick={() => setActiveTab('accessPattern')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'accessPattern'
                ? 'border-theme-teal text-theme-teal'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Access Pattern
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50 dark:bg-slate-900/50">
          {activeTab === 'visualization' && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 w-full flex justify-center">
                 <img
                   src={getVisualizationImage()}
                   alt={`${model} Visualization`}
                   className="max-h-[400px] w-auto object-contain"
                 />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-2xl">
                Current Model: <span className="font-semibold text-slate-700 dark:text-slate-300">{model}</span>.
                This diagram illustrates how data is physically separated or logically isolated based on the selected strategy.
              </p>
            </div>
          )}

          {activeTab === 'accessPattern' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Resolved Connection String</span>
                  <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 rounded">Secret</span>
                </div>
                <pre className="bg-slate-800 text-slate-200 p-4 rounded text-xs font-mono overflow-x-auto border border-slate-700">
                  <code>
                    Server=tcp:demo.database.windows.net;Database=
                    <span className="text-theme-teal">Northwind_Db</span>;User ID=app_user;Password=******;
                  </code>
                </pre>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Generated SQL Query</span>
                  <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-1.5 rounded border border-green-200 dark:border-green-800">Executed</span>
                </div>
                <pre className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 p-4 rounded text-xs font-mono overflow-x-auto border border-slate-300 dark:border-slate-700 shadow-sm leading-relaxed">
                  <code>
<span className="text-blue-600 dark:text-blue-400 font-bold">SELECT</span>{'\n'}
    Region, {'\n'}
    SUM(Amount) as TotalSales {'\n'}
<span className="text-blue-600 dark:text-blue-400 font-bold">FROM</span> {'\n'}
    SalesRecords {'\n'}
<span className="text-blue-600 dark:text-blue-400 font-bold">WHERE</span> {'\n'}
    TenantId = <span className="text-purple-600 dark:text-purple-400">'Guid-NW-883'</span> {'\n'}
    <span className="text-slate-400">-- Auto-injected filter</span>{'\n'}
<span className="text-blue-600 dark:text-blue-400 font-bold">GROUP BY</span> {'\n'}
    Region;
                  </code>
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end bg-slate-50 dark:bg-slate-800">
            <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded text-sm font-medium transition-colors"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default IsolationDetailsModal;
