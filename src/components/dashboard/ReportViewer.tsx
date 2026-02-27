/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';

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

interface ReportViewerProps {
  tenantId: number;
  userId: number;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ tenantId, userId }) => {
  const [embedToken, setEmbedToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tokenCache = React.useRef<Record<string, string>>({});

  // Effect to fetch token when tenant or user changes
  useEffect(() => {
    let isMounted = true;
    const fetchToken = async () => {
      // Basic validation to prevent sending bad requests
      if (!tenantId || !userId) {
          console.warn("Skipping token fetch: Missing tenantId or userId", { tenantId, userId });
          return;
      }

      // Check Cache
      const cacheKey = `${tenantId}-${userId}`;
      if (tokenCache.current[cacheKey]) {
          console.log(`Using cached token for ${cacheKey}`);
          setEmbedToken(tokenCache.current[cacheKey]);
          setError(null);
          setLoading(false);
          return;
      }

      setLoading(true);
      setError(null);
      try {
        console.log(`Fetching token for TenantId=${tenantId}, UserId=${userId}`);
        const response = await fetch('/api/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tenantId, userId })
        });

        if (!response.ok) {
           const errorText = await response.text();
           throw new Error(`Server returned ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        if (isMounted) {
            if (data.access_token) {
                console.log("Embed Token received");
                // Cache the token
                tokenCache.current[cacheKey] = data.access_token;
                // No bearer prefix as requested
                setEmbedToken(data.access_token);
            } else {
                console.error("No access_token in response", data);
                setError("Invalid token response from server");
            }
        }
      } catch (err: any) {
        if (isMounted) {
            console.error("Failed to fetch token:", err);
            setError(err.message || "Failed to fetch secure token");
        }
      } finally {
        if (isMounted) {
            setLoading(false);
        }
      }
    };

    fetchToken();

    return () => {
        isMounted = false;
    };
  }, [tenantId, userId]);

  return (
    <div className="flex-1 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 relative w-full h-full">
            {/* Bold Report Viewer Component */}
            <div className="absolute inset-0">
                {loading ? (
                   <div className="flex items-center justify-center h-full text-slate-500">
                       <span className="animate-spin material-symbols-outlined text-4xl mr-2">progress_activity</span>
                       Generating secure token...
                   </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-full text-red-500 p-4 text-center">
                        <span className="material-symbols-outlined text-4xl mb-2">error</span>
                        <p className="font-bold">Error loading report</p>
                        <p className="text-sm">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 text-sm"
                        >
                            Retry
                        </button>
                    </div>
                ) : embedToken && BoldReportViewerComponent ? (
                  <BoldReportViewerComponent
                    id="reportviewer-container"
                    reportServiceUrl={'https://cloud.boldreports.com/reporting/reportservice/api/Viewer'}
                    reportServerUrl={'https://cloud.boldreports.com/reporting/api/site/b1159702'}
                    embedToken={embedToken}
                    reportPath={'8e0df3f5-267f-45e1-8674-693d89133851'}
                    isResponsive={'true'}
                    style={{ height: '100%', width: '100%' }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-red-500">
                    {!BoldReportViewerComponent ? "Error: BoldReportViewerComponent not found." : "Waiting for token..."}
                  </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default ReportViewer;
