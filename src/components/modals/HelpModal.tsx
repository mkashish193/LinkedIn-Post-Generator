import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-space-lg shadow-xl flex flex-col gap-space-md border border-outline-variant/30">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">help_outline</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                EventPulse Suite Help Center
              </h3>
              <p className="text-xs text-on-surface-variant">
                Guide to orchestrating attendee social campaigns
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-outline hover:text-on-surface p-1 rounded-lg hover:bg-surface-container"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-3 text-xs text-on-surface leading-relaxed">
          <div className="p-3 rounded-lg bg-surface flex flex-col gap-1">
            <span className="font-semibold text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">campaign</span>
              1. Organizer Dashboard
            </span>
            <p className="text-on-surface-variant">
              Manage your summit name, organization tags, and campaign hashtags. Any updates here instantly update the Attendee Post Generator templates.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-surface flex flex-col gap-1">
            <span className="font-semibold text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
              2. Shareable Link & On-Site QR Display
            </span>
            <p className="text-on-surface-variant">
              Copy the guest link or download the SVG QR badge to place on stage slides, badges, and pull-up banners. Guests require zero login.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-surface flex flex-col gap-1">
            <span className="font-semibold text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">psychology</span>
              3. Attendee AI Post Generator
            </span>
            <p className="text-on-surface-variant">
              Attendees choose a keynote photo, type their impressions or select one-click suggestion chips, and choose between 4 executive tones (Professional, Grateful, Key Takeaways, Casual).
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-outline-variant/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-primary-container text-white text-xs font-semibold rounded-lg hover:bg-primary transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
