import React, { useState } from 'react';
import { EventCampaign, ActiveView } from '../types';

interface OrganizerDashboardProps {
  event: EventCampaign;
  onUpdateEvent: (updated: EventCampaign) => void;
  setActiveView: (view: ActiveView) => void;
  onOpenQrModal: () => void;
  onOpenMediaModal: () => void;
  onOpenNewEventModal: () => void;
  onOpenExportReportModal: () => void;
  onShowToast: (message: string) => void;
}

export const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({
  event,
  onUpdateEvent,
  setActiveView,
  onOpenQrModal,
  onOpenMediaModal,
  onOpenNewEventModal,
  onOpenExportReportModal,
  onShowToast,
}) => {
  const [newTagInput, setNewTagInput] = useState('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [isSaving, setIsSaving] = useState(false);

  // Local draft states
  const [eventName, setEventName] = useState(event.name);
  const [hostOrg, setHostOrg] = useState(event.hostOrg);
  const [linkedinOrg, setLinkedinOrg] = useState(event.links.linkedinOrg);
  const [twitterHandle, setTwitterHandle] = useState(event.links.twitterHandle);
  const [portalUrl, setPortalUrl] = useState(event.links.portalUrl);
  const [governance, setGovernance] = useState(event.governance);
  const [hashtags, setHashtags] = useState<string[]>(event.hashtags);

  // Sync if active event changes
  React.useEffect(() => {
    setEventName(event.name);
    setHostOrg(event.hostOrg);
    setLinkedinOrg(event.links.linkedinOrg);
    setTwitterHandle(event.links.twitterHandle);
    setPortalUrl(event.links.portalUrl);
    setGovernance(event.governance);
    setHashtags(event.hashtags);
  }, [event.id]);

  const handleAddTag = () => {
    let tag = newTagInput.trim();
    if (!tag) return;
    if (!tag.startsWith('#')) tag = '#' + tag;
    if (!hashtags.includes(tag)) {
      const updated = [...hashtags, tag];
      setHashtags(updated);
      setNewTagInput('');
      onShowToast(`Hashtag ${tag} added to campaign`);
      onUpdateEvent({ ...event, hashtags: updated });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updated = hashtags.filter((t) => t !== tagToRemove);
    setHashtags(updated);
    onShowToast(`Hashtag ${tagToRemove} removed`);
    onUpdateEvent({ ...event, hashtags: updated });
  };

  const handleCopyLink = () => {
    const shareUrl = `https://eventpulse.ai/gen/${event.shareableSlug}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopyStatus('copied');
      onShowToast('Attendee generator URL copied to clipboard');
      setTimeout(() => setCopyStatus('idle'), 2400);
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onUpdateEvent({
        ...event,
        name: eventName,
        hostOrg,
        hashtags,
        governance,
        links: {
          linkedinOrg,
          twitterHandle,
          portalUrl,
        },
      });
      onShowToast('All campaign configurations & live badges updated');
    }, 600);
  };

  const shareableUrl = `https://eventpulse.ai/gen/${event.shareableSlug}`;

  return (
    <div className="w-full px-margin py-space-lg max-w-[1600px] mx-auto flex flex-col gap-space-lg">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-sm">
            <span className="px-space-sm py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              Organizer Suite
            </span>
            <span className="text-outline-variant">•</span>
            <span className="font-code-sm text-code-sm text-on-surface-variant">
              CAMPAIGN-ID: {event.code}
            </span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            Organizer Dashboard
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Configure your event social campaign, manage hashtags & links, and monitor attendee LinkedIn post engagement in real time.
          </p>
        </div>
        <div className="flex items-center gap-space-sm flex-wrap">
          <button
            type="button"
            onClick={onOpenExportReportModal}
            className="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors cursor-pointer shadow-sm border border-outline-variant/20"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Report</span>
          </button>
          <button
            type="button"
            onClick={onOpenNewEventModal}
            className="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md font-semibold transition-colors cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Create New Event</span>
          </button>
        </div>
      </div>

      {/* Main Content Workspace (Two Column Ratio 7:5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Left Column: Form & Configuration (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-space-lg">
          {/* Form Container */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-lg border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary-container">
                  <span className="material-symbols-outlined text-[22px]">tune</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Event Campaign Details
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Fine-tune the parameters injected into attendee generator templates.
                  </p>
                </div>
              </div>
              <span className="px-space-sm py-1 rounded-full bg-surface-container-low text-primary font-label-sm text-label-sm uppercase font-semibold">
                Draft Sync On
              </span>
            </div>

            {/* Basic Metadata Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              <div className="flex flex-col gap-space-xs sm:col-span-2">
                <label className="font-label-md text-label-md font-semibold text-on-surface flex items-center justify-between">
                  <span>Event Name</span>
                  <span className="text-outline text-[11px] font-normal">
                    Displayed on badge & attendee cards
                  </span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-outline text-[20px]">
                    event
                  </span>
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface rounded-lg text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all border border-outline-variant/30"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-space-xs sm:col-span-2">
                <label className="font-label-md text-label-md font-semibold text-on-surface">
                  Organizer / Host Organization
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-outline text-[20px]">
                    corporate_fare
                  </span>
                  <input
                    type="text"
                    value={hostOrg}
                    onChange={(e) => setHostOrg(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface rounded-lg text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all border border-outline-variant/30"
                  />
                </div>
              </div>
            </div>

            {/* Campaign Hashtags Manager */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <label className="font-label-md text-label-md font-semibold text-on-surface">
                  Campaign Hashtags
                </label>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Recommended: 3 to 5 tags
                </span>
              </div>
              <div className="p-space-sm rounded-lg bg-surface flex flex-wrap items-center gap-space-xs min-h-[48px] border border-outline-variant/30">
                {hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-space-sm py-1 bg-surface-container-high text-primary rounded-full font-label-sm text-label-sm font-semibold"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-error transition-colors p-0.5 rounded-full"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </span>
                ))}
                <div className="flex items-center gap-1 ml-auto">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add hashtag..."
                    className="bg-transparent text-on-surface font-label-sm text-label-sm outline-none px-2 py-1 w-28 placeholder:text-outline"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="p-1 rounded-md bg-surface-container-highest text-primary hover:bg-primary hover:text-on-primary transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Target Accounts & Reference Links Section */}
            <div className="flex flex-col gap-space-sm pt-space-xs">
              <span className="font-label-md text-label-md font-semibold text-on-surface">
                Target Accounts & Reference Links
              </span>
              <div className="flex flex-col gap-space-xs">
                {/* LinkedIn Org */}
                <div className="flex items-center bg-surface rounded-lg px-space-md py-2 gap-space-sm focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary-container/20 transition-all border border-outline-variant/30">
                  <div className="w-7 h-7 rounded bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs tracking-tight shrink-0">
                    in
                  </div>
                  <div className="flex-1 flex flex-col min-w-0">
                    <span className="font-label-sm text-label-sm text-outline">
                      LinkedIn Organization Page
                    </span>
                    <input
                      type="text"
                      value={linkedinOrg}
                      onChange={(e) => setLinkedinOrg(e.target.value)}
                      className="bg-transparent text-on-surface font-body-sm text-body-sm outline-none w-full truncate"
                    />
                  </div>
                  <span
                    className="material-symbols-outlined text-secondary text-[20px] shrink-0"
                    title="Valid link"
                  >
                    verified
                  </span>
                </div>

                {/* Twitter / X */}
                <div className="flex items-center bg-surface rounded-lg px-space-md py-2 gap-space-sm focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary-container/20 transition-all border border-outline-variant/30">
                  <div className="w-7 h-7 rounded bg-inverse-surface text-inverse-on-surface flex items-center justify-center font-bold text-xs shrink-0">
                    𝕏
                  </div>
                  <div className="flex-1 flex flex-col min-w-0">
                    <span className="font-label-sm text-label-sm text-outline">X (Twitter) Handle</span>
                    <input
                      type="text"
                      value={twitterHandle}
                      onChange={(e) => setTwitterHandle(e.target.value)}
                      className="bg-transparent text-on-surface font-body-sm text-body-sm outline-none w-full truncate"
                    />
                  </div>
                  <span
                    className="material-symbols-outlined text-secondary text-[20px] shrink-0"
                    title="Valid handle"
                  >
                    check_circle
                  </span>
                </div>

                {/* Official Event Portal */}
                <div className="flex items-center bg-surface rounded-lg px-space-md py-2 gap-space-sm focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary-container/20 transition-all border border-outline-variant/30">
                  <div className="w-7 h-7 rounded bg-surface-container text-on-surface flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">public</span>
                  </div>
                  <div className="flex-1 flex flex-col min-w-0">
                    <span className="font-label-sm text-label-sm text-outline">Official Event Portal</span>
                    <input
                      type="text"
                      value={portalUrl}
                      onChange={(e) => setPortalUrl(e.target.value)}
                      className="bg-transparent text-on-surface font-body-sm text-body-sm outline-none w-full truncate"
                    />
                  </div>
                  <a
                    href={portalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="material-symbols-outlined text-outline hover:text-primary text-[18px] shrink-0 transition-colors"
                  >
                    open_in_new
                  </a>
                </div>
              </div>
            </div>

            {/* Attendee Generator Customization */}
            <div className="p-space-md rounded-lg bg-surface flex flex-col gap-space-sm border border-outline-variant/30">
              <h3 className="font-label-md text-label-md font-semibold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary-container text-[18px]">
                  psychology
                </span>
                Attendee Post Prompt & Generation Governance
              </h3>
              <div className="flex flex-col gap-space-xs">
                <label className="flex items-start gap-space-sm cursor-pointer select-none py-1">
                  <input
                    type="checkbox"
                    checked={governance.prefillTemplates}
                    onChange={(e) =>
                      setGovernance({ ...governance, prefillTemplates: e.target.checked })
                    }
                    className="mt-1 w-4 h-4 rounded text-primary-container accent-primary-container cursor-pointer"
                  />
                  <div>
                    <span className="font-label-md text-label-md text-on-surface font-medium block">
                      Pre-fill Default Professional Templates
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant block">
                      Allows attendees to choose between Speaker, Sponsor, Executive Attendee, and General Guest tones.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-space-sm cursor-pointer select-none py-1">
                  <input
                    type="checkbox"
                    checked={governance.enforceBrandGuidelines}
                    onChange={(e) =>
                      setGovernance({ ...governance, enforceBrandGuidelines: e.target.checked })
                    }
                    className="mt-1 w-4 h-4 rounded text-primary-container accent-primary-container cursor-pointer"
                  />
                  <div>
                    <span className="font-label-md text-label-md text-on-surface font-medium block">
                      Enforce AI Prompt Brand Guidelines
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant block">
                      Appends high-conversion executive hooks and auto-checks proper capitalization of official event tags.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-space-sm cursor-pointer select-none py-1">
                  <input
                    type="checkbox"
                    checked={governance.autoGenerateBadges}
                    onChange={(e) =>
                      setGovernance({ ...governance, autoGenerateBadges: e.target.checked })
                    }
                    className="mt-1 w-4 h-4 rounded text-primary-container accent-primary-container cursor-pointer"
                  />
                  <div>
                    <span className="font-label-md text-label-md text-on-surface font-medium block">
                      Auto-generate Personalized LinkedIn Badges
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant block">
                      Dynamically produces 1200×627px custom visual assets carrying attendee names and summit keynote highlights.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-space-xs">
              <button
                type="button"
                onClick={() => setActiveView('attendee-view')}
                className="flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors cursor-pointer border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[18px]">visibility</span>
                <span>Preview Attendee Flow</span>
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-space-xs px-space-lg py-2.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md font-semibold transition-all cursor-pointer shadow-sm disabled:opacity-70"
              >
                <span
                  className={`material-symbols-outlined text-[18px] ${
                    isSaving ? 'animate-spin' : ''
                  }`}
                >
                  {isSaving ? 'refresh' : 'cloud_done'}
                </span>
                <span>{isSaving ? 'Saving...' : 'Save Event Changes'}</span>
              </button>
            </div>
          </div>

          {/* Media & Assets Quick Ingestion Banner */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col md:flex-row items-center gap-space-lg border border-outline-variant/30">
            <div className="w-full md:w-36 h-28 rounded-lg overflow-hidden shrink-0 relative bg-surface-container">
              <img
                className="w-full h-full object-cover"
                alt="Summit Creative Banner"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKqblFWPeoDKbaVqkFBp2RNQNWqF7uEda-yrghALFJRetFTDqDwiIvzF2-csf7z87ccxLEuMdRKLAIJYQ6ehfiRGAZ44E0nhphq0CGTTc5ltcQBaSpTZT2sfv4DQFLKBwoDXSLxpc1E2swXx--dfDD0B6bnZGsp0oQiOq2XS_wWSHbSy_96b8Vcvrl4gakgdrN-PFe9n5ZQKWKMMCLEOI9L__BHdW-hE1q5rH324CPVD2psQiHn7kW"
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-code-sm text-code-sm font-semibold">
                  ASSET KIT
                </span>
                <span className="font-label-sm text-label-sm text-outline">Updated 2h ago</span>
              </div>
              <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Summit Creative & Speaker Banners
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                14 graphic variations active. Attendee generator auto-selects visual cards based on participant track.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenMediaModal}
              className="px-space-md py-2 rounded-lg bg-surface text-primary hover:bg-surface-container font-label-md text-label-md font-semibold shrink-0 cursor-pointer border border-outline-variant/30 transition-colors"
            >
              Manage Media
            </button>
          </div>
        </div>

        {/* Right Column: Live Overview & Metrics Hub (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-space-lg">
          {/* Card 1: Live Event Overview Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md relative overflow-hidden border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                ACTIVE CAMPAIGN
              </span>
              <div className="flex items-center gap-1">
                <span className="font-code-sm text-code-sm text-outline">{event.tier}</span>
              </div>
            </div>

            {/* Hero Image & Title Overlay Context */}
            <div className="rounded-xl overflow-hidden relative h-40 bg-surface-container shadow-inner">
              <img
                className="w-full h-full object-cover"
                alt={event.heroImageAlt}
                src={event.heroImage}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/40 to-transparent flex flex-col justify-end p-space-md">
                <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider font-semibold">
                  Keynote & Expo
                </span>
                <h3 className="font-headline-md text-headline-md text-surface-container-lowest font-bold leading-tight">
                  {eventName}
                </h3>
              </div>
            </div>

            {/* Details List */}
            <div className="flex flex-col gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-outline">
                  calendar_month
                </span>
                <span>{event.datesVenue}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-secondary">
                  verified_user
                </span>
                <span className="font-medium text-on-surface">
                  {hostOrg} • {event.hostSubtitle}
                </span>
              </div>
            </div>

            {/* Attendee Generator Share Link Hub */}
            <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-sm border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md font-bold text-on-surface">
                  Attendee Post Generator Shareable Link
                </span>
                <span className="font-code-sm text-code-sm text-primary font-medium">
                  SSL Encrypted
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-surface-container-lowest px-3 py-2 rounded-lg flex items-center gap-2 overflow-hidden shadow-sm border border-outline-variant/30">
                  <span className="material-symbols-outlined text-outline text-[18px] shrink-0">
                    link
                  </span>
                  <input
                    readOnly
                    type="text"
                    value={shareableUrl}
                    className="bg-transparent font-code-sm text-code-sm text-on-surface w-full outline-none select-all truncate"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-space-md py-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {copyStatus === 'copied' ? 'check' : 'content_copy'}
                  </span>
                  <span>{copyStatus === 'copied' ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={onOpenQrModal}
                  className="flex items-center gap-1.5 font-label-sm text-label-sm text-primary hover:text-on-surface-variant transition-colors cursor-pointer font-semibold"
                >
                  <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                  <span>Generate On-Site QR Display</span>
                </button>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Zero login required for guests
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Attendee Engagement & Post Metrics */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">analytics</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Engagement & Post Metrics
                </h3>
              </div>
              <span className="px-space-xs py-0.5 rounded bg-surface text-outline font-label-sm text-label-sm">
                Past 7 Days
              </span>
            </div>

            {/* 3-Column Metric Subgrid */}
            <div className="grid grid-cols-3 gap-space-xs">
              <div className="p-space-sm rounded-lg bg-surface flex flex-col gap-1 border border-outline-variant/20">
                <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
                  Posts Generated
                </span>
                <span className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                  {event.metrics.postsGenerated.toLocaleString()}
                </span>
                <span className="font-label-sm text-label-sm text-secondary font-semibold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>{' '}
                  {event.metrics.postsGrowth}
                </span>
              </div>
              <div className="p-space-sm rounded-lg bg-surface flex flex-col gap-1 border border-outline-variant/20">
                <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
                  Est. LinkedIn Reach
                </span>
                <span className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                  {event.metrics.reach}
                </span>
                <span className="font-label-sm text-label-sm text-secondary font-semibold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[14px]">arrow_upward</span>{' '}
                  {event.metrics.reachDelta}
                </span>
              </div>
              <div className="p-space-sm rounded-lg bg-surface flex flex-col gap-1 border border-outline-variant/20">
                <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
                  Attendee Rate
                </span>
                <span className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                  {event.metrics.attendeeRate}
                </span>
                <span className="font-label-sm text-label-sm text-primary font-semibold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[14px]">verified</span>{' '}
                  {event.metrics.industryMultiplier}
                </span>
              </div>
            </div>

            {/* Inline Visual Analytics: Reach Trajectory Chart */}
            <div className="p-space-sm rounded-lg bg-surface flex flex-col gap-space-xs border border-outline-variant/20">
              <div className="flex items-center justify-between text-label-sm font-label-sm">
                <span className="text-on-surface-variant font-medium">Daily LinkedIn Impressions</span>
                <span className="text-primary font-semibold">Peak: Day 2 Keynotes</span>
              </div>
              {/* Lightweight Responsive SVG Sparkline Chart */}
              <div className="w-full h-16 pt-1">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 320 60">
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#0a66c2" stopOpacity="0.3"></stop>
                      <stop offset="100%" stopColor="#0a66c2" stopOpacity="0.0"></stop>
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,50 Q40,48 80,38 T160,24 T240,8 T320,18 L320,60 L0,60 Z"
                    fill="url(#chartGradient)"
                  ></path>
                  <path
                    d="M0,50 Q40,48 80,38 T160,24 T240,8 T320,18"
                    fill="none"
                    stroke="#004e99"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                  ></path>
                  {/* Key event markers */}
                  <circle cx="160" cy="24" fill="#ffffff" r="3" stroke="#004e99" strokeWidth="2"></circle>
                  <circle cx="240" cy="8" fill="#006d3c" r="4" stroke="#ffffff" strokeWidth="1.5"></circle>
                </svg>
              </div>
              <div className="flex justify-between text-[11px] font-code-sm text-outline px-1">
                <span>Day -5</span>
                <span>Day -3</span>
                <span>Day 1 (Opening)</span>
                <span>Day 2</span>
                <span>Today</span>
              </div>
            </div>

            {/* Recent Attendee Feed Snippets */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md font-bold text-on-surface">
                  Recent Attendee Broadcasts
                </span>
                <button
                  type="button"
                  onClick={() => setActiveView('attendee-view')}
                  className="font-label-sm text-label-sm text-primary cursor-pointer hover:underline"
                >
                  Live Feed
                </button>
              </div>

              {event.recentBroadcasts.map((post) => (
                <div
                  key={post.id}
                  className="p-space-sm rounded-lg bg-surface flex flex-col gap-2 transition-all hover:bg-surface-container-low border border-outline-variant/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container shrink-0">
                        <img
                          className="w-full h-full object-cover"
                          alt={post.authorName}
                          src={post.authorAvatar}
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-md text-label-md font-semibold text-on-surface leading-none truncate">
                          {post.authorName}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant leading-tight truncate">
                          {post.authorRole}
                        </span>
                      </div>
                    </div>
                    <span className="font-code-sm text-code-sm text-outline shrink-0">
                      {post.timeAgo}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface line-clamp-2 italic">
                    {post.content}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 text-label-sm font-label-sm text-outline">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-primary">
                          thumb_up
                        </span>{' '}
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">chat</span>{' '}
                        {post.comments}
                      </span>
                    </div>
                    <a
                      className="font-label-sm text-label-sm text-primary-container font-semibold hover:underline flex items-center gap-0.5"
                      href="https://www.linkedin.com/feed/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>View on LinkedIn</span>
                      <span className="material-symbols-outlined text-[14px]">north_east</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Trending Hashtag Distribution */}
            <div className="pt-space-xs flex flex-col gap-space-xs">
              <span className="font-label-sm text-label-sm font-semibold uppercase text-outline tracking-wider">
                Hashtag Share in Published Posts
              </span>
              <div className="w-full bg-surface-container rounded-full h-2.5 flex overflow-hidden">
                {event.hashtagDistribution.map((dist) => (
                  <div
                    key={dist.tag}
                    className={`${dist.color} h-full transition-all`}
                    style={{ width: `${dist.percentage}%` }}
                    title={`${dist.tag} (${dist.percentage}%)`}
                  ></div>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between text-[11px] font-code-sm text-on-surface-variant pt-1">
                {event.hashtagDistribution.slice(0, 3).map((dist) => (
                  <span key={dist.tag} className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${dist.color}`}></span>
                    {dist.tag} ({dist.percentage}%)
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
