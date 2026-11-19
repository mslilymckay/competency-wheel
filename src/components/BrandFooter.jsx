import React from 'react';

export function BrandFooter() {
  return (
    <footer className="w-full border-t border-slate-200 py-3 bg-white shrink-0 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
        <span>© 2026 Lily McKay</span>
        <div className="flex items-center gap-4">
          <a
            href="https://www.mslilymckay.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-slate-700 hover:text-[#B23267] transition-colors"
          >
            www.mslilymckay.com
          </a>
          <span className="text-slate-300" aria-hidden="true">|</span>
          <a
            href="https://www.mslilymckay.com/#contact"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#B23267] hover:underline"
          >
            Contact Me
          </a>
        </div>
      </div>
    </footer>
  );
}
