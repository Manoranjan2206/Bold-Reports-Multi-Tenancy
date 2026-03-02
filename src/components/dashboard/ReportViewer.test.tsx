/* eslint-disable @typescript-eslint/no-explicit-any */

import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReportViewer from './ReportViewer';

// Mock the Bold Reports imports to prevent load errors
vi.mock('@boldreports/javascript-reporting-controls/Content/v2.0/tailwind-light/bold.report-viewer.min.css', () => ({}));
vi.mock('@boldreports/javascript-reporting-controls/Scripts/v2.0/common/bold.reports.common.min', () => ({}));
vi.mock('@boldreports/javascript-reporting-controls/Scripts/v2.0/common/bold.reports.widgets.min', () => ({}));
vi.mock('@boldreports/javascript-reporting-controls/Scripts/v2.0/bold.report-viewer.min', () => ({}));
vi.mock('@boldreports/react-reporting-components/Scripts/bold.reports.react.min', () => ({}));

// Mock window.BoldReportViewerComponent
(window as any).BoldReportViewerComponent = () => <div>BoldReportViewerComponent</div>;

describe('ReportViewer', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    global.fetch = vi.fn();
  });

  it('displays error message and retry button on fetch failure', async () => {
    // Mock fetch to return a 500 error
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      text: () => Promise.resolve('Internal Server Error'),
    });

    render(<ReportViewer tenantId={1} userId={1} />);

    // Wait for the error message to appear
    await waitFor(() => {
        expect(screen.getByText(/Error loading report/i)).toBeInTheDocument();
    });

    // Verify detailed error message
    expect(screen.getByText(/Server returned 500: Internal Server Error/i)).toBeInTheDocument();

    // Verify Retry button is present
    expect(screen.getByRole('button', { name: /Retry/i })).toBeInTheDocument();
  });
});
