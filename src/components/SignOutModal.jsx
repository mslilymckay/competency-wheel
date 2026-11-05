import React, { useState, useEffect } from 'react';
import { X, LogOut, Trash2, AlertTriangle, User } from 'lucide-react';

export function SignOutModal({ isOpen, user, onClose, onConfirm }) {
  const [deleteData, setDeleteData] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDeleteData(false);
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAction = async () => {
    setLoading(true);
    try {
      await onConfirm({ deleteData });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-md rounded-3xl border border-slate-200 p-6 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sign-out-modal-title"
      >
        {/* Header with Title and Cancel 'X' Button */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800">
            <LogOut size={18} className="text-[#B23267]" />
            <h3 id="sign-out-modal-title" className="font-heading text-lg font-bold">
              Sign Out
            </h3>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            disabled={loading}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Cancel and return"
            aria-label="Cancel"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Summary Pill */}
        {user && (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="w-9 h-9 rounded-full bg-[#B23267] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User size={16} />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate">{user.displayName || 'Current User'}</p>
              <p className="text-[11px] text-slate-500 truncate">{user.email || 'No email provided'}</p>
            </div>
          </div>
        )}

        {/* Contextual Description */}
        <p className="text-xs text-slate-600 leading-relaxed">
          Are you sure you want to sign out? Your saved assessment and progress will be securely waiting for you next time you log in.
        </p>

        {/* Delete Data Checkbox Option */}
        <div className="flex flex-col gap-2 pt-1 pb-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none group">
            <input
              type="checkbox"
              id="delete-data-checkbox"
              checked={deleteData}
              onChange={(e) => setDeleteData(e.target.checked)}
              disabled={loading}
              className="mt-0.5 w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300 cursor-pointer"
            />
            <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900 transition-colors leading-snug">
              Also delete all my saved assessment results and profile data
            </span>
          </label>

          {/* Warning banner when deleteData is checked */}
          {deleteData && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] flex items-start gap-2 animate-in fade-in duration-150">
              <AlertTriangle size={15} className="shrink-0 text-rose-600 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="font-semibold block text-rose-900">Permanent action:</strong>
                All your assessment scores, radar chart data, and focus priorities will be permanently removed from the cloud and this device.
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleAction}
            disabled={loading}
            className={`py-2.5 px-5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 ${
              deleteData 
                ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {deleteData ? <Trash2 size={13} /> : <LogOut size={13} />}
            <span>
              {loading 
                ? (deleteData ? 'Deleting & Signing Out...' : 'Signing Out...') 
                : (deleteData ? 'Delete Data & Sign Out' : 'Sign Out')}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}
