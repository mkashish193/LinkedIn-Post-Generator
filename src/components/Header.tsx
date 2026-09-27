import React, { useState, useRef, useEffect } from 'react';
import { ActiveView, EventCampaign, UserProfile } from '../types';

interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  events: EventCampaign[];
  currentEvent: EventCampaign;
  setCurrentEvent: (event: EventCampaign) => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  events,
  currentEvent,
  setCurrentEvent,
  userProfile,
  setUserProfile,
  onOpenHelp,
}) => {
  const [eventDropdownOpen, setEventDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const eventMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (eventMenuRef.current && !eventMenuRef.current.contains(e.target as Node)) {
        setEventDropdownOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest border-b border-outline-variant/40 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 w-full px-margin flex items-center justify-between gap-gutter">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-space-md cursor-pointer" onClick={() => setActiveView('organizer')}>
          <img
            alt="EventPulse Logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1VZxLpS2N4NCHHQoR1jajoJcbwFRp5juiJiOyhbT0p7uiEgz-vrIQ31PlsAY8IPnWh-UmxDp_nMQpxBwMBaw7eKz2SwrvaZ8iZ6FCLhD0lPoNjngfb1InHWhrRsiy4-6z7wl5RLe9CSTdsjrvSBnwfxUYOCLBv5ninteZMw7E5lanHG3gtg8fKO1MG3jFRU5VmOT3aW4OYt74uvIA73c7-bXk49wlxlznTiDO0n-qI3fwiSLZ9ESz9idcc"
          />
          <div className="flex items-center gap-space-xs">
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">
              EventPulse
            </span>
            <span className="px-space-xs py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm uppercase tracking-wider font-semibold border border-primary/20">
              Event Suite
            </span>
          </div>
        </div>

        {/* Center: Primary Navigation Segmented Control */}
        <div className="flex items-center justify-center">
          <nav
            className="flex items-center p-1 bg-surface-container rounded-lg border border-outline-variant/30 shadow-inner"
            role="tablist"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeView === 'organizer'}
              onClick={() => setActiveView('organizer')}
              className={`px-space-md py-1.5 rounded-lg transition-all flex items-center gap-2 cursor-pointer text-sm font-medium ${
                activeView === 'organizer'
                  ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                  : 'font-label-md text-label-md text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              <span>Organizer</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeView === 'attendee-view'}
              onClick={() => setActiveView('attendee-view')}
              className={`px-space-md py-1.5 rounded-lg transition-all flex items-center gap-2 cursor-pointer text-sm font-medium ${
                activeView === 'attendee-view'
                  ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                  : 'font-label-md text-label-md text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">post_add</span>
              <span>Attendee View</span>
            </button>
          </nav>
        </div>

        {/* Right: Event Switcher & Profile Controls */}
        <div className="flex items-center gap-space-md">
          {/* Active Event Dropdown */}
          <div className="relative" ref={eventMenuRef}>
            <button
              type="button"
              onClick={() => setEventDropdownOpen(!eventDropdownOpen)}
              className="hidden xl:flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-surface-container-low border border-outline-variant/50 hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="font-label-md text-label-md font-medium text-on-surface max-w-[160px] truncate">
                {currentEvent.name}
              </span>
              <span className="material-symbols-outlined text-outline text-[18px]">expand_more</span>
            </button>

            {eventDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 py-2 z-50">
                <div className="px-3 py-1 text-[11px] font-semibold text-outline uppercase tracking-wider">
                  Switch Active Summit
                </div>
                {events.map((evt) => (
                  <button
                    key={evt.id}
                    type="button"
                    onClick={() => {
                      setCurrentEvent(evt);
                      setEventDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-surface-container-low transition-colors ${
                      evt.id === currentEvent.id ? 'bg-surface-container font-semibold text-primary' : 'text-on-surface'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="truncate">{evt.name}</span>
                      <span className="text-xs text-on-surface-variant">{evt.hostOrg}</span>
                    </div>
                    {evt.id === currentEvent.id && (
                      <span className="material-symbols-outlined text-secondary text-[18px]">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Icons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              title="Help Center"
              onClick={onOpenHelp}
              className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">help_outline</span>
            </button>

            {/* Notifications Popover */}
            <div className="relative" ref={notifMenuRef}>
              <button
                type="button"
                title="Notifications"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setUnreadCount(0);
                }}
                className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors relative cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-container"></span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 py-2 z-50">
                  <div className="px-3 py-1.5 border-b border-outline-variant/20 flex items-center justify-between">
                    <span className="font-semibold text-sm text-on-surface">Campaign Alerts</span>
                    <span className="text-xs text-primary font-medium">Live Feed</span>
                  </div>
                  <div className="divide-y divide-outline-variant/10 text-xs">
                    <div className="p-3 hover:bg-surface-container-low transition-colors">
                      <p className="font-medium text-on-surface">High viral spike on #CloudSummit2025</p>
                      <p className="text-on-surface-variant mt-0.5">Attendee posts increased by +34% in the last 2 hours.</p>
                      <span className="text-[10px] text-outline mt-1 block">12m ago</span>
                    </div>
                    <div className="p-3 hover:bg-surface-container-low transition-colors">
                      <p className="font-medium text-on-surface">New Broadcast from Sarah Chen</p>
                      <p className="text-on-surface-variant mt-0.5">VP Cloud Architecture generated a post from Keynote Day 2.</p>
                      <span className="text-[10px] text-outline mt-1 block">28m ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="h-6 w-[1px] bg-outline-variant/40 hidden sm:block"></div>

          {/* Profile Button */}
          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              title="Profile and Account"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-space-xs p-1 rounded-full hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              <img
                alt={userProfile.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-outline-variant/40"
                src={userProfile.avatar}
              />
              <span className="material-symbols-outlined text-outline-variant text-[18px]">unfold_more</span>
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 p-3 z-50">
                <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
                  <img
                    alt={userProfile.name}
                    className="w-10 h-10 rounded-full object-cover"
                    src={userProfile.avatar}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-on-surface truncate">{userProfile.name}</p>
                    <p className="text-xs text-on-surface-variant truncate">{userProfile.headline}</p>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-1 text-xs text-on-surface">
                  <div className="px-2 py-1.5 rounded hover:bg-surface-container-low cursor-pointer flex items-center justify-between">
                    <span>Role Mode</span>
                    <span className="text-primary font-semibold">VP & Keynote</span>
                  </div>
                  <div className="px-2 py-1.5 rounded hover:bg-surface-container-low cursor-pointer flex items-center justify-between">
                    <span>Account Org</span>
                    <span className="text-on-surface-variant">{userProfile.org}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newName = prompt('Enter your name for LinkedIn posts:', userProfile.name);
                      if (newName) setUserProfile((p) => ({ ...p, name: newName }));
                    }}
                    className="mt-1 w-full text-left px-2 py-1.5 rounded bg-surface-container text-primary font-medium hover:bg-surface-container-high transition-colors"
                  >
                    Edit Display Name
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
