import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function ConfirmationModal({ 
  isOpen, 
  title, 
  message, 
  confirmText = "Confirm", 
  confirmColor = "bg-[#B23267]", 
  onConfirm, 
  onCancel 
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onCancel) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A2A2A]/60 backdrop-blur-xs animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && onCancel) {
          onCancel();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 p-6 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 id="confirm-modal-title" className="font-heading text-xl text-[#2A2A2A]">{title}</h3>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B23267]"
            aria-label="Close confirmation dialog"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-end gap-2 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#2A2A2A] font-bold text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B23267]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`py-2.5 px-5 rounded-xl ${confirmColor} hover:opacity-90 text-white font-bold text-xs shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#B23267]`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
