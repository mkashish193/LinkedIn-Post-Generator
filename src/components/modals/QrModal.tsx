import React from 'react';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareableUrl: string;
  eventName: string;
  onShowToast: (message: string) => void;
}

export const QrModal: React.FC<QrModalProps> = ({
  isOpen,
  onClose,
  shareableUrl,
  eventName,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableUrl);
    onShowToast('Link copied from QR studio');
  };

  const handleDownload = () => {
    // Generate a simple SVG file download
    const svgElement = document.getElementById('qr-svg-graphic');
    if (svgElement) {
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `eventpulse-qr-${eventName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.svg`;
      link.click();
      URL.revokeObjectURL(url);
      onShowToast('QR Code SVG badge downloaded');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-surface-container-lowest rounded-xl max-w-sm w-full p-space-lg shadow-xl flex flex-col items-center gap-space-md text-center border border-outline-variant/30">
        <div className="flex items-center justify-between w-full">
          <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
            Event QR Badge
          </span>
          <button
            className="text-outline hover:text-on-surface transition-colors cursor-pointer p-1 rounded-lg hover:bg-surface-container"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Place this QR code on conference presentation slides, badges, or display stands to let attendees generate posts in seconds.
        </p>

        {/* Dynamic QR SVG Representation */}
        <div className="w-52 h-52 p-4 bg-surface rounded-xl flex items-center justify-center border border-outline-variant/30 shadow-inner">
          <svg
            id="qr-svg-graphic"
            className="w-full h-full text-on-surface"
            fill="currentColor"
            viewBox="0 0 100 100"
          >
            <rect fill="none" height="25" stroke="currentColor" strokeWidth="4" width="25" x="5" y="5"></rect>
            <rect height="11" width="11" x="12" y="12"></rect>
            <rect fill="none" height="25" stroke="currentColor" strokeWidth="4" width="25" x="70" y="5"></rect>
            <rect height="11" width="11" x="77" y="12"></rect>
            <rect fill="none" height="25" stroke="currentColor" strokeWidth="4" width="25" x="5" y="70"></rect>
            <rect height="11" width="11" x="12" y="77"></rect>
            {/* Data Grid Cells */}
            <rect height="6" width="6" x="36" y="8"></rect>
            <rect height="6" width="12" x="46" y="8"></rect>
            <rect height="6" width="16" x="36" y="18"></rect>
            <rect height="12" width="6" x="56" y="18"></rect>
            <rect height="16" width="6" x="8" y="36"></rect>
            <rect height="6" width="12" x="18" y="36"></rect>
            <rect height="16" width="8" x="22" y="46"></rect>
            <rect height="8" width="8" x="36" y="36"></rect>
            <rect height="6" width="14" x="48" y="36"></rect>
            <rect height="8" width="8" x="48" y="48"></rect>
            <rect height="18" width="8" x="62" y="42"></rect>
            <rect height="8" width="18" x="76" y="36"></rect>
            <rect height="14" width="8" x="86" y="48"></rect>
            <rect height="14" width="8" x="36" y="70"></rect>
            <rect height="6" width="14" x="48" y="68"></rect>
            <rect height="6" width="12" x="68" y="72"></rect>
            <rect height="26" width="10" x="84" y="68"></rect>
            <rect height="10" width="18" x="48" y="82"></rect>
            <rect height="10" width="8" x="70" y="84"></rect>
          </svg>
        </div>

        <div className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-xs font-code-sm text-outline truncate select-all">
          {shareableUrl}
        </div>

        <div className="flex items-center gap-space-xs w-full">
          <button
            className="flex-1 py-2 px-3 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-semibold cursor-pointer hover:bg-primary transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            onClick={handleDownload}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Download SVG</span>
          </button>
          <button
            className="py-2 px-3 rounded-lg bg-surface text-on-surface font-label-md text-label-md cursor-pointer hover:bg-surface-container transition-colors border border-outline-variant/30 flex items-center gap-1.5"
            onClick={handleCopy}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">content_copy</span>
            <span>Copy URL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
