import React from 'react';
import { Monitor } from 'lucide-react';
import { ThreeColorPieIcon } from './ThreeColorPieIcon.jsx';

export function NarrowViewportNotice({ onDismiss }) {
  return (
    <div className="fixed inset-0 z-50 bg-[#F5F5F7] flex flex-col items-center justify-center p-6 text-center select-none animate-in fade-in duration-300 no-print">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col items-center gap-5">
        
        {/* Brand badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FCE7F3] text-[#B23267] text-xs font-bold border border-[#B23267]/20">
          <ThreeColorPieIcon size={16} />
          <span>Competency & Values Explorer</span>
        </div>

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#EBF5FB] text-[#0B538C] border border-[#0B538C]/20 flex items-center justify-center shadow-sm">
          <Monitor size={32} />
        </div>

        {/* Heading & description */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl sm:text-2xl font-heading text-[#2A2A2A] leading-snug">
            Larger Screen Format Recommended
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            This interactive career navigation system is designed for desktop, laptop, or tablet landscape viewports (minimum 1024px width).
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Please expand your browser window or switch to a larger device to experience the 360° interactive wheel, ipsative assessment, and 70-20-10 blueprints.
          </p>
        </div>

        {/* Dismiss button */}
        {onDismiss && (
          <div className="pt-2 border-t border-slate-100 w-full flex justify-center">
            <button
              onClick={onDismiss}
              className="text-xs text-slate-400 hover:text-[#B23267] hover:underline transition-colors py-1 px-3"
            >
              Continue anyway on small screen
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
