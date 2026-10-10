import React, { useState } from 'react';
import { Award, Users, Compass, Heart, ArrowRight, Compass as ExploreIcon, CheckCircle2, ArrowLeft } from 'lucide-react';

const TIERS = [
  {
    id: 'ic',
    name: 'Individual Contributor',
    badge: '15 Questions',
    icon: Award,
    description: 'Foundational execution, craft mastery, proactive collaboration, and personal accountability across 15 observable skills.',
    accentColor: 'border-blue-500 bg-blue-50/40 text-blue-700',
    hoverBorder: 'hover:border-blue-500',
    selectedRing: 'ring-2 ring-blue-500 border-blue-500'
  },
  {
    id: 'manager',
    name: 'Manager',
    badge: '15 Questions',
    icon: Users,
    description: 'Coaching direct reports, workload balancing, friction resolution, psychological safety, and operational milestone execution.',
    accentColor: 'border-emerald-500 bg-emerald-50/40 text-emerald-700',
    hoverBorder: 'hover:border-emerald-500',
    selectedRing: 'ring-2 ring-emerald-500 border-emerald-500'
  },
  {
    id: 'director',
    name: 'Director',
    badge: '15 Questions',
    icon: Compass,
    description: 'Strategic foresight, cross-silo consensus, large-scale change management, talent architecture, and fiscal governance.',
    accentColor: 'border-amber-500 bg-amber-50/40 text-amber-700',
    hoverBorder: 'hover:border-amber-500',
    selectedRing: 'ring-2 ring-amber-500 border-amber-500'
  },
  {
    id: 'values',
    name: 'Core Values',
    badge: '12 Questions',
    icon: Heart,
    description: 'Examine organizational core values (Teamwork, Empathy, Agility, Integrity) and actionable workplace behaviors.',
    accentColor: 'border-rose-500 bg-rose-50/40 text-rose-700',
    hoverBorder: 'hover:border-rose-500',
    selectedRing: 'ring-2 ring-rose-500 border-rose-500'
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
    <div className="max-w-4xl mx-auto w-full py-6 sm:py-10 animate-in fade-in duration-300">
      
      {/* Top Navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-charcoal mb-6 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Welcome
      </button>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-blush border border-rose-200 px-3 py-1 rounded-full">
          Step 1 of 2
        </span>
        <h1 className="text-3xl sm:text-4xl font-heading text-charcoal mt-3 mb-2">
          Choose Your Assessment Tier
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Select the leadership level or values domain you want to evaluate. You can take the balanced 15-question assessment or jump directly into the visual wheel.
        </p>
      </div>

      {/* Tier Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {TIERS.map((tier) => {
          const Icon = tier.icon;
          const isSelected = selectedTier === tier.id;
          return (
            <div
              key={tier.id}
              onClick={() => handleTierClick(tier.id)}
              className={`p-6 rounded-3xl border-2 cursor-pointer transition-all bg-white relative flex flex-col justify-between ${
                isSelected 
                  ? tier.selectedRing + ' shadow-md' 
                  : 'border-slate-200 ' + tier.hoverBorder + ' hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${tier.accentColor}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-500 bg-cloud px-2.5 py-0.5 rounded-full">
                      {tier.badge}
                    </span>
                    {isSelected && (
                      <CheckCircle2 size={18} className="text-rose-700" />
                    )}
                  </div>
                </div>

                <h3 className="font-heading text-xl text-charcoal mb-1.5">
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
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="text-center sm:text-left">
          <h4 className="font-heading text-lg text-charcoal">
            Selected: <span className="text-rose-700 font-semibold">{currentTierObj.name}</span>
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Choose how you'd like to experience this framework:
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Explore Directly Button */}
          <button
            onClick={() => {
              if (onSelectTier) onSelectTier(selectedTier);
              onExploreWheel();
            }}
            className="w-full sm:w-auto py-3 px-5 btn-secondary flex items-center justify-center gap-2"
          >
            <ExploreIcon size={14} />
            <span>Explore Wheel Directly</span>
          </button>

          {/* Take Assessment Button */}
          <button
            onClick={() => {
              if (onSelectTier) onSelectTier(selectedTier);
              onStartAssessment();
            }}
            className="w-full sm:w-auto py-3 px-6 btn-primary flex items-center justify-center gap-2"
          >
            <span>Take Ipsative Assessment</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

    </div>
  );
}
