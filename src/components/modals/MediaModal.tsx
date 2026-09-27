import React, { useState } from 'react';
import { EventCampaign, ImageAsset } from '../../types';

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventCampaign;
  onSelectPhoto?: (photo: ImageAsset) => void;
  onAddPhoto?: (photo: ImageAsset) => void;
  onShowToast: (message: string) => void;
}

export const MediaModal: React.FC<MediaModalProps> = ({
  isOpen,
  onClose,
  event,
  onSelectPhoto,
  onAddPhoto,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'keynote' | 'audience' | 'expo'>('all');
  const [customUrl, setCustomUrl] = useState('');
  const [customName, setCustomName] = useState('');

  if (!isOpen) return null;

  const filteredPhotos =
    activeTab === 'all'
      ? event.availablePhotos
      : event.availablePhotos.filter((p) => p.category === activeTab);

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim() || !customName.trim()) return;

    const newAsset: ImageAsset = {
      id: `custom-${Date.now()}`,
      name: customName.trim().endsWith('.jpg') ? customName.trim() : `${customName.trim()}.jpg`,
      url: customUrl.trim(),
      alt: customName.trim(),
      aspectRatio: '16:9',
      category: 'keynote',
    };

    if (onAddPhoto) onAddPhoto(newAsset);
    setCustomUrl('');
    setCustomName('');
    onShowToast(`Asset "${newAsset.name}" added to summit media kit`);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-surface-container-lowest rounded-xl max-w-2xl w-full p-space-lg shadow-xl flex flex-col gap-space-md border border-outline-variant/30 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">photo_library</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Summit Media & Creative Asset Kit
              </h3>
              <p className="text-xs text-on-surface-variant">
                14 graphic variations active across keynote, expo, and attendee cards
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

        {/* Categories Tab */}
        <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-2 text-xs">
          {(['all', 'keynote', 'audience', 'expo'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-primary-container text-on-primary font-semibold'
                  : 'bg-surface text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab === 'all' ? 'All Assets' : tab}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto max-h-[360px] p-1">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group relative rounded-lg overflow-hidden border border-outline-variant/40 bg-surface-container hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative aspect-video bg-black/10 overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-white font-mono uppercase">
                  {photo.category}
                </span>
              </div>
              <div className="p-2 bg-surface-container-lowest flex items-center justify-between gap-1">
                <span className="text-xs font-mono text-on-surface truncate" title={photo.name}>
                  {photo.name}
                </span>
                {onSelectPhoto && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectPhoto(photo);
                      onClose();
                      onShowToast(`Selected "${photo.name}" for LinkedIn post`);
                    }}
                    className="text-[11px] px-2 py-0.5 rounded bg-surface-container hover:bg-primary-container hover:text-white text-primary font-medium transition-colors shrink-0"
                  >
                    Select
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Asset Form */}
        <form onSubmit={handleAddCustom} className="p-3 bg-surface rounded-xl flex flex-col gap-2 border border-outline-variant/30">
          <span className="text-xs font-semibold text-on-surface flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-primary">add_link</span>
            Ingest Direct Image Link or Keynote Slide
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Asset Label (e.g. VIP_Dinner_Networking.jpg)"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="px-3 py-1.5 text-xs bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-on-surface outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://images.example.com/banner.jpg"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-on-surface outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-primary-container text-white text-xs font-semibold rounded-lg hover:bg-primary transition-colors cursor-pointer"
              >
                Add Asset
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
