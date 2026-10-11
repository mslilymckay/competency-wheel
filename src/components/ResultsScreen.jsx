import React from 'react';
import { ArrowRight, Compass, CheckCircle2 } from 'lucide-react';
import { allDefinitions } from '../lib/wheelTheme.js';

export function ResultsScreen({ results, onContinueToWheel, onRetake }) {
  const tierName = results?.tier ? results.tier.toUpperCase() : 'IC';
  const strengths = results?.strengths || ['High-Quality Delivery', 'Execution Efficiency', 'Timeline Reliability'];
  const focusAreas = results?.focusAreas || ['Roadblock Diagnosis', 'Growth Proactivity', 'Constructive Teaming'];

  return (
    <div className="max-w-4xl mx-auto w-full py-2 sm:py-4 flex flex-col justify-between flex-1 min-h-0 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-6">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E5C32] bg-[#E8F8EC] border border-[#1E5C32]/20 px-3 py-0.5 rounded-full">
          Assessment Complete
        </span>
        <h1 className="text-2xl sm:text-3xl font-heading text-[#2A2A2A] mt-2 mb-1">
          Your {tierName} Leadership Footprint
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Here is your mathematically balanced assessment summary. (Full Radar Chart will be visualized in Sprint 4).
        </p>
      </div>

      {/* Strengths & Focus Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 my-auto">
        {/* Top 3 Strengths */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-[#E8F8EC] text-[#1E5C32] flex items-center justify-center">
                <CheckCircle2 size={16} />
              </div>
              <h3 className="font-heading text-base sm:text-lg text-[#2A2A2A]">Top 3 Strengths</h3>
            </div>
            <div className="flex flex-col gap-2.5">
              {strengths.map((s, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#F5F5F7] flex flex-col gap-1 border border-slate-200/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2A2A2A]">{s}</span>
                    <span className="text-[10px] font-bold text-[#1E5C32] bg-[#E8F8EC] px-2 py-0.5 rounded-md border border-[#1E5C32]/20">
                      Foundational Skill
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {allDefinitions[s] || "Demonstrated strength and high reliability in this domain."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top 3 Focus Areas */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-[#FCE7F3] text-[#B23267] flex items-center justify-center">
                <Compass size={16} />
              </div>
              <h3 className="font-heading text-base sm:text-lg text-[#2A2A2A]">Top 3 Focus Areas</h3>
            </div>
            <div className="flex flex-col gap-2.5">
              {focusAreas.map((f, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#F5F5F7] flex flex-col gap-1 border border-slate-200/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2A2A2A]">{f}</span>
                    <span className="text-[10px] font-bold text-[#B23267] bg-[#FCE7F3] px-2 py-0.5 rounded-md border border-[#B23267]/20">
                      Priority Area
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {allDefinitions[f] || "Passed over in favor of peer priorities during forced comparisons."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Next Actions CTA */}
      <div className="bg-[#F5F5F7] border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm mt-3 sm:mt-4">
        <div className="text-center sm:text-left">
          <h4 className="font-heading text-base text-[#2A2A2A]">Ready to explore your customized wheel?</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Launching the wheel will automatically pre-focus on your 3 target growth areas.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onRetake}
            className="btn-secondary py-2.5 px-4 text-xs"
          >
            Retake Assessment
          </button>
          <button
            onClick={onContinueToWheel}
            className="btn-primary py-2.5 px-5 text-xs flex items-center gap-2"
          >
            <span>Continue to Wheel</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

    </div>
  );
}
