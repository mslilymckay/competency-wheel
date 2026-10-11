import React, { useState } from 'react';
import { Award, Users, Compass, Heart, ArrowRight, Compass as ExploreIcon, CheckCircle2, ArrowLeft } from 'lucide-react';

const TIERS = [
  {
    id: 'ic',
    name: 'Individual Contributor',
    badge: '15 Questions',
    icon: Award,
    description: 'Foundational execution, craft mastery, proactive collaboration, and personal accountability across 15 observable skills.',
    accentColor: 'bg-[#E0F7FE] text-[#0B538C] border border-[#0B538C]/20',
    hoverBorder: 'hover:border-[#0B538C]',
    selectedRing: 'ring-2 ring-[#0B538C] border-[#0B538C]',
    brandColor: '#0B538C'
  },
  {
    id: 'manager',
    name: 'Manager',
    badge: '15 Questions',
    icon: Users,
    description: 'Coaching direct reports, workload balancing, friction resolution, psychological safety, and operational milestone execution.',
    accentColor: 'bg-[#E8F8EC] text-[#1E5C32] border border-[#1E5C32]/20',
    hoverBorder: 'hover:border-[#1E5C32]',
    selectedRing: 'ring-2 ring-[#1E5C32] border-[#1E5C32]',
    brandColor: '#1E5C32'
  },
  {
    id: 'director',
    name: 'Director',
    badge: '15 Questions',
    icon: Compass,
    description: 'Strategic foresight, cross-silo consensus, large-scale change management, talent architecture, and fiscal governance.',
    accentColor: 'bg-[#FCE7F3] text-[#B23267] border border-[#B23267]/20',
    hoverBorder: 'hover:border-[#B23267]',
    selectedRing: 'ring-2 ring-[#B23267] border-[#B23267]',
    brandColor: '#B23267'
  },
  {
    id: 'values',
    name: 'Core Values',
    badge: '12 Questions',
    icon: Heart,
    description: 'Examine organizational core values (Teamwork, Empathy, Agility, Integrity) and actionable workplace behaviors.',
    accentColor: 'bg-[#FFFBEB] text-[#B45309] border border-[#B45309]/20',
    hoverBorder: 'hover:border-[#B45309]',
    selectedRing: 'ring-2 ring-[#B45309] border-[#B45309]',
    brandColor: '#B45309'
  }
];

export function TierSelectScreen({ onSelectTier, onStartAssessment, onExploreWheel, onBack }) {
  const [selectedTier, setSelectedTier] = useState('ic');

  const handleTierClick = (tierId) => {
    setSelectedTier(tierId);
    if (onSelectTier) onSelectTier(tierId);
  };

  const currentTierObj = TIERS.find(t => t.id === selectedTier) || TIERS[0];

  return (
    <div className="max-w-4xl mx-auto w-full py-2 sm:py-4 flex flex-col justify-between flex-1 min-h-0 animate-in fade-in duration-300">
      
      {/* Top Navigation */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-[#2A2A2A] mb-3 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Welcome
        </button>

        {/* Header (No Step 1 of 2) */}
        <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-heading text-[#2A2A2A] mb-1.5">
            Choose Your Assessment Tier
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Select the leadership level or values domain you want to evaluate. You can take the balanced assessment or jump directly into the visual wheel.
          </p>
        </div>
      </div>

      {/* Tier Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 my-auto">
        {TIERS.map((tier) => {
          const Icon = tier.icon;
          const isSelected = selectedTier === tier.id;
          return (
            <div
              key={tier.id}
              onClick={() => handleTierClick(tier.id)}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all bg-white relative flex flex-col justify-between ${
                isSelected 
                  ? tier.selectedRing + ' shadow-md' 
                  : 'border-slate-200 ' + tier.hoverBorder + ' hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tier.accentColor}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-500 bg-[#F5F5F7] px-2.5 py-0.5 rounded-full">
                      {tier.badge}
                    </span>
                    {isSelected && (
                      <CheckCircle2 size={18} style={{ color: tier.brandColor }} />
                    )}
                  </div>
                </div>

                <h3 className="font-heading text-lg text-[#2A2A2A] mb-1">
                  {tier.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {tier.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Next Actions Container */}
      <div className="bg-[#F5F5F7] border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm mt-3 sm:mt-4">
        <div className="text-center sm:text-left">
          <h4 className="font-heading text-base text-[#2A2A2A]">
            Selected: <span className="font-semibold" style={{ color: currentTierObj.brandColor }}>{currentTierObj.name}</span>
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Choose how you'd like to experience this framework:
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
          {/* Explore Directly Button */}
          <button
            onClick={() => {
              if (onSelectTier) onSelectTier(selectedTier);
              onExploreWheel();
            }}
            className="w-full sm:w-auto py-2.5 px-4 btn-secondary flex items-center justify-center gap-2 text-xs"
          >
            <ExploreIcon size={14} />
            <span>Explore Wheel Directly</span>
          </button>

          {/* Start Assessment Button */}
          <button
            onClick={() => {
              if (onSelectTier) onSelectTier(selectedTier);
              onStartAssessment();
            }}
            className="w-full sm:w-auto py-2.5 px-5 btn-primary flex items-center justify-center gap-2 text-xs"
          >
            <span>Start Assessment</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

    </div>
  );
}
