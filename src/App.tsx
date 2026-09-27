import React, { useState, useEffect } from 'react';
import { ActiveView, EventCampaign, UserProfile, GeneratedPostHistoryItem, ImageAsset } from './types';
import { INITIAL_EVENTS, INITIAL_USER_PROFILE } from './data/mockData';
import { Header } from './components/Header';
import { OrganizerDashboard } from './components/OrganizerDashboard';
import { AttendeeView } from './components/AttendeeView';
import { Toast } from './components/Toast';
import { QrModal } from './components/modals/QrModal';
import { MediaModal } from './components/modals/MediaModal';
import { NewEventModal } from './components/modals/NewEventModal';
import { HistoryModal } from './components/modals/HistoryModal';
import { ExportReportModal } from './components/modals/ExportReportModal';
import { HelpModal } from './components/modals/HelpModal';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('organizer');
  const [events, setEvents] = useState<EventCampaign[]>(INITIAL_EVENTS);
  const [currentEvent, setCurrentEvent] = useState<EventCampaign>(INITIAL_EVENTS[0]);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [selectedPhoto, setSelectedPhoto] = useState<ImageAsset>(INITIAL_EVENTS[0].availablePhotos[0]);
  const [history, setHistory] = useState<GeneratedPostHistoryItem[]>([]);

  // Modals state
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [newEventModalOpen, setNewEventModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [exportReportModalOpen, setExportReportModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3200);
  };

  // Sync selectedPhoto when switching events
  useEffect(() => {
    if (currentEvent.availablePhotos.length > 0) {
      setSelectedPhoto(currentEvent.availablePhotos[0]);
    }
  }, [currentEvent.id]);

  const handleUpdateEvent = (updated: EventCampaign) => {
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    setCurrentEvent(updated);
  };

  const handleCreateEvent = (newEvent: EventCampaign) => {
    setEvents((prev) => [newEvent, ...prev]);
    setCurrentEvent(newEvent);
  };

  const handleAddPhotoToEvent = (newPhoto: ImageAsset) => {
    const updated = {
      ...currentEvent,
      availablePhotos: [newPhoto, ...currentEvent.availablePhotos],
    };
    handleUpdateEvent(updated);
    setSelectedPhoto(newPhoto);
  };

  const handleAddHistory = (item: GeneratedPostHistoryItem) => {
    setHistory((prev) => [item, ...prev]);

    // Also inject into organizer's recent broadcasts if it doesn't already exist
    const newBroadcast = {
      id: `bc-${Date.now()}`,
      authorName: userProfile.name,
      authorRole: userProfile.headline,
      authorAvatar: userProfile.avatar,
      timeAgo: 'Just now',
      content: `"${item.content.slice(0, 140)}..."`,
      likes: 1,
      comments: 0,
      reposts: 0,
    };

    handleUpdateEvent({
      ...currentEvent,
      recentBroadcasts: [newBroadcast, ...currentEvent.recentBroadcasts.slice(0, 4)],
      metrics: {
        ...currentEvent.metrics,
        postsGenerated: currentEvent.metrics.postsGenerated + 1,
      },
    });
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      {/* Universal Fixed Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        events={events}
        currentEvent={currentEvent}
        setCurrentEvent={setCurrentEvent}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        onOpenHelp={() => setHelpModalOpen(true)}
      />

      {/* Main Content Workspace with 4rem top padding for fixed header */}
      <main className="w-full pt-16 bg-surface min-h-[calc(100vh-4rem)] flex-1">
        {activeView === 'organizer' ? (
          <OrganizerDashboard
            event={currentEvent}
            onUpdateEvent={handleUpdateEvent}
            setActiveView={setActiveView}
            onOpenQrModal={() => setQrModalOpen(true)}
            onOpenMediaModal={() => setMediaModalOpen(true)}
            onOpenNewEventModal={() => setNewEventModalOpen(true)}
            onOpenExportReportModal={() => setExportReportModalOpen(true)}
            onShowToast={showToast}
          />
        ) : (
          <AttendeeView
            event={currentEvent}
            userProfile={userProfile}
            history={history}
            onAddHistory={handleAddHistory}
            onOpenHistoryModal={() => setHistoryModalOpen(true)}
            onOpenMediaModal={() => setMediaModalOpen(true)}
            onShowToast={showToast}
            selectedPhoto={selectedPhoto}
            setSelectedPhoto={setSelectedPhoto}
          />
        )}
      </main>

      {/* Modals & Dialogs */}
      <QrModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        shareableUrl={`https://eventpulse.ai/gen/${currentEvent.shareableSlug}`}
        eventName={currentEvent.name}
        onShowToast={showToast}
      />

      <MediaModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        event={currentEvent}
        onSelectPhoto={(photo) => setSelectedPhoto(photo)}
        onAddPhoto={handleAddPhotoToEvent}
        onShowToast={showToast}
      />

      <NewEventModal
        isOpen={newEventModalOpen}
        onClose={() => setNewEventModalOpen(false)}
        onCreateEvent={handleCreateEvent}
        onShowToast={showToast}
      />

      <HistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        history={history}
        onSelectPost={(item) => {
          const matchPhoto = currentEvent.availablePhotos.find((p) => p.name === item.photoName);
          if (matchPhoto) setSelectedPhoto(matchPhoto);
        }}
        onShowToast={showToast}
      />

      <ExportReportModal
        isOpen={exportReportModalOpen}
        onClose={() => setExportReportModalOpen(false)}
        event={currentEvent}
        onShowToast={showToast}
      />

      <HelpModal isOpen={helpModalOpen} onClose={() => setHelpModalOpen(false)} />

      {/* Universal Floating Toast */}
      <Toast message={toastMessage} />
    </div>
  );
}
