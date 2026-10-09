import React from 'react';
import { ArrowLeft, ArrowRight, Award, Compass, Sparkles, CheckCircle2 } from 'lucide-react';

export function ResultsScreen({ results, onContinueToWheel, onRetake }) {
  // Safe fallbacks for placeholder testing
  const tierName = results?.tier ? results.tier.toUpperCase() : 'IC';
  const strengths = results?.strengths || ['High-Quality Delivery', 'Execution Efficiency', 'Technical Mastery'];
  const focusAreas = results?.focusAreas || ['Roadblock Diagnosis', 'Growth Proactivity', 'Constructive Teaming'];
  const bypassLog = results?.bypassLog || [];

  return (
    <div className="max-w-4xl mx-auto w-full py-6 sm:py-10 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
          Assessment Complete
        </span>
        <h1 className="text-3xl sm:text-4xl font-heading text-charcoal mt-3 mb-2">
          Your {tierName} Leadership Footprint
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Here is your mathematically balanced assessment summary. (Full Radar Chart will be visualized in Sprint 4).
        </p>
      </div>

      {/* Strengths & Focus Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Top 3 Strengths (2/2s) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
            <h3 className="font-heading text-lg text-charcoal">Top 3 Strengths</h3>
          </div>
          <div className="flex flex-col gap-3">
            {strengths.map((s, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-cloud flex items-center justify-between">
                <span className="text-xs font-bold text-charcoal">{s}</span>
                <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                  Score: 2/2
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top 3 Focus Areas (0/2s) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <Compass size={18} />
            </div>
            <h3 className="font-heading text-lg text-charcoal">Top 3 Focus Areas</h3>
          </div>
          <div className="flex flex-col gap-3">
            {focusAreas.map((f, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-cloud flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-charcoal">{f}</span>
                  <span className="text-[11px] font-extrabold text-rose-700 bg-rose-100/60 px-2 py-0.5 rounded-md">
                    Priority Area
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">
                  Passed over in favor of peer priorities during forced comparisons.
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Next Actions CTA */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div>
          <h4 className="font-heading text-lg text-charcoal">Ready to explore your customized wheel?</h4>
          <p className="text-xs text-slate-500 mt-1">
            Launching the wheel will automatically pre-focus on your 3 target growth areas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRetake}
            className="py-3 px-5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-charcoal font-bold text-xs transition-colors"
          >
            Retake
          </button>
          <button
            onClick={onContinueToWheel}
            className="py-3 px-6 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <span>Continue to Wheel</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

    </div>
  );
}
