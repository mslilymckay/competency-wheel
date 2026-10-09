import React from 'react';

export function BrandFooter() {
  return (
    <footer className="w-full border-t border-slate-200 py-6 mt-auto bg-white no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <span>© 2026 Lily McKay</span>
        <a 
          href="https://www.mslilymckay.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-bold text-rose-700 hover:underline"
        >
          www.mslilymckay.com
        </a>
      </div>
    </footer>
  );
}
