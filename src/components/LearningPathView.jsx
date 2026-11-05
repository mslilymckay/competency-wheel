import React, { useState, useMemo, useEffect } from 'react';
import { 
  Award, Heart, ArrowLeft, FileText, Zap, ShieldCheck, User, 
  Copy, Check, ExternalLink, Sparkles, Route, RotateCcw
} from 'lucide-react';
import { getBlueprintForCompetency, buildTailoredPrompt } from '../data/interventionsData.js';

const TIER_THEMES = {
  ic: {
    primary: '#0B538C',
    lightBg: '#EBF5FB',
    borderLight: 'rgba(11, 83, 140, 0.2)',
    aiBorder: 'rgba(11, 83, 140, 0.3)',
    pillBg: '#0B538C',
    badgeText: '#0B538C',
  },
  manager: {
    primary: '#1E5C32',
    lightBg: '#E8F8EC',
    borderLight: 'rgba(30, 92, 50, 0.2)',
    aiBorder: 'rgba(30, 92, 50, 0.3)',
    pillBg: '#1E5C32',
    badgeText: '#1E5C32',
  },
  director: {
    primary: '#B23267',
    lightBg: '#FDE8EF',
    borderLight: 'rgba(178, 50, 103, 0.2)',
    aiBorder: 'rgba(178, 50, 103, 0.3)',
    pillBg: '#B23267',
    badgeText: '#B23267',
  },
  values: {
    primary: '#B45309',
    lightBg: '#FFFBEB',
    borderLight: 'rgba(180, 83, 9, 0.2)',
    aiBorder: 'rgba(180, 83, 9, 0.3)',
    pillBg: '#B45309',
    badgeText: '#B45309',
  }
};

export function LearningPathView({
  competencies = [],
  values = [],
  assessmentResults = null,
  selectedTier = 'ic',
  onBackToWheel,
  onBackToResults,
  onRetakeAssessment
}) {
  const [viewMode, setViewMode] = useState('employee'); // 'employee' | 'manager'
  const [hasCopiedPrompt, setHasCopiedPrompt] = useState(false);

  // Extract focus area leaf names and their corresponding tier
  const focusItems = useMemo(() => {
    const list = [];
    
    // Add from selected wheel paths
    competencies.forEach(path => {
      const leaf = path[path.length - 1];
      if (leaf && !list.some(item => item.name === leaf)) {
        const root = path[0];
        const itemTier = root === 'Manager' ? 'manager' : (root === 'Director' ? 'director' : 'ic');
        list.push({ name: leaf, type: 'competency', tier: itemTier });
      }
    });
    values.forEach(path => {
      const leaf = path[path.length - 1];
      if (leaf && !list.some(item => item.name === leaf)) {
        list.push({ name: leaf, type: 'value', tier: 'values' });
      }
    });

    // If no wheel paths selected, check assessment focus areas
    if (list.length === 0 && assessmentResults?.focusAreas) {
      assessmentResults.focusAreas.forEach(area => {
        list.push({ 
          name: area, 
          type: selectedTier === 'values' ? 'value' : 'competency',
          tier: selectedTier
        });
      });
    }

    // Default sample fallback if completely blank
    if (list.length === 0) {
      return [
        { name: "Timeline Reliability", type: 'competency', tier: 'ic' },
        { name: "Active Listening", type: 'competency', tier: 'ic' },
        { name: "Constructive Correction", type: 'competency', tier: 'ic' }
      ];
    }

    return list;
  }, [competencies, values, assessmentResults, selectedTier]);

  // Determine effective tier from active selections or selectedTier prop
  const effectiveTier = useMemo(() => {
    if (focusItems.length > 0 && focusItems[0].tier) {
      return focusItems[0].tier;
    }
    return selectedTier || 'ic';
  }, [focusItems, selectedTier]);

  // Dynamic tier theme matching assessment & wheel
  const theme = useMemo(() => {
    return TIER_THEMES[effectiveTier] || TIER_THEMES.ic;
  }, [effectiveTier]);

  // Determine Primary Tier / Level Name
  const levelTitle = useMemo(() => {
    if (effectiveTier === 'values') return 'Core Values';
    if (effectiveTier === 'manager') return 'Manager';
    if (effectiveTier === 'director') return 'Director';
    return 'Individual Contributor';
  }, [effectiveTier]);

  // Retrieve full blueprint for each focus item
  const blueprints = useMemo(() => {
    return focusItems
      .map(item => getBlueprintForCompetency(item.name, item.tier || effectiveTier))
      .filter(Boolean);
  }, [focusItems, effectiveTier]);

  // Generate dynamic Gemini prompt
  const initialPrompt = useMemo(() => {
    return buildTailoredPrompt({ level: levelTitle, blueprints });
  }, [levelTitle, blueprints]);

  const [promptText, setPromptText] = useState(initialPrompt);

  // Keep promptText synchronized whenever initialPrompt changes
  useEffect(() => {
    setPromptText(initialPrompt);
  }, [initialPrompt]);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptText);
    setHasCopiedPrompt(true);
  };

  const handleOpenGemini = () => {
    if (!hasCopiedPrompt) return;
    window.open('https://gemini.google.com/app', '_blank');
  };

  const handlePrint = (targetMode) => {
    if (targetMode && targetMode !== viewMode) {
      setViewMode(targetMode);
      setTimeout(() => window.print(), 100);
    } else {
      window.print();
    }
  };

  return (
    <div className="learning-path-wrapper w-full flex-1 flex flex-col p-3 sm:p-6 text-[#2A2A2A]">
      <div className="max-w-5xl mx-auto w-full flex flex-col gap-6 pb-16">
        
        {/* ============================================================= */}
        {/* TOP CONTROLS & VIEW SWITCHER (HIDDEN IN PRINT)                */}
        {/* ============================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 no-print">
          
          {/* Back Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToWheel}
              className="btn-secondary py-2 px-3.5 text-xs flex items-center gap-1.5 shadow-2xs"
            >
              <ArrowLeft size={14} />
              <span>Back to Wheel</span>
            </button>

            {onBackToResults && (
              <button
                onClick={onBackToResults}
                className="btn-secondary py-2 px-3 text-xs flex items-center gap-1"
                title="Back to Assessment Results"
              >
                <span>Results</span>
              </button>
            )}
          </div>

          {/* Center: View Switcher (Employee Blueprint vs Manager Playbook) */}
          <div className="inline-flex rounded-2xl p-1 bg-white border border-slate-200 shadow-sm">
            <button
              onClick={() => setViewMode('employee')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${viewMode === 'employee' ? 'bg-[#B23267] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <User size={14} />
              <span>Employee View</span>
            </button>
            <button
              onClick={() => setViewMode('manager')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${viewMode === 'manager' ? 'bg-[#B23267] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <ShieldCheck size={14} />
              <span>Manager View</span>
            </button>
          </div>

          {/* Action Button: Export PDF (Primary CTA) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePrint()}
              className="btn-primary py-2 px-4 rounded-xl font-bold text-xs shadow-sm flex items-center gap-1.5"
            >
              <FileText size={14} />
              <span>Export {viewMode === 'manager' ? 'Manager PDF' : 'Employee PDF'}</span>
            </button>
          </div>

        </div>

        {/* ============================================================= */}
        {/* DOCUMENT CONTAINER (SCREEN & PRINT)                           */}
        {/* ============================================================= */}
        <div className="page-container bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm flex flex-col gap-8 print:border-none print:shadow-none print:p-0">
          
          {/* Lily McKay Letterhead */}
          <header 
            className="border-b-4 pb-4 sm:pb-5 mb-4 sm:mb-6 print:pb-3 print:mb-4 transition-colors"
            style={{ borderColor: theme.primary }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-3xl sm:text-4xl font-heading text-[#2A2A2A] mb-1">
                  Career Development Pathway
                </h1>
                <p 
                  className="text-xs sm:text-sm font-bold uppercase tracking-widest transition-colors"
                  style={{ color: theme.primary }}
                >
                  {viewMode === 'manager' 
                    ? `Manager Coaching & Unblocking Playbook • ${levelTitle} Focus`
                    : `70-20-10 Professional Growth Blueprint • ${levelTitle} Focus`}
                </p>
              </div>

              {/* View Mode Watermark Pill in Screen View */}
              <div className="no-print self-start sm:self-center">
                <span 
                  className="px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 border transition-all"
                  style={
                    viewMode === 'manager'
                      ? { backgroundColor: '#FFFBEB', color: '#B45309', borderColor: 'rgba(245, 158, 11, 0.3)' }
                      : { backgroundColor: theme.lightBg, color: theme.primary, borderColor: theme.borderLight }
                  }
                >
                  {viewMode === 'manager' ? <ShieldCheck size={13} /> : <User size={13} />}
                  <span>{viewMode === 'manager' ? 'Manager Coaching Mode' : 'Self-Directed Growth Mode'}</span>
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Presented by Lily McKay, Transformation Architect • Career Navigation Framework
            </p>
          </header>

          {/* Focus Areas Overview Badges */}
          <div className="page-break-avoid flex flex-col gap-2.5 mb-6 sm:mb-8 print:mb-7">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Identified Priority Focus Areas ({blueprints.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {blueprints.map((bp) => (
                <span 
                  key={bp.name} 
                  className="px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-colors shadow-2xs"
                  style={{ 
                    backgroundColor: theme.lightBg, 
                    color: theme.primary, 
                    borderColor: theme.borderLight 
                  }}
                >
                  <Award size={12} />
                  <span>{bp.category} → {bp.name}</span>
                </span>
              ))}
            </div>
          </div>

          {/* ============================================================= */}
          {/* DISTINCT FOCUS AREA SECTIONS                                  */}
          {/* ============================================================= */}
          <div className="flex flex-col gap-8 print:gap-0 print:space-y-6">
            {blueprints.map((bp, index) => (
              <section 
                key={bp.name} 
                className="page-break-avoid p-5 sm:p-7 rounded-3xl bg-[#F5F5F7]/70 border border-slate-200/90 flex flex-col gap-5 shadow-2xs print:bg-white print:border-slate-300 print:p-5 print:mb-6 print:gap-4 print:rounded-2xl"
              >
                
                {/* Section Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                  <div>
                    <span 
                      className="text-[10px] font-extrabold uppercase tracking-widest transition-colors"
                      style={{ color: theme.primary }}
                    >
                      Focus Area #{index + 1} • {bp.category}
                    </span>
                    <h2 className="text-2xl font-heading text-[#2A2A2A]">{bp.name}</h2>
                  </div>
                  <p className="text-xs text-slate-500 max-w-md italic">
                    "{bp.definition}"
                  </p>
                </div>

                {/* 1. DAILY MICRO-HABIT BANNER (Immediate Day-1 Ritual) */}
                <div className="p-4 rounded-2xl bg-white border border-[#F59E0B]/30 shadow-2xs flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FFFBEB] text-[#B45309] flex items-center justify-center shrink-0 border border-[#F59E0B]/20">
                    <Zap size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#B45309]">
                        Daily Micro-Habit (Day 1 Ritual)
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        &lt; 2 mins / day • Starts Today
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-[#2A2A2A] leading-relaxed">
                      {bp.microHabit}
                    </p>
                  </div>
                </div>

                {/* 2. 70-20-10 STRATEGIC ACTION GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-3.5 print:gap-2.5">
                  
                  {/* 70% Experiential */}
                  <div className="p-4 print:p-3 rounded-2xl bg-white border border-slate-200/90 flex flex-col justify-between gap-3 shadow-2xs">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-100/90">
                        <span 
                          className="inline-flex items-center px-2 py-0.5 rounded-md text-white text-[10px] font-bold tracking-wide uppercase whitespace-nowrap shrink-0 shadow-2xs"
                          style={{ backgroundColor: theme.primary }}
                        >
                          70% Experiential
                        </span>
                        <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap shrink-0 text-right truncate">
                          {bp.experiential.tag}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#2A2A2A] leading-snug">
                        {bp.experiential.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {bp.experiential.action}
                      </p>
                    </div>

                    {/* Reflection Box */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-600">
                      <span className="font-bold text-slate-700 block mb-0.5">Coaching Reflection:</span>
                      <p className="italic leading-relaxed">{bp.experiential.reflection}</p>
                    </div>
                  </div>

                  {/* 20% Social */}
                  <div className="p-4 print:p-3 rounded-2xl bg-white border border-slate-200/90 flex flex-col justify-between gap-3 shadow-2xs">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-100/90">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#2A2A2A] text-white text-[10px] font-bold tracking-wide uppercase whitespace-nowrap shrink-0 shadow-2xs">
                          20% Social
                        </span>
                        <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap shrink-0 text-right truncate">
                          {bp.social.tag}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#2A2A2A] leading-snug">
                        {bp.social.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {bp.social.action}
                      </p>
                    </div>

                    {/* Reflection Box */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-600">
                      <span className="font-bold text-slate-700 block mb-0.5">Coaching Reflection:</span>
                      <p className="italic leading-relaxed">{bp.social.reflection}</p>
                    </div>
                  </div>

                  {/* 10% Formal */}
                  <div className="p-4 print:p-3 rounded-2xl bg-white border border-slate-200/90 flex flex-col justify-between gap-3 shadow-2xs">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-100/90">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-200 text-slate-800 text-[10px] font-bold tracking-wide uppercase whitespace-nowrap shrink-0">
                          10% Formal
                        </span>
                        <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap shrink-0 text-right truncate">
                          {bp.formal.tag}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#2A2A2A] leading-snug">
                        {bp.formal.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {bp.formal.action}
                      </p>
                    </div>

                    {/* Reflection Box */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-600">
                      <span className="font-bold text-slate-700 block mb-0.5">Coaching Reflection:</span>
                      <p className="italic leading-relaxed">{bp.formal.reflection}</p>
                    </div>
                  </div>

                </div>

                {/* 3. MANAGER UNBLOCKER & COACHING SECTION */}
                {viewMode === 'manager' ? (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFBEB] border-2 border-[#F59E0B]/60 shadow-2xs flex flex-col gap-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#B45309]">
                        <ShieldCheck size={18} />
                        <h4 className="font-bold text-xs uppercase tracking-wider">
                          Manager Commitment & Unblocking Action
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold bg-white text-[#B45309] px-2.5 py-0.5 rounded-md border border-[#F59E0B]/30">
                        1-on-1 Action Item
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                      {bp.managerUnblocker}
                    </p>

                    <div className="pt-2 border-t border-[#F59E0B]/30 flex flex-col gap-1">
                      <span className="text-[11px] font-bold text-[#B45309]">
                        Suggested 1-on-1 Discussion Starter:
                      </span>
                      <p className="text-xs text-slate-700 italic">
                        "{bp.managerCoachingQuestion}"
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Employee View Subtle Hint */
                  <div className="no-print text-right">
                    <button
                      onClick={() => setViewMode('manager')}
                      className="text-[11px] font-bold hover:underline inline-flex items-center gap-1 transition-colors"
                      style={{ color: theme.primary }}
                    >
                      <ShieldCheck size={12} />
                      <span>View Manager Unblocking Script for this skill →</span>
                    </button>
                  </div>
                )}

              </section>
            ))}
          </div>

          {/* ============================================================= */}
          {/* AI COACHING PROMPT SECTION (PRINTED ON EMPLOYEE EXPORT)       */}
          {/* ============================================================= */}
          <div 
            className={`page-break-avoid p-6 sm:p-8 rounded-3xl border-2 flex flex-col gap-4 transition-colors ${
              viewMode === 'manager' 
                ? 'no-print' 
                : 'print:bg-white print:border-slate-300 print:p-5 print:rounded-2xl'
            }`}
            style={{ 
              backgroundColor: `${theme.lightBg}cc`, 
              borderColor: theme.aiBorder 
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 
                  className="font-heading text-lg flex items-center gap-2 transition-colors"
                  style={{ color: theme.primary }}
                >
                  <Sparkles size={18} />
                  <span>Executive AI Coaching Prompt</span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Dynamic synthesis of your micro-habits, 70-20-10 milestones, and manager alignment questions.
                </p>
              </div>

              <span 
                className="text-[10px] font-bold bg-white px-3 py-1 rounded-full border shadow-2xs transition-colors"
                style={{ color: theme.primary, borderColor: theme.borderLight }}
              >
                Google Gemini Ready
              </span>
            </div>

            {/* Editable on Screen */}
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              rows={8}
              className="print:hidden w-full p-4 rounded-2xl bg-white border border-slate-200/90 text-xs font-mono text-[#2A2A2A] outline-none resize-y leading-relaxed shadow-inner select-text"
            />

            {/* Formatted Clean Text in Print View */}
            <div className="hidden print:block p-3.5 rounded-xl bg-white border border-slate-200 text-[10.5px] font-mono text-slate-800 whitespace-pre-wrap leading-snug select-text">
              {promptText}
            </div>

            {/* Prompt Action Buttons (Interactive only, hidden in print) */}
            <div className="no-print flex flex-wrap items-center justify-between gap-3 pt-1">
              <p className="text-xs text-slate-500">
                💡 Tip: Copy the prompt and paste it into Google Gemini or ChatGPT to generate your 30-day coaching sprint.
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-colors"
                >
                  {hasCopiedPrompt ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  <span>{hasCopiedPrompt ? 'Prompt Copied!' : 'Copy Prompt'}</span>
                </button>

                <button
                  disabled={!hasCopiedPrompt}
                  onClick={handleOpenGemini}
                  className={`flex items-center gap-1.5 py-2 px-4 rounded-xl font-bold text-xs transition-all shadow-sm ${
                    hasCopiedPrompt 
                      ? 'cursor-pointer text-white' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                  }`}
                  style={hasCopiedPrompt ? { backgroundColor: theme.primary } : {}}
                  title={hasCopiedPrompt ? 'Open Gemini in new tab' : 'Click Copy Prompt first to activate'}
                >
                  <span>Open Gemini</span>
                  <ExternalLink size={13} />
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* ============================================================= */}
        {/* BOTTOM ACTION BAR (DUPLICATE EXPORT - HIDDEN IN PRINT)        */}
        {/* ============================================================= */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200/80">
          <button
            onClick={onBackToWheel}
            className="btn-secondary py-2 px-3.5 text-xs flex items-center gap-1.5 shadow-2xs"
          >
            <ArrowLeft size={14} />
            <span>Back to Wheel</span>
          </button>

          <button
            onClick={() => handlePrint()}
            className="btn-primary py-2.5 px-5 rounded-xl font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <FileText size={14} />
            <span>Export {viewMode === 'manager' ? 'Manager PDF' : 'Employee PDF'}</span>
          </button>
        </div>

      </div>

    </div>
  );
}
