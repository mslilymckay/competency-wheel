import React from 'react';
import { X } from 'lucide-react';

export function ConfirmationModal({ 
  isOpen, 
  title, 
  message, 
  confirmText = "Confirm", 
  confirmColor = "bg-rose-700", 
  onConfirm, 
  onCancel 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 p-6 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-xl text-charcoal">{title}</h3>
          <button onClick={onCancel} className="p-1 text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-end gap-2 pt-3">
          <button
            onClick={onCancel}
            className="py-2.5 px-4 rounded-xl bg-cloud hover:bg-slate-200 text-charcoal font-bold text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`py-2.5 px-5 rounded-xl ${confirmColor} hover:opacity-90 text-white font-bold text-xs shadow-sm transition-colors`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
