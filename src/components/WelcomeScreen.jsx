import React from 'react';
import { Award, Users, Compass, ArrowRight, Compass as ExploreIcon, FileText } from 'lucide-react';
import { ThreeColorPieIcon } from './ThreeColorPieIcon.jsx';
import { assessmentData } from '../data/assessmentData.js';

export const TIERS = [
  {
    id: 'ic',
    name: 'Individual Contributor',
    icon: Award,
    accentBg: '#E0F7FE',
    selectedCardBg: '#EBF5FB',
    brandColor: '#0B538C'
  },
  {
    id: 'manager',
    name: 'Manager',
    icon: Users,
    accentBg: '#E8F8EC',
    selectedCardBg: '#E8F8EC',
    brandColor: '#1E5C32'
  },
  {
    id: 'director',
    name: 'Director',
    icon: Compass,
    accentBg: '#FCE7F3',
    selectedCardBg: '#FDE8EF',
    brandColor: '#B23267'
  }
];

export function WelcomeScreen({
  selectedTier = 'ic',
  hasSavedResults = false,
  onSelectTier,
  onStartAssessment,
  onExploreWheel,
  onViewSavedResults
}) {
  const currentTierObj = TIERS.find(t => t.id === selectedTier) || TIERS[0];
  const hasQuestionsForTier = Boolean(assessmentData?.[selectedTier]?.length > 0);

  const handleTierClick = (tierId) => {
    if (onSelectTier) {
      onSelectTier(tierId);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full py-4 sm:py-8 px-2 sm:px-4 flex flex-col justify-center gap-8 sm:gap-10 flex-1 min-h-0 my-auto animate-in fade-in duration-300">
      
      {/* 1. Single-Column Centered Hero */}
      <section className="text-center max-w-5xl w-full mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FCE7F3] text-[#B23267] text-xs font-bold border border-[#B23267]/20 mb-3">
          <ThreeColorPieIcon size={16} />
          <span>360° Career Navigation</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading text-[#2A2A2A] leading-tight mb-3">
          Competency Explorer
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed max-w-4xl mx-auto">
          Assess your skills against organizational competencies to unlock a custom, action-oriented learning plan.
        </p>
      </section>

      {/* 2. Interactive 3-Tier Selection Row (Semantic Buttons with 2-Row Layout & Matching Shading) */}
      <section aria-label="Select an assessment">
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            SELECT AN ASSESSMENT
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
          {TIERS.map((tier) => {
            const Icon = tier.icon;
            const isSelected = selectedTier === tier.id;
            const cardStyle = isSelected
              ? {
                  backgroundColor: tier.selectedCardBg,
                  borderColor: tier.brandColor,
                  boxShadow: `0 0 0 2px ${tier.brandColor}, 0 6px 16px rgba(0, 0, 0, 0.06)`
                }
              : {
                  backgroundColor: '#ffffff'
                };

            return (
              <button
                key={tier.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleTierClick(tier.id)}
                style={cardStyle}
                className="p-5 sm:p-6 min-h-[128px] sm:min-h-[136px] rounded-2xl border-2 border-slate-200 hover:border-slate-400 transition-all text-left flex flex-col justify-between group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#B23267]"
              >
                {/* Row 1: Icon & Radio Indicator */}
                <div className="w-full flex items-center justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 shadow-2xs transition-colors"
                    style={{
                      backgroundColor: isSelected ? '#ffffff' : tier.accentBg,
                      color: tier.brandColor,
                      borderColor: `${tier.brandColor}33`
                    }}
                  >
                    <Icon size={20} />
                  </div>

                  <div className="shrink-0">
                    {isSelected ? (
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center border-2 bg-white"
                        style={{ borderColor: tier.brandColor }}
                        aria-hidden="true"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: tier.brandColor }}
                        />
                      </span>
                    ) : (
                      <span
                        className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-slate-400 bg-white block transition-colors"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </div>

                {/* Row 2: Tier Label */}
                <h3 className="font-heading text-lg text-[#2A2A2A] leading-snug mt-4">
                  {tier.name}
                </h3>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Bottom Action Bar (Only Selected Tier & Action Buttons) */}
      <section
        aria-label="Assessment actions"
        className="bg-[#F5F5F7] border border-slate-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs"
      >
        <div className="text-center sm:text-left">
          <h3 className="font-heading text-base sm:text-lg text-[#2A2A2A]">
            Selected:{' '}
            <span className="font-semibold" style={{ color: currentTierObj.brandColor }}>
              {currentTierObj.name}
            </span>
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
          {/* Tertiary Action: View Saved Report (Authenticated users with saved report for selected tier) */}
          {hasSavedResults && onViewSavedResults && (
            <button
              type="button"
              onClick={onViewSavedResults}
              className="w-full sm:w-auto py-2.5 px-4 btn-secondary flex items-center justify-center gap-1.5 text-xs text-[#B23267] border-[#B23267]/40 hover:bg-rose-50 font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B23267]"
            >
              <FileText size={14} />
              <span>View Saved Report</span>
            </button>
          )}

          {/* Secondary Action: Explore Wheel Directly */}
          <button
            type="button"
            onClick={onExploreWheel}
            className="w-full sm:w-auto py-2.5 px-4 btn-secondary flex items-center justify-center gap-2 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B23267]"
          >
            <ExploreIcon size={14} />
            <span>Explore Wheel Directly</span>
          </button>

          {/* Primary Action: Start Assessment */}
          <button
            type="button"
            disabled={!hasQuestionsForTier}
            title={!hasQuestionsForTier ? 'No assessment questions available for this tier' : `Start ${currentTierObj.name} Assessment`}
            aria-label={!hasQuestionsForTier ? 'No assessment questions available for this tier' : `Start ${currentTierObj.name} Assessment`}
            onClick={onStartAssessment}
            className="w-full sm:w-auto py-2.5 px-5 btn-primary flex items-center justify-center gap-2 text-xs disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#B23267]"
          >
            <span>Start Assessment</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </section>

    </div>
  );
}
