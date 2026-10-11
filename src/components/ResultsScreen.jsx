import React, { useState, useRef, useMemo } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { allDefinitions, allMicroHabits, getCategoryForCompetency, defaultCompetencyFramework } from '../lib/wheelTheme.js';

export function ResultsScreen({ results, onContinueToWheel, onRetake }) {
  const [inspectedCategory, setInspectedCategory] = useState(null);
  const drawerRef = useRef(null);

  const tier = results?.tier || 'ic';
  const tierName = tier === 'ic' ? 'Individual Contributor' : tier === 'manager' ? 'Manager' : 'Director';
  const tierColor = tier === 'ic' ? '#0B538C' : tier === 'manager' ? '#1E5C32' : '#B23267';
  const tierBg = tier === 'ic' ? '#EBF5FB' : tier === 'manager' ? '#E8F8EC' : '#FDE8EF';

  const strengths = useMemo(() => {
    return results?.strengths || ['High-Quality Delivery', 'Transparent Sharing', 'Roadblock Diagnosis'];
  }, [results]);

  const focusAreas = useMemo(() => {
    return results?.focusAreas || ['Growth Proactivity', 'Active Listening', 'Timeline Reliability'];
  }, [results]);

  // Retrieve the 5 categories for the current tier
  const tierCategories = useMemo(() => {
    const tierObj = defaultCompetencyFramework.find(t => 
      (tier === 'ic' && t.name === 'Individual Contributor') ||
      (tier === 'manager' && t.name === 'Manager') ||
      (tier === 'director' && t.name === 'Director')
    );
    return tierObj ? tierObj.categories.map(c => c.name) : [
      'Action Orientation',
      'Collaborative Communication',
      'Problem Solving',
      'Functional Expertise',
      'Personal Accountability'
    ];
  }, [tier]);

  // Center & Radii configuration for the 3-ring system (0 = inner, 1 = middle, 2 = outer)
  const center = 220;
  const rInner = 38;   // Level 0 (Focus Area level)
  const rMiddle = 88;  // Level 1 (Proficient / Baseline level)
  const rOuter = 140;  // Level 2 (Foundational Strength level)

  // Compute category scores & dynamic footprint points
  // Angle: 5 equidistant axes, starting at 12 o'clock (-90 degrees)
  const radarData = useMemo(() => {
    return tierCategories.map((catName, idx) => {
      const angleDeg = -90 + (idx * 72);
      const angleRad = angleDeg * (Math.PI / 180);

      // Determine strength / focus prominence for this category
      const hasStrength = strengths.some(s => getCategoryForCompetency(s, tier) === catName);
      const hasFocus = focusAreas.some(f => getCategoryForCompetency(f, tier) === catName);

      let radius = rMiddle;
      let status = 'Balanced';

      if (hasStrength && !hasFocus) {
        radius = rOuter;
        status = 'Strength';
      } else if (hasFocus && !hasStrength) {
        radius = rInner;
        status = 'Focus Area';
      } else if (hasStrength && hasFocus) {
        radius = (rMiddle + rOuter) / 2;
        status = 'Mixed';
      }

      const x = center + (radius * Math.cos(angleRad));
      const y = center + (radius * Math.sin(angleRad));

      // Coordinate for the outer spoke end
      const spokeX = center + (rOuter * Math.cos(angleRad));
      const spokeY = center + (rOuter * Math.sin(angleRad));

      // Coordinate for label placement slightly outside outer ring
      const labelRadius = rOuter + 26;
      const labelX = center + (labelRadius * Math.cos(angleRad));
      const labelY = center + (labelRadius * Math.sin(angleRad));

      return {
        name: catName,
        angleDeg,
        radius,
        x,
        y,
        spokeX,
        spokeY,
        labelX,
        labelY,
        status
      };
    });
  }, [tierCategories, strengths, focusAreas, tier]);

  // SVG polygon points string for user result shape
  const userPolygonPoints = useMemo(() => {
    return radarData.map(d => `${d.x.toFixed(1)},${d.y.toFixed(1)}`).join(' ');
  }, [radarData]);

  // Click handler for category points & labels: updates badge and scrolls to matching card
  const handleCategoryClick = (catName) => {
    const data = radarData.find(d => d.name === catName);
    if (data) {
      setInspectedCategory({ name: catName, status: data.status });
    }

    // Attempt to scroll to the category's card in the right drawer
    if (drawerRef.current) {
      const safeId = `card-cat-${catName.replace(/[^a-zA-Z0-9]/g, '-')}`;
      const targetCard = drawerRef.current.querySelector(`#${safeId}`);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        targetCard.classList.remove('ring-2', 'ring-offset-2', 'ring-[#0B538C]');
        void targetCard.offsetWidth; // Force reflow
        targetCard.classList.add('ring-2', 'ring-offset-2', 'ring-[#0B538C]');
        setTimeout(() => {
          targetCard.classList.remove('ring-2', 'ring-offset-2', 'ring-[#0B538C]');
        }, 1800);
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex-1 min-h-0 flex flex-col justify-between overflow-hidden animate-in fade-in duration-300">
      
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between pb-2 sm:pb-3 mb-2 border-b border-slate-200/80 shrink-0 gap-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Assessment Results
          </span>
          <h2 className="text-xl sm:text-2xl font-heading text-[#2A2A2A] leading-tight">
            Leadership Competency Diagnostic & Report
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRetake}
            className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
          >
            <RotateCcw size={12} />
            <span>Retake</span>
          </button>
        </div>
      </div>

      {/* Split 50/50 Viewport Layout (Left: Radar, Right: Scrollable Drawer) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 flex-1 min-h-0 items-stretch overflow-hidden">
        
        {/* =================================================================== */}
        {/* LEFT COLUMN: SIMPLIFIED RADAR CHART (3 RINGS, NO NUMBERS, NO BENCHMARK) */}
        {/* =================================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-6 shadow-sm flex flex-col justify-between overflow-hidden">
          
          {/* Card Top Meta */}
          <div className="flex items-center justify-between mb-1 min-h-[30px] shrink-0">
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors"
              style={{ backgroundColor: tierBg, color: tierColor }}
            >
              {tierName}
            </span>

            {/* Dynamic Inspector Badge (No numeric scores!) */}
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border transition-all ${
                inspectedCategory 
                  ? (inspectedCategory.status === 'Strength' ? 'text-[#1E5C32] bg-[#E8F8EC] border-[#1E5C32]/20' : 'text-[#B23267] bg-[#FDE8EF] border-[#B23267]/20')
                  : 'text-slate-500 bg-slate-50 border-slate-200/60'
              }`}
            >
              {inspectedCategory ? `${inspectedCategory.name} — ${inspectedCategory.status}` : 'Click points to inspect details'}
            </span>
          </div>

          {/* SVG Radar Graphic */}
          <div className="relative flex-1 min-h-0 flex items-center justify-center py-2 select-none">
            <svg viewBox="0 0 440 440" className="w-full h-full max-h-[380px] overflow-visible">
              <defs>
                <radialGradient id="radar-grad-blue" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#00CCFF" stop-opacity="0.38" />
                  <stop offset="100%" stop-color="#0B538C" stop-opacity="0.16" />
                </radialGradient>
                <radialGradient id="radar-grad-green" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#82D18D" stop-opacity="0.38" />
                  <stop offset="100%" stop-color="#1E5C32" stop-opacity="0.16" />
                </radialGradient>
                <radialGradient id="radar-grad-pink" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#FFAEC9" stop-opacity="0.40" />
                  <stop offset="100%" stop-color="#B23267" stop-opacity="0.18" />
                </radialGradient>
              </defs>

              {/* 3-RING SYSTEM: 0 = Inner-most, 1 = Middle, 2 = Outer Perimeter */}
              <g fill="none">
                {/* Ring 0: Inner-most (Radius 38) */}
                <polygon
                  points="220,182 256,208 242,251 198,251 184,208"
                  stroke="#E2E8F0"
                  stroke-width="1.2"
                  stroke-dasharray="3,3"
                />
                
                {/* Ring 1: Middle (Radius 88) */}
                <polygon
                  points="220,132 304,193 272,291 168,291 136,193"
                  stroke="#CBD5E1"
                  stroke-width="1.2"
                  stroke-dasharray="3,3"
                />
                
                {/* Ring 2: Outer Perimeter (Radius 140) */}
                <polygon
                  points="220,80 353,177 302,333 138,333 87,177"
                  stroke="#94A3B8"
                  stroke-width="1.8"
                />
              </g>

              {/* Radial Spokes connecting Center to 5 Outer Vertices */}
              <g stroke="#CBD5E1" stroke-width="1">
                {radarData.map((d, i) => (
                  <line key={`spoke-${i}`} x1={center} y1={center} x2={d.spokeX} y2={d.spokeY} />
                ))}
              </g>

              {/* USER RESULTS RADAR POLYGON */}
              <polygon
                points={userPolygonPoints}
                fill={tier === 'ic' ? 'url(#radar-grad-blue)' : tier === 'manager' ? 'url(#radar-grad-green)' : 'url(#radar-grad-pink)'}
                stroke={tierColor}
                stroke-width="2.5"
                className="transition-all duration-500 ease-out"
              />

              {/* Interactive Vertices Points */}
              <g>
                {radarData.map((d, i) => {
                  const isFocus = d.status === 'Focus Area';
                  const pointColor = isFocus ? '#B23267' : tierColor;
                  return (
                    <circle
                      key={`pt-${i}`}
                      cx={d.x}
                      cy={d.y}
                      r={isFocus ? 6 : 5.5}
                      fill={pointColor}
                      stroke="#ffffff"
                      stroke-width="2"
                      className="cursor-pointer transition-transform hover:scale-125"
                      onClick={() => handleCategoryClick(d.name)}
                    />
                  );
                })}
              </g>

              {/* Category Axis Labels (Surrounding the perimeter) */}
              <g font-size="11" font-weight="700">
                {radarData.map((d, i) => {
                  let textAnchor = "middle";
                  if (d.angleDeg > -70 && d.angleDeg < 70) textAnchor = "start";
                  else if (d.angleDeg > 110 || d.angleDeg < -110) textAnchor = "end";

                  const isFocus = d.status === 'Focus Area';
                  const labelFill = isFocus ? '#B23267' : '#2A2A2A';

                  return (
                    <text
                      key={`lbl-${i}`}
                      x={d.labelX}
                      y={d.labelY + 4}
                      textAnchor={textAnchor}
                      fill={labelFill}
                      className="cursor-pointer hover:underline"
                      onClick={() => handleCategoryClick(d.name)}
                    >
                      {d.name}
                    </text>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Minimal Bottom Legend */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: tierColor }} />
              <span className="font-semibold text-slate-700">Assessment Result</span>
            </div>
            <span className="text-[11px] text-slate-400">Click points to view details</span>
          </div>

        </div>

        {/* =================================================================== */}
        {/* RIGHT COLUMN: SCROLLABLE RESULTS DRAWER (FOCUS AREAS ON TOP!) */}
        {/* =================================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-6 shadow-sm flex flex-col justify-between overflow-hidden">
          
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 shrink-0">
            <div>
              <h3 className="font-heading text-lg text-[#2A2A2A] leading-snug">
                Key Competencies & Development
              </h3>
              <p className="text-[11px] text-slate-400">
                Derived from balanced ipsative trade-off analysis
              </p>
            </div>
          </div>

          {/* Viewport-Constrained Scrollable Container */}
          <div ref={drawerRef} className="flex-1 min-h-0 overflow-y-auto pr-1.5 space-y-4 custom-scrollbar">

            {/* ------------------------------------------------------------- */}
            {/* SECTION 1: TOP 3 FOCUS AREAS (PLACED FIRST!) */}
            {/* ------------------------------------------------------------- */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#B23267]" />
                  Top 3 Focus Areas
                </h4>
              </div>

              <div className="space-y-2.5">
                {focusAreas.map((areaName, idx) => {
                  const catName = getCategoryForCompetency(areaName, tier) || 'Core Dimension';
                  const defText = allDefinitions[areaName] || "Identified as a prime developmental opportunity.";
                  const microHabitText = allMicroHabits[areaName] || "Practice daily behavioral consistency in this domain.";
                  const cardId = `card-cat-${catName.replace(/[^a-zA-Z0-9]/g, '-')}`;

                  return (
                    <div
                      key={`focus-${idx}`}
                      id={cardId}
                      className="p-3.5 rounded-2xl border border-[#B23267]/30 bg-[#FDE8EF]/25 hover:bg-white hover:border-[#B23267] transition-all shadow-2xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#B23267]">
                          {catName}
                        </span>
                        <span className="text-[10px] font-bold text-[#B23267] bg-[#FDE8EF] px-2 py-0.5 rounded-md border border-[#B23267]/20">
                          Priority #{idx + 1}
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-[#2A2A2A]">{areaName}</h5>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                        {defText}
                      </p>
                      
                      {/* Micro-Habit Recommendation Box */}
                      <div className="mt-2 text-xs bg-white/95 p-2.5 rounded-xl text-slate-700 border border-slate-100 flex items-start gap-2 shadow-2xs">
                        <span className="text-sm leading-none mt-0.5 shrink-0">💡</span>
                        <div>
                          <strong className="text-slate-800">Micro-Habit:</strong> {microHabitText}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* SECTION 2: TOP 3 STRENGTHS (PLACED SECOND) */}
            {/* ------------------------------------------------------------- */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1E5C32]" />
                  Top 3 Strengths
                </h4>
              </div>

              <div className="space-y-2.5">
                {strengths.map((strName, idx) => {
                  const catName = getCategoryForCompetency(strName, tier) || 'Core Dimension';
                  const defText = allDefinitions[strName] || "Demonstrated craft anchor with high consistency.";
                  const cardId = `card-cat-${catName.replace(/[^a-zA-Z0-9]/g, '-')}`;

                  return (
                    <div
                      key={`str-${idx}`}
                      id={cardId}
                      className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-[#1E5C32] transition-all shadow-2xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: tierColor }}>
                          {catName}
                        </span>
                        <span className="text-[10px] font-bold text-[#1E5C32] bg-[#E8F8EC] px-2 py-0.5 rounded-md border border-[#1E5C32]/20">
                          Foundational Skill
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-[#2A2A2A]">{strName}</h5>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                        {defText}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Sticky Bottom Action Buttons */}
          <div className="pt-3 mt-2 border-t border-slate-100 shrink-0 flex items-center gap-3">
            <button
              onClick={onContinueToWheel}
              className="flex-1 btn-primary py-2.5 px-4 text-xs flex items-center justify-center gap-2"
            >
              <span>Explore on Interactive Wheel</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={onRetake}
              className="btn-secondary py-2.5 px-3.5 text-xs"
              title="Retake Assessment"
            >
              <RotateCcw size={13} />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
