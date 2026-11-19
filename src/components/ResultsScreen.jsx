import React, { useState, useRef, useMemo, useEffect } from 'react';
import { ArrowRight, ArrowDown, RotateCcw, X, Sparkles, Compass } from 'lucide-react';
import {
  allDefinitions,
  allMicroHabits,
  getCategoryForCompetency,
  defaultCompetencyFramework,
  canonicalizeCompetency
} from '../lib/wheelTheme.js';

function getPolygonPoints(sides, radius, center = 220) {
  if (!sides || sides < 3) return '';
  return Array.from({ length: sides }, (_, i) => {
    const angleRad = (-90 + (i * (360 / sides))) * (Math.PI / 180);
    const x = center + radius * Math.cos(angleRad);
    const y = center + radius * Math.sin(angleRad);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
}

export function ResultsScreen({ results, user, onContinueToWheel, onRetake, onViewLearningPath }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [highlightedCompetency, setHighlightedCompetency] = useState(null);
  const drawerRef = useRef(null);
  const competencyCardRefs = useRef({});
  const highlightTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    };
  }, []);

  const tier = results?.tier || 'ic';
  const tierName = tier === 'ic'
    ? 'Individual Contributor'
    : tier === 'manager'
      ? 'Manager'
      : 'Director';

  const tierColor = tier === 'ic'
    ? '#0B538C'
    : tier === 'manager'
      ? '#1E5C32'
      : '#B23267';

  const tierBg = tier === 'ic'
    ? '#EBF5FB'
    : tier === 'manager'
      ? '#E8F8EC'
      : '#FDE8EF';

  const tierBorder = tier === 'ic'
    ? 'rgba(11, 83, 140, 0.25)'
    : tier === 'manager'
      ? 'rgba(30, 92, 50, 0.25)'
      : 'rgba(178, 50, 103, 0.25)';

  const strengths = useMemo(() => {
    return results?.strengths || ['High-Quality Delivery', 'Transparent Sharing', 'Roadblock Diagnosis'];
  }, [results]);

  const focusAreas = useMemo(() => {
    return results?.focusAreas || ['Growth Proactivity', 'Active Listening', 'Timeline Reliability'];
  }, [results]);

  const listedCompetencies = useMemo(() => {
    return new Set([
      ...focusAreas.map(canonicalizeCompetency),
      ...strengths.map(canonicalizeCompetency)
    ]);
  }, [focusAreas, strengths]);

  const handleScrollToCompetency = (canonicalName) => {
    const targetEl = competencyCardRefs.current[canonicalName];
    if (!targetEl) return;

    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setHighlightedCompetency(canonicalName);

    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    highlightTimerRef.current = setTimeout(() => {
      setHighlightedCompetency(null);
    }, 1600);
  };

  // Retrieve categories and their children for the current tier (5 Competency categories)
  const tierCategories = useMemo(() => {
    const tierObj = defaultCompetencyFramework.find(t => 
      (tier === 'ic' && t.name === 'Individual Contributor') ||
      (tier === 'manager' && t.name === 'Manager') ||
      (tier === 'director' && t.name === 'Director')
    ) || defaultCompetencyFramework[0];
    return tierObj ? tierObj.categories : [];
  }, [tier]);

  // Center & Radii configuration for the 3-ring system (0 = inner, 1 = middle, 2 = outer)
  const center = 220;
  const rInner = 38;   // Level 0 (Focus Area level)
  const rMiddle = 88;  // Level 1 (Proficient / Baseline level)
  const rOuter = 140;  // Level 2 (Foundational Strength level)

  // Compute category scores & dynamic footprint points
  const radarData = useMemo(() => {
    const userScores = results?.scores || {};
    const sides = tierCategories.length || 5;

    return tierCategories.map((catObj, idx) => {
      const catName = catObj.name;
      const angleDeg = -90 + (idx * (360 / sides));
      const angleRad = angleDeg * (Math.PI / 180);

      const subCompetencies = catObj.children || [];
      
      let catPoints = 0;
      const subDetails = subCompetencies.map(sub => {
        const canonicalSub = canonicalizeCompetency(sub.name);
        let score = userScores[sub.name] ?? userScores[canonicalSub];
        if (score === undefined) {
          if (strengths.some(s => canonicalizeCompetency(s) === canonicalSub)) score = 2;
          else if (focusAreas.some(f => canonicalizeCompetency(f) === canonicalSub)) score = 0;
          else score = 1;
        }
        catPoints += score;
        return {
          name: sub.name,
          canonicalName: canonicalSub,
          score,
          isStrength: strengths.some(s => canonicalizeCompetency(s) === canonicalSub) || score === 2,
          isFocus: focusAreas.some(f => canonicalizeCompetency(f) === canonicalSub) || score === 0,
        };
      });

      let status = 'Balanced Baseline';
      if (catPoints >= 4) {
        status = 'Foundational Strength';
      } else if (catPoints <= 2) {
        status = 'Growth Focus Area';
      }

      let radius = rMiddle;
      if (catPoints <= 3) {
        radius = rInner + (catPoints / 3) * (rMiddle - rInner);
      } else {
        radius = rMiddle + ((catPoints - 3) / 3) * (rOuter - rMiddle);
      }

      const x = center + (radius * Math.cos(angleRad));
      const y = center + (radius * Math.sin(angleRad));

      const spokeX = center + (rOuter * Math.cos(angleRad));
      const spokeY = center + (rOuter * Math.sin(angleRad));

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

  // Auto-select top priority category on initial mount
  useEffect(() => {
    if (radarData.length > 0 && focusAreas.length > 0) {
      const topFocusRaw = focusAreas[0];
      const topFocusCanonical = canonicalizeCompetency(topFocusRaw);
      const topCatName =
        getCategoryForCompetency(topFocusCanonical, tier) ||
        getCategoryForCompetency(topFocusRaw, tier);

      const matchedCategory =
        radarData.find(d => d.name === topCatName) ||
        radarData.find(d =>
          d.subDetails?.some(
            sub => sub.canonicalName === topFocusCanonical || sub.name === topFocusRaw
          )
        ) ||
        radarData[0];

      if (matchedCategory) {
        setSelectedCategory(matchedCategory);
      }
    }
  }, [radarData, focusAreas, tier]);

  // SVG polygon points string for user result shape
  const userPolygonPoints = useMemo(() => {
    return radarData.map(d => `${d.x.toFixed(1)},${d.y.toFixed(1)}`).join(' ');
  }, [radarData]);

  // Concentric 3-ring grid polygons
  const ring0Points = useMemo(() => getPolygonPoints(tierCategories.length, rInner, center), [tierCategories.length]);
  const ring1Points = useMemo(() => getPolygonPoints(tierCategories.length, rMiddle, center), [tierCategories.length]);
  const ring2Points = useMemo(() => getPolygonPoints(tierCategories.length, rOuter, center), [tierCategories.length]);

  const handleCategoryClick = (catName) => {
    const data = radarData.find(d => d.name === catName);
    if (!data) return;

    if (selectedCategory?.name === catName) {
      setSelectedCategory(null);
      return;
    }

    setSelectedCategory(data);

    if (drawerRef.current) {
      drawerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRadarKeyDown = (e, catName) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCategoryClick(catName);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex-1 min-h-0 flex flex-col justify-between overflow-hidden animate-in fade-in duration-300">
      
      {/* Top Header Row (Single Retake Button) */}
      <div className="flex flex-wrap items-center justify-between pb-2 sm:pb-3 mb-2 border-b border-slate-200/80 shrink-0 gap-2">
        <div>
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: tierColor }}
          >
            Assessment Results
          </span>
          <h2 className="text-xl sm:text-2xl font-heading text-[#2A2A2A] leading-tight">
            {user?.displayName
              ? `Competency Diagnostic & Report for ${user.displayName}`
              : 'Leadership Competency Diagnostic & Report'}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRetake}
            className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B23267]"
          >
            <RotateCcw size={12} />
            <span>Retake</span>
          </button>
        </div>
      </div>

      {/* Split 50/50 Viewport Layout (Left: Radar, Right: Scrollable Drawer) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 flex-1 min-h-0 items-stretch overflow-hidden">
        
        {/* =================================================================== */}
        {/* LEFT COLUMN: SIMPLIFIED RADAR CHART                                 */}
        {/* =================================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-6 shadow-sm flex flex-col justify-between overflow-hidden">
          
          {/* Card Top Meta */}
          <div className="flex items-center justify-between mb-1 min-h-[30px] shrink-0 gap-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors"
              style={{ backgroundColor: tierBg, color: tierColor, borderColor: tierBorder }}
            >
              {tierName}
            </span>

            {/* Dynamic Inspector Badge */}
            <span
              className="text-xs font-semibold px-2.5 py-0.5 rounded-full border transition-all"
              style={
                selectedCategory
                  ? { backgroundColor: tierBg, color: tierColor, borderColor: tierBorder }
                  : { backgroundColor: '#F8FAFC', color: '#475569', borderColor: 'rgba(226, 232, 240, 0.8)' }
              }
            >
              {selectedCategory 
                ? `${selectedCategory.name} — ${selectedCategory.status}` 
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

              {/* 3-RING SYSTEM */}
              <g fill="none">
                <polygon
                  points={ring0Points}
                  stroke="#E2E8F0"
                  strokeWidth="1.2"
                  strokeDasharray="3,3"
                />
                <polygon
                  points={ring1Points}
                  stroke="#CBD5E1"
                  strokeWidth="1.2"
                  strokeDasharray="3,3"
                />
                <polygon
                  points={ring2Points}
                  stroke="#94A3B8"
                  strokeWidth="1.8"
                />
              </g>

              {/* Radial Spokes */}
              <g stroke="#CBD5E1" strokeWidth="1">
                {radarData.map((d, i) => (
                  <line
                    key={`spoke-${i}`}
                    x1={center}
                    y1={center}
                    x2={d.spokeX}
                    y2={d.spokeY}
                  />
                ))}
              </g>

              {/* USER RESULTS RADAR POLYGON */}
              <polygon
                points={userPolygonPoints}
                fill={
                  tier === 'ic'
                    ? 'url(#radar-grad-blue)'
                    : tier === 'manager'
                      ? 'url(#radar-grad-green)'
                      : 'url(#radar-grad-pink)'
                }
                stroke={tierColor}
                strokeWidth="2.5"
                className="transition-all duration-500 ease-out"
              />

              {/* Interactive Vertices Points & Accessible Hit Targets */}
              <g>
                {radarData.map((d, i) => {
                  const isFocus = d.status === 'Growth Focus Area';
                  const pointColor = tierColor;
                  const isInspected = selectedCategory?.name === d.name;
                  const isHovered = hoveredCategory === d.name;

                  return (
                    <g key={`pt-group-${i}`}>
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

                      <circle
                        cx={d.x}
                        cy={d.y}
                        r={isInspected ? 8 : (isHovered ? 7 : (isFocus ? 6.5 : 5.5))}
                        fill={pointColor}
                        stroke="#ffffff"
                        strokeWidth={isInspected ? 2.5 : 2}
                        className="pointer-events-none transition-all duration-200"
                      />

                      <circle
                        cx={d.x}
                        cy={d.y}
                        r={22}
                        fill="transparent"
                        role="button"
                        tabIndex={0}
                        aria-label={`Inspect ${d.name}: ${d.status}`}
                        aria-pressed={isInspected}
                        className="cursor-pointer focus:outline-none"
                        onMouseEnter={() => setHoveredCategory(d.name)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        onClick={() => handleCategoryClick(d.name)}
                        onKeyDown={(e) => handleRadarKeyDown(e, d.name)}
                      />
                    </g>
                  );
                })}
              </g>

              {/* Category Axis Labels */}
              <g fontSize="12" fontWeight="700">
                {radarData.map((d, i) => {
                  let textAnchor = "middle";
                  if (d.angleDeg > -70 && d.angleDeg < 70) textAnchor = "start";
                  else if (d.angleDeg > 110 || d.angleDeg < -110) textAnchor = "end";

                  const isInspected = selectedCategory?.name === d.name;
                  const isFocus = d.status === 'Growth Focus Area';
                  const labelFill = (isInspected || isFocus) ? tierColor : '#334155';

                  return (
                    <text
                      key={`lbl-${i}`}
                      x={d.labelX}
                      y={d.labelY + 4}
                      textAnchor={textAnchor}
                      fill={labelFill}
                      fontWeight="700"
                      role="button"
                      tabIndex={0}
                      aria-label={`Inspect ${d.name}`}
                      className="cursor-pointer hover:underline focus:outline-none"
                      onClick={() => handleCategoryClick(d.name)}
                      onKeyDown={(e) => handleRadarKeyDown(e, d.name)}
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
            <span className="text-xs text-slate-600">Click points or labels to inspect</span>
          </div>

        </div>

        {/* =================================================================== */}
        {/* RIGHT COLUMN: SCROLLABLE RESULTS DRAWER                             */}
        {/* =================================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-6 shadow-sm flex flex-col justify-between overflow-hidden">
          
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 shrink-0">
            <div>
              <h3 className="font-heading text-lg text-[#2A2A2A] leading-snug">
                Key Competencies & Development
              </h3>
              <p className="text-xs text-slate-600">
                Derived from balanced ipsative trade-off analysis
              </p>
            </div>
          </div>

          {/* Viewport-Constrained Scrollable Container */}
          <div ref={drawerRef} className="flex-1 min-h-0 overflow-y-auto pr-1.5 space-y-4 custom-scrollbar">

            {/* ------------------------------------------------------------- */}
            {/* CATEGORY SPOTLIGHT CARD (AUTO-SELECTED TO #1 FOCUS ON MOUNT)  */}
            {/* ------------------------------------------------------------- */}
            {selectedCategory && (
              <div
                className="p-3.5 rounded-2xl border-2 animate-in fade-in slide-in-from-top-2 duration-200 shadow-sm"
                style={{ backgroundColor: `${tierBg}85`, borderColor: tierBorder }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} style={{ color: tierColor }} />
                    <span
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: tierColor }}
                    >
                      Category Inspection: {selectedCategory.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(null)}
                    className="p-1 rounded-md text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B23267]"
                    title="Clear Inspection"
                    aria-label="Clear category inspection"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-md border bg-white"
                    style={{ color: tierColor, borderColor: tierBorder }}
                  >
                    {selectedCategory.status}
                  </span>
                  <span className="text-xs text-slate-600">
                    {selectedCategory.status === 'Foundational Strength'
                      ? 'Consistently chosen across multiple trade-off scenarios.'
                      : selectedCategory.status === 'Growth Focus Area'
                        ? 'Frequently passed over when forced to make priority trade-offs.'
                        : 'Balanced proficiency across everyday operational trade-offs.'}
                  </span>
                </div>

                {/* Sub-competencies in this category (clickable when listed below) */}
                <div
                  className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 pt-2 border-t"
                  style={{ borderColor: tierBorder }}
                >
                  {selectedCategory.subDetails.map((sub, sIdx) => {
                    const displayName = sub.canonicalName || sub.name;
                    const isListed = listedCompetencies.has(displayName);

                    if (isListed) {
                      return (
                        <button
                          key={`sub-${sIdx}`}
                          type="button"
                          onClick={() => handleScrollToCompetency(displayName)}
                          title={`Jump to ${displayName} below`}
                          aria-label={`Scroll to ${displayName} details`}
                          className="bg-white p-2 rounded-xl border text-xs text-left cursor-pointer hover:shadow-sm hover:-translate-y-0.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B23267] group"
                          style={{ borderColor: tierBorder }}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-semibold text-slate-800 leading-tight truncate group-hover:underline">
                              {displayName}
                            </span>
                            <ArrowDown
                              size={11}
                              className="shrink-0 opacity-60 group-hover:opacity-100 transition-opacity"
                              style={{ color: tierColor }}
                            />
                          </div>
                          <div className="text-xs mt-1">
                            {sub.isStrength ? (
                              <span className="font-bold" style={{ color: tierColor }}>★ Strength</span>
                            ) : (
                              <span className="font-bold" style={{ color: tierColor }}>▲ Focus Area</span>
                            )}
                          </div>
                        </button>
                      );
                    }

                    return (
                      <div
                        key={`sub-${sIdx}`}
                        className="bg-white/80 p-2 rounded-xl border text-xs"
                        style={{ borderColor: tierBorder }}
                        title={`${displayName} — Balanced proficiency`}
                      >
                        <div className="font-semibold text-slate-700 leading-tight truncate">
                          {displayName}
                        </div>
                        <div className="text-xs mt-1">
                          <span className="text-slate-500 font-medium">● Proficient</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* SECTION 1: TOP 3 FOCUS AREAS                                  */}
            {/* ------------------------------------------------------------- */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tierColor }} />
                  Top 3 Focus Areas
                </h4>
              </div>

              <div className="space-y-2.5">
                {focusAreas.map((areaName, idx) => {
                  const canonicalName = canonicalizeCompetency(areaName);
                  const catName = getCategoryForCompetency(canonicalName, tier) || getCategoryForCompetency(areaName, tier) || 'Core Dimension';
                  const defText = allDefinitions[canonicalName] || allDefinitions[areaName] || "Identified as a prime developmental opportunity.";
                  const microHabitText = allMicroHabits[canonicalName] || allMicroHabits[areaName] || "Practice daily behavioral consistency in this domain.";
                  const isHighlighted = highlightedCompetency === canonicalName;

                  return (
                    <div
                      key={`focus-${idx}`}
                      ref={(el) => { competencyCardRefs.current[canonicalName] = el; }}
                      data-category={catName}
                      className="p-3.5 rounded-2xl border transition-all duration-300 shadow-2xs"
                      style={{
                        backgroundColor: `${tierBg}75`,
                        borderColor: isHighlighted ? tierColor : tierBorder,
                        boxShadow: isHighlighted ? `0 0 0 2px ${tierColor}, 0 8px 20px rgba(0,0,0,0.08)` : undefined
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="text-xs font-bold uppercase tracking-wider"
                          style={{ color: tierColor }}
                        >
                          {catName}
                        </span>
                        <span
                          className="text-xs font-bold bg-white px-2 py-0.5 rounded-md border"
                          style={{ color: tierColor, borderColor: tierBorder }}
                        >
                          Priority #{idx + 1}
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-[#2A2A2A]">{canonicalName}</h5>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                        {defText}
                      </p>
                      
                      {/* Micro-Habit Recommendation Box */}
                      <div
                        className="mt-2 text-xs bg-white/95 p-2.5 rounded-xl text-slate-700 border flex items-start gap-2 shadow-2xs"
                        style={{ borderColor: tierBorder }}
                      >
                        <span className="text-sm leading-none mt-0.5 shrink-0" aria-hidden="true">💡</span>
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
            {/* SECTION 2: TOP 3 STRENGTHS                                    */}
            {/* ------------------------------------------------------------- */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tierColor }} />
                  Top 3 Strengths
                </h4>
              </div>

              <div className="space-y-2.5">
                {strengths.map((strName, idx) => {
                  const canonicalName = canonicalizeCompetency(strName);
                  const catName = getCategoryForCompetency(canonicalName, tier) || getCategoryForCompetency(strName, tier) || 'Core Dimension';
                  const defText = allDefinitions[canonicalName] || allDefinitions[strName] || "Demonstrated craft anchor with high consistency.";
                  const isHighlighted = highlightedCompetency === canonicalName;

                  return (
                    <div
                      key={`str-${idx}`}
                      ref={(el) => { competencyCardRefs.current[canonicalName] = el; }}
                      data-category={catName}
                      className="p-3.5 rounded-2xl border transition-all duration-300 shadow-2xs"
                      style={{
                        backgroundColor: `${tierBg}35`,
                        borderColor: isHighlighted ? tierColor : tierBorder,
                        boxShadow: isHighlighted ? `0 0 0 2px ${tierColor}, 0 8px 20px rgba(0,0,0,0.08)` : undefined
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: tierColor }}>
                          {catName}
                        </span>
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-md border bg-white"
                          style={{ color: tierColor, borderColor: tierBorder }}
                        >
                          Foundational Skill
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-[#2A2A2A]">{canonicalName}</h5>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                        {defText}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Sticky Bottom Action Buttons (Primary: Explore Focus Areas, Secondary: See Learning Plan) */}
          <div className="pt-3 mt-2 border-t border-slate-100 shrink-0 flex items-center justify-between gap-2.5">
            {onViewLearningPath && (
              <button
                type="button"
                onClick={onViewLearningPath}
                className="btn-secondary py-2.5 px-4 text-xs font-semibold text-slate-700 hover:text-[#B23267] flex items-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B23267]"
              >
                <span>See Learning Plan</span>
                <ArrowRight size={13} />
              </button>
            )}

            <button
              type="button"
              onClick={onContinueToWheel}
              className="flex-1 btn-primary py-2.5 px-4 text-xs flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#B23267]"
            >
              <Compass size={14} />
              <span>Explore Focus Areas</span>
              <ArrowRight size={13} />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
