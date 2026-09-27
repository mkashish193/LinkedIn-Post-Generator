import React, { useState } from 'react';
import { EventCampaign } from '../../types';

interface NewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (newEvent: EventCampaign) => void;
  onShowToast: (message: string) => void;
}

export const NewEventModal: React.FC<NewEventModalProps> = ({
  isOpen,
  onClose,
  onCreateEvent,
  onShowToast,
}) => {
  const [name, setName] = useState('');
  const [hostOrg, setHostOrg] = useState('');
  const [datesVenue, setDatesVenue] = useState('');
  const [hashtagsStr, setHashtagsStr] = useState('#TechSummit2025, #DevGrowth, #Innovation');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !hostOrg.trim()) return;

    const parsedTags = hashtagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '');

    const newCampaign: EventCampaign = {
      id: `ep-${Date.now()}`,
      code: `#EP-${Math.floor(10000 + Math.random() * 90000)}`,
      name: name.trim(),
      hostOrg: hostOrg.trim(),
      hostSubtitle: 'Verified Partner Summit',
      datesVenue: datesVenue.trim() || 'Nov 18-20, 2025 • Center Hall & Hybrid',
      sessionDay: 'Live Session Day 1',
      tier: 'Tier 1 Pro Event',
      shareableSlug: slug || 'summit2025',
      heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRWtIGUpVkNQVgNPWdOAHerspGRoKCw5Kvx7C2pvYW5sh-TqGdbL5lBwhBqhrQnx7dEdUC0ufFzaCDYZLxCcnuIxGO3dOvYrynlv_VjDmI6J0wp6PQquNx3AQbFnDfaZKj6aQz02Kh49fWxMF0qrzmc2scnQOzY7L-P8uYr9uvWSGDB-Co4irB-fOASMv8POnN_Gi2nv4e6MMo_n-N0WfuvBieT3QqyzENR1BhNM1_3B15Q5Vz_NjT',
      heroImageAlt: 'Summit Hero Graphics',
      hashtags: parsedTags.length > 0 ? parsedTags : ['#Innovation2025', '#TechPulse'],
      links: {
        linkedinOrg: `https://linkedin.com/company/${slug}`,
        twitterHandle: `@${slug}`,
        portalUrl: `https://${slug}.io`,
      },
      governance: {
        prefillTemplates: true,
        enforceBrandGuidelines: true,
        autoGenerateBadges: false,
      },
      metrics: {
        postsGenerated: 12,
        postsGrowth: '+100%',
        reach: '18.4K',
        reachDelta: 'New Campaign Launch',
        attendeeRate: '12.0%',
        industryMultiplier: '2.1x Industry',
        chartPoints: [10, 15, 22, 34, 45, 60],
      },
      hashtagDistribution: [
        { tag: parsedTags[0] || '#Summit', percentage: 70, color: 'bg-primary' },
        { tag: parsedTags[1] || '#Tech', percentage: 30, color: 'bg-secondary' },
      ],
      recentBroadcasts: [],
      availablePhotos: [
        {
          id: 'photo-default',
          name: 'Keynote_Hall_Main.jpg',
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzM09G1N2jLFXKegtLAMe4YdlYr_F6GsIJqZoUYTpjHHZKITJREt1uTetutkvh--sqFCXZmoIFnTl50taHZH2_QW3APmNXblyJgcrb1bCdI4kNDJFLW_saxM16jkziiknlxkfCU7WMaf9uKdYP7lYd-1XEiioKb5b5NHQD1f9My6jTDqMM4tYQdzmpchP5HFmCSyXmGQhfNFCk0Y3qP_XZl4kc1ioZwUltwG5C1LlA1GD794B7BKM5',
          alt: 'Keynote Hall',
          aspectRatio: '16:9',
          category: 'keynote',
        },
      ],
    };

    onCreateEvent(newCampaign);
    onClose();
    onShowToast(`Campaign "${newCampaign.name}" created and set active!`);
  };

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
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Create New Event Campaign
              </h3>
              <p className="text-xs text-on-surface-variant">
                Provision a dedicated attendee post generator & real-time analytics
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface">Event Name *</label>
            <input
              required
              type="text"
              placeholder="e.g. NextGen AI World Forum 2025"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-surface rounded-lg border border-outline-variant/40 text-on-surface outline-none focus:ring-2 focus:ring-primary-container/20"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface">Host Organization *</label>
            <input
              required
              type="text"
              placeholder="e.g. NextGen Innovation Labs"
              value={hostOrg}
              onChange={(e) => setHostOrg(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-surface rounded-lg border border-outline-variant/40 text-on-surface outline-none focus:ring-2 focus:ring-primary-container/20"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface">Dates & Venue</label>
            <input
              type="text"
              placeholder="e.g. Dec 4-6, 2025 • Seattle Convention Center"
              value={datesVenue}
              onChange={(e) => setDatesVenue(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-surface rounded-lg border border-outline-variant/40 text-on-surface outline-none focus:ring-2 focus:ring-primary-container/20"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface">Official Hashtags (comma separated)</label>
            <input
              type="text"
              placeholder="#NextGenAI2025, #AILeaders, #CloudScale"
              value={hashtagsStr}
              onChange={(e) => setHashtagsStr(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-surface rounded-lg border border-outline-variant/40 text-on-surface outline-none focus:ring-2 focus:ring-primary-container/20"
            />
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
              type="submit"
              className="px-4 py-2 bg-primary-container text-on-primary text-xs font-semibold rounded-lg hover:bg-primary transition-colors cursor-pointer shadow-sm"
            >
              Launch Event Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
