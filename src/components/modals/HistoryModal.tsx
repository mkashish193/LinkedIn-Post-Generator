import React from 'react';
import { GeneratedPostHistoryItem } from '../../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: GeneratedPostHistoryItem[];
  onSelectPost: (item: GeneratedPostHistoryItem) => void;
  onShowToast: (message: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectPost,
  onShowToast,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-surface-container-lowest rounded-xl max-w-xl w-full p-space-lg shadow-xl flex flex-col gap-space-md border border-outline-variant/30 max-h-[85vh] overflow-hidden">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">history</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Post Generation History
              </h3>
              <p className="text-xs text-on-surface-variant">
                Previous drafts and AI variations created during this session
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

        <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-1">
          {history.length === 0 ? (
            <div className="py-8 text-center text-on-surface-variant text-sm flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-outline text-[32px]">edit_note</span>
              <span>No generated posts saved yet. Click &quot;Generate LinkedIn Post&quot; to create your first draft!</span>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-surface border border-outline-variant/30 hover:border-primary transition-all flex flex-col gap-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-primary-container text-white font-medium capitalize">
                      {item.tone}
                    </span>
                    <span className="text-outline font-mono">{item.timestamp}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectPost(item);
                      onClose();
                      onShowToast('Post draft restored to preview');
                    }}
                    className="text-primary hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Restore Draft</span>
                    <span className="material-symbols-outlined text-[14px]">undo</span>
                  </button>
                </div>
                <p className="text-xs text-on-surface line-clamp-3 whitespace-pre-line bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/20 font-body-sm">
                  {item.content}
                </p>
                <div className="flex items-center justify-between text-[11px] text-outline pt-1">
                  <span>Photo: {item.photoName}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(item.content);
                      onShowToast('Draft text copied to clipboard');
                    }}
                    className="hover:text-primary flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[13px]">content_copy</span>
                    <span>Copy</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
