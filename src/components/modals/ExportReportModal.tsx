import React, { useState } from 'react';
import { EventCampaign } from '../../types';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventCampaign;
  onShowToast: (message: string) => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  event,
  onShowToast,
}) => {
  const [format, setFormat] = useState<'csv' | 'json' | 'summary'>('summary');

  if (!isOpen) return null;

  const handleExport = () => {
    let content = '';
    let filename = '';
    let type = '';

    if (format === 'json') {
      content = JSON.stringify(
        {
          campaignId: event.code,
          name: event.name,
          host: event.hostOrg,
          metrics: event.metrics,
          hashtags: event.hashtags,
          hashtagDistribution: event.hashtagDistribution,
          exportedAt: new Date().toISOString(),
        },
        null,
        2
      );
      filename = `${event.shareableSlug}-campaign-report.json`;
      type = 'application/json';
    } else if (format === 'csv') {
      content = `Metric,Value\nCampaign ID,${event.code}\nEvent Name,"${event.name}"\nHost Organization,"${event.hostOrg}"\nPosts Generated,${event.metrics.postsGenerated}\nEst. Reach,${event.metrics.reach}\nAttendee Rate,${event.metrics.attendeeRate}\nPrimary Hashtags,"${event.hashtags.join('; ')}"\nExported At,"${new Date().toLocaleString()}"`;
      filename = `${event.shareableSlug}-analytics.csv`;
      type = 'text/csv';
    } else {
      content = `========================================
EVENTPULSE EXECUTIVE CAMPAIGN REPORT
========================================
Event: ${event.name}
Campaign ID: ${event.code}
Host: ${event.hostOrg} (${event.hostSubtitle})
Dates & Venue: ${event.datesVenue}

PERFORMANCE SUMMARY:
- Total Posts Generated: ${event.metrics.postsGenerated} (${event.metrics.postsGrowth})
- Estimated LinkedIn Reach: ${event.metrics.reach} (${event.metrics.reachDelta})
- Attendee Participation Rate: ${event.metrics.attendeeRate} (${event.metrics.industryMultiplier})

CAMPAIGN HASHTAG PERFORMANCE:
${event.hashtagDistribution.map((h) => `- ${h.tag}: ${h.percentage}% share`).join('\n')}

Attendee Generator Share Link:
${event.links.portalUrl}

Report Generated: ${new Date().toLocaleString()}
========================================`;
      filename = `${event.shareableSlug}-executive-summary.txt`;
      type = 'text/plain';
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    onClose();
    onShowToast(`Report downloaded (${filename})`);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-space-lg shadow-xl flex flex-col gap-space-md border border-outline-variant/30">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">download</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Export Campaign Report
              </h3>
              <p className="text-xs text-on-surface-variant">{event.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-outline hover:text-on-surface p-1 rounded-lg hover:bg-surface-container"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-on-surface">Select Export Format</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setFormat('summary')}
              className={`p-3 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                format === 'summary'
                  ? 'border-primary bg-surface-container font-semibold text-primary'
                  : 'border-outline-variant/40 hover:bg-surface text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">description</span>
              <span className="text-xs font-medium">Executive TXT</span>
            </button>
            <button
              type="button"
              onClick={() => setFormat('csv')}
              className={`p-3 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                format === 'csv'
                  ? 'border-primary bg-surface-container font-semibold text-primary'
                  : 'border-outline-variant/40 hover:bg-surface text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">table_chart</span>
              <span className="text-xs font-medium">Metrics CSV</span>
            </button>
            <button
              type="button"
              onClick={() => setFormat('json')}
              className={`p-3 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                format === 'json'
                  ? 'border-primary bg-surface-container font-semibold text-primary'
                  : 'border-outline-variant/40 hover:bg-surface text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">data_object</span>
              <span className="text-xs font-medium">Raw JSON</span>
            </button>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-surface text-xs text-on-surface-variant flex flex-col gap-1">
          <span className="font-semibold text-on-surface">Includes:</span>
          <span>• 1,482 attendee post counts and 420.5K reach projections</span>
          <span>• Hashtag distribution across #CloudSummit2025 and #AIInnovation</span>
          <span>• Real-time trajectory sparkline data</span>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:text-on-surface"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="px-4 py-2 bg-primary-container text-white text-xs font-semibold rounded-lg hover:bg-primary transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Download Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
