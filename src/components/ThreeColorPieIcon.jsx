import React from 'react';

export function ThreeColorPieIcon({ size = 26, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <path d="M16 16 L16 2 A14 14 0 0 1 28.12 23 L16 16 Z" fill="#be185d" />
      <path d="M16 16 L28.12 23 A14 14 0 0 1 3.88 23 L16 16 Z" fill="#5BCEFA" />
      <path d="M16 16 L3.88 23 A14 14 0 0 1 16 2 L16 16 Z" fill="#1f2937" />
      <circle cx="16" cy="16" r="14" stroke="#ffffff" strokeWidth="1.5" />
    </svg>
  );
}
