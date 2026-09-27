import React, { useState, useEffect } from 'react';
import {
  EventCampaign,
  ToneType,
  ImageAsset,
  UserProfile,
  GeneratedPostHistoryItem,
} from '../types';
import { generateLinkedInPost } from '../services/aiGenerator';

interface AttendeeViewProps {
  event: EventCampaign;
  userProfile: UserProfile;
  history: GeneratedPostHistoryItem[];
  onAddHistory: (item: GeneratedPostHistoryItem) => void;
  onOpenHistoryModal: () => void;
  onOpenMediaModal: () => void;
  onShowToast: (message: string) => void;
  selectedPhoto: ImageAsset;
  setSelectedPhoto: (photo: ImageAsset) => void;
}

export const AttendeeView: React.FC<AttendeeViewProps> = ({
  event,
  userProfile,
  history,
  onAddHistory,
  onOpenHistoryModal,
  onOpenMediaModal,
  onShowToast,
  selectedPhoto,
  setSelectedPhoto,
}) => {
  const [highlights, setHighlights] = useState(
    "Blown away by today's keynote on autonomous agent architectures and large-scale vector search! Great catching up with leaders across cloud infrastructure. Huge kudos to the organizers."
  );
  const [tone, setTone] = useState<ToneType>('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [postText, setPostText] = useState('');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [reactions, setReactions] = useState(48);
  const [hasLiked, setHasLiked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [regenerateMenuOpen, setRegenerateMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isExpandedEditor, setIsExpandedEditor] = useState(false);

  // Initialize or re-generate post text when event changes
  useEffect(() => {
    generatePost('default');
  }, [event.id]);

  const generatePost = async (variation: 'default' | 'punchy' | 'bullet-heavy' | 'story' | 'short' = 'default') => {
    setIsGenerating(true);
    try {
      const generated = await generateLinkedInPost({
        event,
        highlights,
        tone,
        speakerName: userProfile.name,
        speakerRole: userProfile.headline,
        variationType: variation,
      });
      setPostText(generated);

      const historyItem: GeneratedPostHistoryItem = {
        id: `gen-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tone,
        content: generated,
        photoUrl: selectedPhoto.url,
        photoName: selectedPhoto.name,
      };
      onAddHistory(historyItem);
      onShowToast('LinkedIn post draft generated with AI');
    } catch {
      onShowToast('Draft refreshed');
    } finally {
      setIsGenerating(false);
    }
  };

  const wordCount = highlights.trim() ? highlights.trim().split(/\s+/).length : 0;

  const handleQuickAddition = (phrase: string) => {
    setHighlights((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return phrase;
      return `${trimmed} ${phrase}`;
    });
    onShowToast(`Added "${phrase}" to highlights`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(postText).then(() => {
      setIsCopied(true);
      onShowToast('Post copy copied to clipboard! Ready to paste into LinkedIn.');
      setTimeout(() => setIsCopied(false), 2400);
    });
  };

  const handleToggleLike = () => {
    if (hasLiked) {
      setReactions((r) => r - 1);
      setHasLiked(false);
    } else {
      setReactions((r) => r + 1);
      setHasLiked(true);
      onShowToast('Liked simulated post');
    }
  };

  const handleVoiceDictation = () => {
    setIsListening(true);
    onShowToast('Listening for audio notes...');
    setTimeout(() => {
      setIsListening(false);
      handleQuickAddition('The hallway discussions on distributed foundation models were exceptional.');
    }, 1800);
  };

  const quickPhrases = [
    '+ Met inspiring founders',
    '+ Groundbreaking keynote',
    '+ AI agent demo',
    '+ Next-gen vector search',
    '+ Great networking track',
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-margin py-space-lg flex flex-col gap-space-lg">
      {/* Top Event Banner */}
      <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col lg:flex-row lg:items-center justify-between gap-space-md border border-outline-variant/30">
        <div className="flex flex-col gap-space-xs max-w-3xl">
          <div className="flex flex-wrap items-center gap-space-xs">
            <span className="px-space-sm py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm tracking-wide uppercase font-semibold">
              Official Post Generator
            </span>
            <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-secondary-container/30 text-secondary font-label-sm text-label-sm font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>{' '}
              {event.sessionDay}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-space-xs sm:gap-space-md">
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
              {event.name}
            </h1>
            <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-primary">apartment</span>
              Hosted by {event.hostOrg} • {event.datesVenue.split('•')[1]?.trim() || 'SF & Virtual'}
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Create a polished, viral LinkedIn post about your experience in seconds with AI. Optimized for professional reach and organic peer engagement.
          </p>

          {/* Clickable social tags & handles */}
          <div className="flex flex-wrap items-center gap-space-xs pt-1">
            {event.hashtags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  if (!highlights.includes(tag)) {
                    handleQuickAddition(tag);
                  }
                }}
                className="group px-space-sm py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md transition-all flex items-center gap-1 cursor-pointer border border-outline-variant/20"
              >
                <span>{tag}</span>
                <span className="material-symbols-outlined text-[14px] opacity-60 group-hover:opacity-100">
                  tag
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleQuickAddition(event.links.twitterHandle)}
              className="group px-space-sm py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all flex items-center gap-1 cursor-pointer border border-outline-variant/20"
            >
              <span className="text-primary font-semibold">@</span>
              <span>{event.links.twitterHandle.replace('@', '')}</span>
            </button>
            <a
              className="group px-space-sm py-1 rounded-full bg-surface-container-low hover:bg-surface-container-high text-primary font-label-md text-label-md transition-all flex items-center gap-1 border border-outline-variant/20"
              href={event.links.portalUrl}
              target="_blank"
              rel="noreferrer"
            >
              <span className="material-symbols-outlined text-[14px]">link</span>
              <span>{event.links.portalUrl.replace(/^https?:\/\//, '')}</span>
              <span className="material-symbols-outlined text-[14px] opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                north_east
              </span>
            </a>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-space-md p-space-md bg-surface-container-low rounded-xl border border-outline-variant/20">
          <div className="flex flex-col text-right">
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
              1,840+
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Posts Generated
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[22px]">trending_up</span>
          </div>
        </div>
      </div>

      {/* Two-Column Workspace (5:7 split on desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* LEFT COLUMN: Input Form */}
        <section className="lg:col-span-5 bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-lg border border-outline-variant/30">
          <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20">
            <div className="flex items-center gap-space-xs">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">tune</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Customize Your Post
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Tailor your reflections & context
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenHistoryModal}
              className="text-primary hover:text-primary-container font-label-sm text-label-sm font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">history</span>
              <span>History ({history.length})</span>
            </button>
          </div>

          {/* Step 1: Event Photo */}
          <div className="flex flex-col gap-space-xs">
            <label className="flex items-center justify-between font-label-md text-label-md text-on-surface font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-surface-container text-primary font-code-sm text-code-sm flex items-center justify-center font-bold">
                  1
                </span>
                Event Photo
              </span>
              <span className="font-body-sm text-body-sm text-secondary flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                Photo attached
              </span>
            </label>

            {/* Selected Preview Container */}
            <div className="relative rounded-xl overflow-hidden bg-surface-container-low group border border-outline-variant/30">
              <div className="relative w-full h-44 bg-surface-container-high overflow-hidden">
                <img
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  alt={selectedPhoto.alt}
                  src={selectedPhoto.url}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent flex items-end p-space-sm justify-between">
                  <span className="px-space-xs py-0.5 rounded bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface font-code-sm text-code-sm font-medium">
                    {selectedPhoto.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={onOpenMediaModal}
                      className="px-2.5 py-1 rounded bg-surface-container-lowest text-on-surface hover:text-primary font-label-sm text-label-sm font-semibold shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">sync</span>
                      <span>Change</span>
                    </button>
                    <button
                      type="button"
                      title="Remove or switch photo"
                      onClick={() => {
                        const nextPhoto = event.availablePhotos.find((p) => p.id !== selectedPhoto.id);
                        if (nextPhoto) setSelectedPhoto(nextPhoto);
                      }}
                      className="p-1 rounded bg-surface-container-lowest/80 text-error hover:bg-surface-container-lowest transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Secondary thumbnails */}
              <div className="p-space-xs flex items-center gap-space-xs bg-surface-container">
                {event.availablePhotos.map((photo) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => {
                      setSelectedPhoto(photo);
                      onShowToast(`Attached ${photo.name}`);
                    }}
                    className={`w-12 h-12 rounded-lg overflow-hidden shrink-0 transition-all cursor-pointer ${
                      photo.id === selectedPhoto.id
                        ? 'ring-2 ring-primary-container scale-105'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img className="w-full h-full object-cover" alt={photo.alt} src={photo.url} />
                  </button>
                ))}

                <button
                  type="button"
                  onClick={onOpenMediaModal}
                  title="Upload another photo"
                  className="w-12 h-12 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high transition-colors flex flex-col items-center justify-center text-on-surface-variant hover:text-primary shrink-0 cursor-pointer border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span className="font-label-sm text-label-sm font-medium scale-90">Add</span>
                </button>
                <div className="font-body-sm text-body-sm text-on-surface-variant pl-2">
                  1 image selected (16:9 ratio)
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Key Highlights / Takeaways */}
          <div className="flex flex-col gap-space-xs">
            <label className="flex items-center justify-between font-label-md text-label-md text-on-surface font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-surface-container text-primary font-code-sm text-code-sm flex items-center justify-center font-bold">
                  2
                </span>
                Key Highlights / Takeaways
              </span>
              <span className="font-code-sm text-code-sm text-on-surface-variant font-normal">
                {wordCount} words
              </span>
            </label>

            <div className="relative">
              <textarea
                value={highlights}
                onChange={(e) => setHighlights(e.target.value)}
                rows={isExpandedEditor ? 7 : 4}
                placeholder="What were your biggest impressions from the sessions or networking?"
                className="w-full p-space-md rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all resize-none shadow-inner border border-outline-variant/30"
              />
              <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 text-on-surface-variant">
                <button
                  type="button"
                  onClick={handleVoiceDictation}
                  title="Voice dictation simulation"
                  className={`p-1 rounded hover:bg-surface-container transition-colors cursor-pointer ${
                    isListening ? 'text-primary animate-pulse bg-primary/10' : ''
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">mic</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpandedEditor(!isExpandedEditor)}
                  title={isExpandedEditor ? 'Collapse editor' : 'Expand editor'}
                  className="p-1 rounded hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isExpandedEditor ? 'close_fullscreen' : 'open_in_full'}
                  </span>
                </button>
              </div>
            </div>

            {/* Quick prompt suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="font-label-sm text-label-sm text-on-surface-variant mr-1">
                Quick additions:
              </span>
              {quickPhrases.map((phrase) => (
                <button
                  key={phrase}
                  type="button"
                  onClick={() => handleQuickAddition(phrase.replace(/^\+\s*/, ''))}
                  className="px-space-xs py-0.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm transition-colors cursor-pointer border border-outline-variant/20"
                >
                  {phrase}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Tone Selector */}
          <div className="flex flex-col gap-space-xs">
            <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-surface-container text-primary font-code-sm text-code-sm flex items-center justify-center font-bold">
                3
              </span>
              Tone Selector
            </label>
            <div className="grid grid-cols-2 gap-space-xs">
              <button
                type="button"
                onClick={() => setTone('professional')}
                className={`flex items-center justify-between p-space-sm rounded-lg font-label-md text-label-md font-medium transition-all cursor-pointer ${
                  tone === 'professional'
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/30'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  Professional
                </span>
                {tone === 'professional' && (
                  <span className="material-symbols-outlined text-[16px]">check</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setTone('grateful')}
                className={`flex items-center justify-between p-space-sm rounded-lg font-label-md text-label-md font-medium transition-all cursor-pointer ${
                  tone === 'grateful'
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/30'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">favorite</span>
                  Grateful Attendee
                </span>
                {tone === 'grateful' && (
                  <span className="material-symbols-outlined text-[16px]">check</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setTone('takeaways')}
                className={`flex items-center justify-between p-space-sm rounded-lg font-label-md text-label-md font-medium transition-all cursor-pointer ${
                  tone === 'takeaways'
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/30'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                  Key Takeaways
                </span>
                {tone === 'takeaways' && (
                  <span className="material-symbols-outlined text-[16px]">check</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setTone('casual')}
                className={`flex items-center justify-between p-space-sm rounded-lg font-label-md text-label-md font-medium transition-all cursor-pointer ${
                  tone === 'casual'
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/30'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                  Casual & Energetic
                </span>
                {tone === 'casual' && (
                  <span className="material-symbols-outlined text-[16px]">check</span>
                )}
              </button>
            </div>
          </div>

          {/* Step 4: Primary Action Button */}
          <div className="pt-space-xs flex flex-col gap-2">
            <button
              type="button"
              onClick={() => generatePost('default')}
              disabled={isGenerating}
              className="w-full h-11 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-headline-sm text-headline-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-75"
            >
              {isGenerating ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
                  <span>Synthesizing Post with AI...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"></path>
                  </svg>
                  <span>Generate LinkedIn Post</span>
                </>
              )}
            </button>
            <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm px-1">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-secondary">bolt</span>{' '}
                Powered by Summit LLM v4.2
              </span>
              <span>Est. generation: ~1.2s</span>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Live Preview & Export */}
        <section className="lg:col-span-7 flex flex-col gap-space-md">
          {/* Live Preview Header Bar */}
          <div className="flex items-center justify-between px-space-xs">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[20px]">preview</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Live LinkedIn Post Preview
              </h2>
            </div>
            <div className="flex items-center gap-space-xs">
              <span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container font-label-sm text-label-sm font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                Ready to Share
              </span>
              <div className="flex items-center bg-surface-container rounded-lg p-0.5 text-on-surface-variant border border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setDeviceMode('desktop')}
                  title="Desktop Feed Preview"
                  className={`p-1 rounded cursor-pointer transition-colors ${
                    deviceMode === 'desktop'
                      ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                      : 'hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">desktop_windows</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceMode('mobile')}
                  title="Mobile App Preview"
                  className={`p-1 rounded cursor-pointer transition-colors ${
                    deviceMode === 'mobile'
                      ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                      : 'hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">smartphone</span>
                </button>
              </div>
            </div>
          </div>

          {/* Realistic LinkedIn Post Card Mockup */}
          <div className={`transition-all ${deviceMode === 'mobile' ? 'max-w-md mx-auto w-full' : 'w-full'}`}>
            <article className="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden flex flex-col transition-all border border-outline-variant/30">
              {/* Post Author Header */}
              <div className="p-space-md flex items-start justify-between gap-space-sm border-b border-outline-variant/10">
                <div className="flex items-start gap-space-sm min-w-0">
                  <div className="relative shrink-0">
                    <img
                      alt={userProfile.name}
                      className="w-12 h-12 rounded-full object-cover shadow-inner ring-1 ring-outline-variant/40"
                      src={userProfile.avatar}
                    />
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-secondary-fixed-dim ring-2 ring-surface-container-lowest flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
                        {userProfile.name}
                      </span>
                      <span className="text-on-surface-variant font-body-sm text-body-sm">• 1st</span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      {userProfile.headline}
                    </span>
                    <div className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant pt-0.5">
                      <span>Just now</span>
                      <span>•</span>
                      <span className="material-symbols-outlined text-[13px]">public</span>
                      <span>• Edited</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 text-on-surface-variant">
                  <button
                    type="button"
                    title="Post options"
                    className="p-1.5 rounded-full hover:bg-surface-container transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                  </button>
                </div>
              </div>

              {/* Post Text Body */}
              <div className="px-space-md py-space-sm flex flex-col gap-space-sm font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-line select-text">
                {postText || 'Generating your customized LinkedIn post...'}
              </div>

              {/* Embedded Post Image Asset */}
              <div className="w-full bg-surface-container-high overflow-hidden max-h-[380px] flex items-center justify-center border-t border-b border-outline-variant/20">
                <img
                  className="w-full h-full object-cover"
                  alt={selectedPhoto.alt}
                  src={selectedPhoto.url}
                />
              </div>

              {/* Social Engagement Stats Counter */}
              <div className="px-space-md py-space-xs flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm bg-surface-container-lowest border-b border-outline-variant/10">
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1 items-center">
                    <span className="w-4 h-4 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-[10px]">
                      👍
                    </span>
                    <span className="w-4 h-4 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center text-[10px]">
                      👏
                    </span>
                    <span className="w-4 h-4 rounded-full bg-error-container text-on-error-container flex items-center justify-center text-[10px]">
                      ❤️
                    </span>
                  </div>
                  <span>{reactions} reactions</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>12 comments</span>
                  <span>•</span>
                  <span>4 reposts</span>
                </div>
              </div>

              {/* LinkedIn Social Action Bar */}
              <div className="px-space-sm py-1 bg-surface-container-low flex items-center justify-between text-on-surface-variant font-label-md text-label-md font-semibold">
                <button
                  type="button"
                  onClick={handleToggleLike}
                  className={`flex-1 py-2 rounded-lg hover:bg-surface-container flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    hasLiked ? 'text-primary font-bold' : ''
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {hasLiked ? 'thumb_up' : 'thumb_up'}
                  </span>
                  <span className="hidden sm:inline">{hasLiked ? 'Liked' : 'Like'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onShowToast('LinkedIn comments will be opened upon publishing')}
                  className="flex-1 py-2 rounded-lg hover:bg-surface-container flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  <span className="hidden sm:inline">Comment</span>
                </button>
                <button
                  type="button"
                  onClick={() => onShowToast('LinkedIn reposts ready')}
                  className="flex-1 py-2 rounded-lg hover:bg-surface-container flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">repeat</span>
                  <span className="hidden sm:inline">Repost</span>
                </button>
                <button
                  type="button"
                  onClick={() => onShowToast('Send via LinkedIn messaging')}
                  className="flex-1 py-2 rounded-lg hover:bg-surface-container flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </article>
          </div>

          {/* Anchored Action Bar Below Preview */}
          <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-wrap items-center justify-between gap-space-sm border border-outline-variant/30">
            <div className="flex items-center gap-space-xs flex-wrap">
              {/* Copy Text Button */}
              <button
                type="button"
                onClick={handleCopy}
                className="px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold transition-all flex items-center gap-1.5 cursor-pointer border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                  {isCopied ? 'check' : 'content_copy'}
                </span>
                <span>{isCopied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
              </button>

              {/* Regenerate Button with Variation Dropdown */}
              <div className="relative inline-flex rounded-lg bg-surface-container p-0.5 border border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => generatePost('default')}
                  className="px-space-sm py-1.5 rounded-md hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">cached</span>
                  <span>Regenerate</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRegenerateMenuOpen(!regenerateMenuOpen)}
                  title="Select variant flavor"
                  className="px-1.5 rounded-md hover:bg-surface-container-high text-on-surface-variant transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
                </button>

                {regenerateMenuOpen && (
                  <div className="absolute left-0 bottom-full mb-1 w-48 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 py-1 z-50 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        generatePost('punchy');
                        setRegenerateMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-surface-container-low transition-colors text-on-surface flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[14px] text-primary">flash_on</span>
                      <span>More Punchy Hook</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        generatePost('bullet-heavy');
                        setRegenerateMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-surface-container-low transition-colors text-on-surface flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[14px] text-primary">format_list_bulleted</span>
                      <span>Key Takeaways (Bullets)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        generatePost('short');
                        setRegenerateMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-surface-container-low transition-colors text-on-surface flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[14px] text-primary">compress</span>
                      <span>Short & Crisp (~50w)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Open LinkedIn Button */}
            <a
              href="https://www.linkedin.com/feed/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                navigator.clipboard.writeText(postText);
                onShowToast('Text copied! Opening LinkedIn feed in new tab...');
              }}
              className="px-space-lg py-2.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md font-semibold shadow-md transition-all flex items-center gap-2 group cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path>
              </svg>
              <span>Open LinkedIn to Post</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                north_east
              </span>
            </a>
          </div>

          {/* Micro-Tips Banner */}
          <div className="px-space-md py-space-xs rounded-lg bg-surface-container-low flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm border border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-tertiary-container">
                tips_and_updates
              </span>
              <span>
                Posts with 1 high-resolution photo receive{' '}
                <strong>2.4x more engagement</strong> on LinkedIn feed algorithms.
              </span>
            </div>
            <span className="font-code-sm text-code-sm text-primary font-semibold">Tip #03</span>
          </div>
        </section>
      </div>
    </div>
  );
};
