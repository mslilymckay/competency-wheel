import React from 'react';

export function ThreeColorPieIcon({ size = 26, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <path d="M16 16 L16 2 A14 14 0 0 1 28.12 23 Z" fill="#B23267" />
      <path d="M16 16 L28.12 23 A14 14 0 0 1 3.88 23 Z" fill="#0B538C" />
      <path d="M16 16 L3.88 23 A14 14 0 0 1 16 2 Z" fill="#1E5C32" />
      <circle cx="16" cy="16" r="4" fill="#FFCC00" stroke="#ffffff" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="14" stroke="#ffffff" strokeWidth="1.5" />
    </svg>
  );
}
