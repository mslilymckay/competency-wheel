import React, { useState, useRef, useMemo } from 'react';
import { ArrowRight, RotateCcw, X, Sparkles } from 'lucide-react';
import { allDefinitions, allMicroHabits, defaultCompetencyFramework } from '../lib/wheelTheme.js';

export function ResultsScreen({ results, onContinueToWheel, onRetake }) {
  const [inspectedCategory, setInspectedCategory] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
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

  // Retrieve the 5 categories and their children for the current tier
  const tierCategories = useMemo(() => {
    const tierObj = defaultCompetencyFramework.find(t => 
      (tier === 'ic' && t.name === 'Individual Contributor') ||
      (tier === 'manager' && t.name === 'Manager') ||
      (tier === 'director' && t.name === 'Director')
    );
    return tierObj ? tierObj.categories : [];
  }, [tier]);

  // Center & Radii configuration for the 3-ring system (0 = inner, 1 = middle, 2 = outer)
  const center = 220;
  const rInner = 38;   // Level 0 (Focus Area level)
  const rMiddle = 88;  // Level 1 (Proficient / Baseline level)
  const rOuter = 140;  // Level 2 (Foundational Strength level)

  // Compute category scores & dynamic footprint points
  // Aggregating each category's 3 sub-competencies (0-2 each, total 0-6 points)
  const radarData = useMemo(() => {
    const userScores = results?.scores || {};

    return tierCategories.map((catObj, idx) => {
      const catName = catObj.name;
      const angleDeg = -90 + (idx * 72);
      const angleRad = angleDeg * (Math.PI / 180);

      // Sub-competencies for this category
      const subCompetencies = catObj.children || [];
      
      // Calculate total points earned in this category from assessment choices (0 to 6)
      let catPoints = 0;
      const subDetails = subCompetencies.map(sub => {
        let score = userScores[sub.name];
        if (score === undefined) {
          if (strengths.includes(sub.name)) score = 2;
          else if (focusAreas.includes(sub.name)) score = 0;
          else score = 1;
        }
        catPoints += score;
        return {
          name: sub.name,
          score,
          isStrength: strengths.includes(sub.name) || score === 2,
          isFocus: focusAreas.includes(sub.name) || score === 0,
        };
      });

      // Determine Category Status based on aggregated score (out of 6)
      let status = 'Balanced Baseline';
      if (catPoints >= 4) {
        status = 'Foundational Strength';
      } else if (catPoints <= 2) {
        status = 'Growth Focus Area';
      }

      // Continuous radius interpolation along the spoke:
      // Score 0 -> rInner (38), Score 3 -> rMiddle (88), Score 6 -> rOuter (140)
      let radius = rMiddle;
      if (catPoints <= 3) {
        radius = rInner + (catPoints / 3) * (rMiddle - rInner);
      } else {
        radius = rMiddle + ((catPoints - 3) / 3) * (rOuter - rMiddle);
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
        status,
        catPoints,
        subDetails
      };
    });
  }, [tierCategories, strengths, focusAreas, results]);

  // SVG polygon points string for user result shape
  const userPolygonPoints = useMemo(() => {
    return radarData.map(d => `${d.x.toFixed(1)},${d.y.toFixed(1)}`).join(' ');
  }, [radarData]);

  // Click handler for category points & labels: updates spotlight and scrolls to matching card
  const handleCategoryClick = (catName) => {
    const data = radarData.find(d => d.name === catName);
    if (!data) return;

    if (inspectedCategory?.name === catName) {
      setInspectedCategory(null);
      return;
    }

    setInspectedCategory(data);

    // Attempt to scroll to matching cards in the right drawer
    if (drawerRef.current) {
      const matchingCards = drawerRef.current.querySelectorAll(`[data-category="${catName}"]`);
      if (matchingCards && matchingCards.length > 0) {
        matchingCards[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        matchingCards.forEach(card => {
          card.classList.remove('ring-2', 'ring-offset-2', 'ring-[#0B538C]', 'ring-[#B23267]');
          void card.offsetWidth; // Force reflow
          const ringColor = data.status === 'Growth Focus Area' ? 'ring-[#B23267]' : 'ring-[#0B538C]';
          card.classList.add('ring-2', 'ring-offset-2', ringColor);
          setTimeout(() => {
            card.classList.remove('ring-2', 'ring-offset-2', ringColor);
          }, 2200);
        });
      } else {
        // Scroll to top of drawer so user sees the Category Spotlight card
        drawerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
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

            {/* Dynamic Inspector Badge */}
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border transition-all ${
                inspectedCategory 
                  ? (inspectedCategory.status === 'Foundational Strength' 
                      ? 'text-[#1E5C32] bg-[#E8F8EC] border-[#1E5C32]/20' 
                      : inspectedCategory.status === 'Growth Focus Area'
                        ? 'text-[#B23267] bg-[#FDE8EF] border-[#B23267]/20'
                        : 'text-slate-700 bg-slate-100 border-slate-200')
                  : 'text-slate-500 bg-slate-50 border-slate-200/60'
              }`}
            >
              {inspectedCategory 
                ? `${inspectedCategory.name} — ${inspectedCategory.status}` 
                : (hoveredCategory ? `${hoveredCategory} (Click to inspect)` : 'Click points to inspect details')}
            </span>
          </div>

          {/* SVG Radar Graphic */}
          <div className="relative flex-1 min-h-0 flex items-center justify-center py-2 select-none">
            <svg viewBox="0 0 440 440" className="w-full h-full max-h-[380px] overflow-visible">
              <defs>
                <radialGradient id="radar-grad-blue" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00CCFF" stopOpacity="0.38" />
                  <stop offset="100%" stopColor="#0B538C" stopOpacity="0.16" />
                </radialGradient>
                <radialGradient id="radar-grad-green" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#82D18D" stopOpacity="0.38" />
                  <stop offset="100%" stopColor="#1E5C32" stopOpacity="0.16" />
                </radialGradient>
                <radialGradient id="radar-grad-pink" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFAEC9" stopOpacity="0.40" />
                  <stop offset="100%" stopColor="#B23267" stopOpacity="0.18" />
                </radialGradient>
              </defs>

              {/* 3-RING SYSTEM: 0 = Inner-most, 1 = Middle, 2 = Outer Perimeter */}
              <g fill="none">
                {/* Ring 0: Inner-most (Radius 38 - Focus Area zone) */}
                <polygon
                  points="220,182 256,208 242,251 198,251 184,208"
                  stroke="#E2E8F0"
                  strokeWidth="1.2"
                  strokeDasharray="3,3"
                />
                
                {/* Ring 1: Middle (Radius 88 - Proficient baseline) */}
                <polygon
                  points="220,132 304,193 272,291 168,291 136,193"
                  stroke="#CBD5E1"
                  strokeWidth="1.2"
                  strokeDasharray="3,3"
                />
                
                {/* Ring 2: Outer Perimeter (Radius 140 - Foundational Strength) */}
                <polygon
                  points="220,80 353,177 302,333 138,333 87,177"
                  stroke="#94A3B8"
                  strokeWidth="1.8"
                />
              </g>

              {/* Radial Spokes connecting Center to 5 Outer Vertices */}
              <g stroke="#CBD5E1" strokeWidth="1">
                {radarData.map((d, i) => {
                  const isHighlighted = inspectedCategory?.name === d.name || hoveredCategory === d.name;
                  return (
                    <line
                      key={`spoke-${i}`}
                      x1={center}
                      y1={center}
                      x2={d.spokeX}
                      y2={d.spokeY}
                      stroke={isHighlighted ? tierColor : "#CBD5E1"}
                      strokeWidth={isHighlighted ? "1.8" : "1"}
                      className="transition-colors duration-200"
                    />
                  );
                })}
              </g>

              {/* USER RESULTS RADAR POLYGON */}
              <polygon
                points={userPolygonPoints}
                fill={tier === 'ic' ? 'url(#radar-grad-blue)' : tier === 'manager' ? 'url(#radar-grad-green)' : 'url(#radar-grad-pink)'}
                stroke={tierColor}
                strokeWidth="2.5"
                className="transition-all duration-500 ease-out"
              />

              {/* Interactive Vertices Points & Hit Targets (No flickering!) */}
              <g>
                {radarData.map((d, i) => {
                  const isFocus = d.status === 'Growth Focus Area';
                  const isStrength = d.status === 'Foundational Strength';
                  const pointColor = isFocus ? '#B23267' : (isStrength ? '#1E5C32' : tierColor);
                  const isInspected = inspectedCategory?.name === d.name;
                  const isHovered = hoveredCategory === d.name;

                  return (
                    <g key={`pt-group-${i}`}>
                      {/* Active / Hover Pulse Halo */}
                      {(isInspected || isHovered) && (
                        <circle
                          cx={d.x}
                          cy={d.y}
                          r={isInspected ? 13 : 10}
                          fill={pointColor}
                          fillOpacity={isInspected ? 0.35 : 0.2}
                          stroke={pointColor}
                          strokeWidth={isInspected ? 2 : 1.5}
                          className="pointer-events-none transition-all duration-300"
                        />
                      )}

                      {/* Visible Center Circle */}
                      <circle
                        cx={d.x}
                        cy={d.y}
                        r={isInspected ? 8 : (isHovered ? 7 : (isFocus ? 6 : 5.5))}
                        fill={pointColor}
                        stroke="#ffffff"
                        strokeWidth={isInspected ? 2.5 : 2}
                        className="pointer-events-none transition-all duration-200"
                      />

                      {/* Large Invisible Hit Area (Prevents tiny-target miss and hover flicker) */}
                      <circle
                        cx={d.x}
                        cy={d.y}
                        r={22}
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredCategory(d.name)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        onClick={() => handleCategoryClick(d.name)}
                      />
                    </g>
                  );
                })}
              </g>

              {/* Category Axis Labels (Surrounding the perimeter) */}
              <g fontSize="11" fontWeight="700">
                {radarData.map((d, i) => {
                  let textAnchor = "middle";
                  if (d.angleDeg > -70 && d.angleDeg < 70) textAnchor = "start";
                  else if (d.angleDeg > 110 || d.angleDeg < -110) textAnchor = "end";

                  const isInspected = inspectedCategory?.name === d.name;
                  const isHovered = hoveredCategory === d.name;
                  const isFocus = d.status === 'Growth Focus Area';
                  const isStrength = d.status === 'Foundational Strength';
                  
                  let labelFill = '#2A2A2A';
                  if (isInspected || isHovered) labelFill = tierColor;
                  else if (isFocus) labelFill = '#B23267';
                  else if (isStrength) labelFill = '#1E5C32';

                  return (
                    <text
                      key={`lbl-${i}`}
                      x={d.labelX}
                      y={d.labelY + 4}
                      textAnchor={textAnchor}
                      fill={labelFill}
                      fontWeight={isInspected ? "800" : "700"}
                      className="cursor-pointer hover:underline transition-colors"
                      onMouseEnter={() => setHoveredCategory(d.name)}
                      onMouseLeave={() => setHoveredCategory(null)}
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
            <span className="text-[11px] text-slate-400">Click points or labels to inspect</span>
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
            {/* CATEGORY SPOTLIGHT CARD (APPEARS WHEN A POINT/LABEL IS CLICKED) */}
            {/* ------------------------------------------------------------- */}
            {inspectedCategory && (
              <div className="p-3.5 rounded-2xl border-2 border-slate-300 bg-slate-50/80 animate-in fade-in slide-in-from-top-2 duration-200 shadow-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} style={{ color: tierColor }} />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Category Inspection: {inspectedCategory.name}
                    </span>
                  </div>
                  <button
                    onClick={() => setInspectedCategory(null)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
                    title="Clear Inspection"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      inspectedCategory.status === 'Foundational Strength'
                        ? 'bg-[#E8F8EC] text-[#1E5C32]'
                        : inspectedCategory.status === 'Growth Focus Area'
                          ? 'bg-[#FDE8EF] text-[#B23267]'
                          : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    {inspectedCategory.status}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {inspectedCategory.status === 'Foundational Strength'
                      ? 'Consistently chosen across multiple trade-off scenarios.'
                      : inspectedCategory.status === 'Growth Focus Area'
                        ? 'Frequently passed over when forced to make priority trade-offs.'
                        : 'Balanced proficiency across everyday operational trade-offs.'}
                  </span>
                </div>

                {/* Sub-competencies in this category */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-200">
                  {inspectedCategory.subDetails.map((sub, sIdx) => (
                    <div key={`sub-${sIdx}`} className="bg-white p-2 rounded-xl border border-slate-200/70 text-xs">
                      <div className="font-semibold text-slate-800 leading-tight truncate" title={sub.name}>
                        {sub.name}
                      </div>
                      <div className="text-[10px] mt-1">
                        {sub.isStrength ? (
                          <span className="text-[#1E5C32] font-bold">★ Strength</span>
                        ) : sub.isFocus ? (
                          <span className="text-[#B23267] font-bold">▲ Focus Area</span>
                        ) : (
                          <span className="text-slate-500 font-medium">● Proficient</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

                  return (
                    <div
                      key={`focus-${idx}`}
                      data-category={catName}
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

                  return (
                    <div
                      key={`str-${idx}`}
                      data-category={catName}
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