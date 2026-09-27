import React from 'react';

interface ToastProps {
  message: string | null;
  icon?: string;
}

export const Toast: React.FC<ToastProps> = ({ message, icon = 'check_circle' }) => {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-space-md py-3 rounded-xl shadow-2xl flex items-center gap-space-sm border border-outline-variant/20 animate-in slide-in-from-bottom-5 duration-300"
    >
      <span className="material-symbols-outlined text-secondary-fixed text-[20px]">
        {icon}
      </span>
      <span className="font-label-md text-label-md font-medium">{message}</span>
    </div>
  );
};
