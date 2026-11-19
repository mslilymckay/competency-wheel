import React, { useState, useMemo, useRef, useEffect } from 'react';
import { describeArc, describeCurvedTextArc, polarToCartesian } from '../lib/wheelMath.js';
import { defaultCompetencyFramework } from '../lib/wheelTheme.js';

function wrapSliceLabel(name, maxChars = 14) {
  if (!name) return [''];
  if (name.length <= maxChars) return [name];
  const words = name.split(/\s+/);
  if (words.length <= 1) return [name];

  const lines = [];
  let current = '';
  for (const w of words) {
    if (!current) {
      current = w;
    } else if ((current + ' ' + w).length <= maxChars) {
      current += ' ' + w;
    } else {
      lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines;
}

const QUICK_JUMP_OPTIONS = [
  { id: 'all', label: 'All Tiers', activeColor: '#2A2A2A' },
  { id: 'ic', label: 'Individual Contributor', activeColor: '#0B538C' },
  { id: 'manager', label: 'Manager', activeColor: '#1E5C32' },
  { id: 'director', label: 'Director', activeColor: '#B23267' }
];

function getTierMidAngle(tierId) {
  const sectorAngle = 360 / defaultCompetencyFramework.length;
  const tierIndex = tierId === 'manager' ? 1 : tierId === 'director' ? 2 : 0;
  return (tierIndex * sectorAngle) + (sectorAngle / 2);
}

function normalizeInitialRotation(targetDeg) {
  let r = ((targetDeg % 360) + 360) % 360;
  if (r > 180) r -= 360;
  return r;
}

export function Wheel({
  competencyPaths,
  setCompetencyPaths,
  isMultiSelect,
  selectedTier
}) {
  const initialTier = selectedTier || 'ic';
  const [isFullView, setIsFullView] = useState(() => !selectedTier);
  const [activeJumpTier, setActiveJumpTier] = useState(() => selectedTier || 'all');
  const [rotation, setRotation] = useState(() =>
    selectedTier ? normalizeInitialRotation(90 - getTierMidAngle(initialTier)) : 0
  );
  const [isManual, setIsManual] = useState(false);

  const viewBoxSize = 1000;
  const center = viewBoxSize / 2;
  const centerRadius = 82;

  // RADIUS CONFIGURATION
  const rRing1_Full = 295;
  const rRing2_Full = 465;

  const rRing1_Focus = 215;
  const rRing2_Focus = 340;
  const rRing3_Focus = 465;

  const baseSlices = useMemo(() => {
    const result = [];
    const sectorAngle = 360 / defaultCompetencyFramework.length;

    defaultCompetencyFramework.forEach((lvl, lvlIdx) => {
      const lvlStart = lvlIdx * sectorAngle;
      const lvlEnd = lvlStart + sectorAngle;
      const lvlPath = [lvl.name];

      // RING 1: Core Leadership Level
      result.push({
        id: lvlPath.join('---'),
        name: lvl.name,
        level: 0,
        path: lvlPath,
        startAngle: lvlStart,
        endAngle: lvlEnd,
        innerRadius: centerRadius,
        outerRadius: isFullView ? rRing1_Full : rRing1_Focus,
        color: lvl.palette.ring1
      });

      const catSpan = sectorAngle / lvl.categories.length;
      lvl.categories.forEach((cat, catIdx) => {
        const catStart = lvlStart + (catIdx * catSpan);
        const catEnd = catStart + catSpan;
        const catPath = [...lvlPath, cat.name];

        // RING 2: Competency Category
        result.push({
          id: catPath.join('---'),
          name: cat.name,
          level: 1,
          path: catPath,
          startAngle: catStart,
          endAngle: catEnd,
          innerRadius: isFullView ? rRing1_Full : rRing1_Focus,
          outerRadius: isFullView ? rRing2_Full : rRing2_Focus,
          color: lvl.palette.ring2
        });

        // RING 3: Sub-competencies (ONLY IN FOCUSED VIEW)
        if (!isFullView) {
          const subSpan = catSpan / cat.children.length;
          cat.children.forEach((sub, subIdx) => {
            const subStart = catStart + (subIdx * subSpan);
            const subEnd = subStart + subSpan;
            const subPath = [...catPath, sub.name];

            result.push({
              id: subPath.join('---'),
              name: sub.name,
              level: 2,
              path: subPath,
              startAngle: subStart,
              endAngle: subEnd,
              innerRadius: rRing2_Focus,
              outerRadius: rRing3_Focus,
              color: lvl.palette.ring3
            });
          });
        }
      });
    });

    return result;
  }, [isFullView]);

  const rotateToTargetRotation = (targetRotation) => {
    setIsManual(false);
    setRotation(prev => {
      const currentMod = ((prev % 360) + 360) % 360;
      const targetMod = ((targetRotation % 360) + 360) % 360;
      let delta = targetMod - currentMod;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      return prev + delta;
    });
  };

  const rotateToAngle = (midAngle) => {
    rotateToTargetRotation(90 - midAngle);
  };

  // Re-center on selectedTier midpoint only when selectedTier prop actually changes
  const prevTierRef = useRef(selectedTier);
  useEffect(() => {
    if (selectedTier && prevTierRef.current !== selectedTier) {
      prevTierRef.current = selectedTier;
      setIsFullView(false);
      setActiveJumpTier(selectedTier);
      rotateToAngle(getTierMidAngle(selectedTier));
    }
  }, [selectedTier]);

  // Quick-Jump Tier Bar Handler
  const handleQuickJump = (targetId) => {
    setActiveJumpTier(targetId);

    if (targetId === 'all') {
      setIsFullView(true);
      rotateToTargetRotation(0);
      return;
    }

    setIsFullView(false);
    rotateToAngle(getTierMidAngle(targetId));
  };

  const dragRef = useRef({ isDown: false, hasMoved: false, lastAtan: 0 });
  const velocityRef = useRef(0);
  const lastAngleRef = useRef(0);
  const lastTimeRef = useRef(0);
  const rafRef = useRef(null);
  const clickStartRef = useRef({ x: 0, y: 0 });
  const lastClickTimeRef = useRef(0);
  const pendingSliceRef = useRef(null);
  const svgRef = useRef(null);

  const handleSliceClick = (slice) => {
    const sliceKey = slice.path.join('---');
    const existingIdx = competencyPaths.findIndex(p => p.join('---') === sliceKey);
    let updated = [...competencyPaths];

    if (isMultiSelect) {
      if (existingIdx !== -1) {
        updated = updated.filter((_, i) => i !== existingIdx);
      } else {
        const filtered = updated.filter(p => !p.join('---').startsWith(sliceKey) && !sliceKey.startsWith(p.join('---')));
        updated = [...filtered, slice.path];
      }
    } else {
      updated = existingIdx !== -1 ? [] : [slice.path];
    }

    setCompetencyPaths(updated);

    // Update quick-jump pill highlight to reflect the clicked slice's tier
    let sliceTier = 'ic';
    if (slice.path && slice.path.length > 0) {
      const root = slice.path[0];
      sliceTier = root === 'Manager' ? 'manager' : (root === 'Director' ? 'director' : 'ic');
      setActiveJumpTier(sliceTier);
    }

    // If clicking a slice from All Tiers, smoothly zoom and center on that slice's tier
    if (updated.length > 0 && isFullView) {
      setIsFullView(false);
      rotateToAngle(getTierMidAngle(sliceTier));
    }
  };

  const selectSlice = (slice) => {
    if (!slice) return;
    const now = performance.now();
    if (now - lastClickTimeRef.current < 200) return;
    lastClickTimeRef.current = now;
    handleSliceClick(slice);
  };

  const handlePointerDown = (e) => {
    clickStartRef.current = { x: e.clientX, y: e.clientY };
    if (e.button !== 0 && e.type !== 'touchstart' && e.pointerType !== 'touch') return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    velocityRef.current = 0;

    const rect = svgRef.current.getBoundingClientRect();
    const centerX = rect.left + (rect.width / 2);
    const centerY = rect.top + (rect.height / 2);
    const atan = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;

    dragRef.current = { isDown: true, hasMoved: false, lastAtan: atan };
    lastAngleRef.current = atan;
    lastTimeRef.current = performance.now();
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current.isDown) return;
    const dist = Math.hypot(e.clientX - clickStartRef.current.x, e.clientY - clickStartRef.current.y);
    if (dist > 6 && !dragRef.current.hasMoved) {
      dragRef.current.hasMoved = true;
      setIsManual(true);
      if (svgRef.current && svgRef.current.setPointerCapture && e.pointerId) {
        try { svgRef.current.setPointerCapture(e.pointerId); } catch(err) {}
      }
    }

    if (!dragRef.current.hasMoved) return;
    const rect = svgRef.current.getBoundingClientRect();
    const centerX = rect.left + (rect.width / 2);
    const centerY = rect.top + (rect.height / 2);
    let currentAtan = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
    let stepDelta = currentAtan - dragRef.current.lastAtan;

    if (stepDelta > 180) stepDelta -= 360;
    if (stepDelta < -180) stepDelta += 360;

    dragRef.current.lastAtan = currentAtan;
    const now = performance.now();
    const dt = Math.max(now - lastTimeRef.current, 1);
    const instantVel = stepDelta / dt;
    velocityRef.current = velocityRef.current * 0.3 + instantVel * 0.7;
    lastAngleRef.current = currentAtan;
    lastTimeRef.current = now;

    setRotation(prev => prev + stepDelta);
  };

  const handlePointerUp = (e) => {
    if (!dragRef.current.isDown) return;
    const hadMoved = dragRef.current.hasMoved;
    dragRef.current.isDown = false;

    if (e && svgRef.current && svgRef.current.releasePointerCapture && e.pointerId) {
      try { svgRef.current.releasePointerCapture(e.pointerId); } catch(err) {}
    }

    const dtSinceMove = performance.now() - lastTimeRef.current;
    if (dtSinceMove > 90) velocityRef.current = 0;

    if (hadMoved && Math.abs(velocityRef.current) > 0.04) {
      let currentVel = velocityRef.current * 16;
      const momentumLoop = () => {
        if (Math.abs(currentVel) < 0.04) return;
        setRotation(prev => prev + currentVel);
        currentVel *= 0.95;
        rafRef.current = requestAnimationFrame(momentumLoop);
      };
      rafRef.current = requestAnimationFrame(momentumLoop);
    } else if (!hadMoved && pendingSliceRef.current) {
      selectSlice(pendingSliceRef.current);
    }
    pendingSliceRef.current = null;
  };

  const currentSelected = competencyPaths;

  const isSliceSelected = (slice) => {
    const sliceKey = slice.path.join('---');
    return currentSelected.some(
      p => p.join('---') === sliceKey || p.join('---').startsWith(sliceKey + '---')
    );
  };

  // Render unselected slices first, then selected slices on top so their 3.5px white stroke & shadow are never clipped
  const orderedSlices = useMemo(() => {
    return [...baseSlices].sort((a, b) => Number(isSliceSelected(a)) - Number(isSliceSelected(b)));
  }, [baseSlices, currentSelected]);

  return (
    <div 
      className="relative w-full h-full flex-1 min-h-0 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-center overflow-hidden p-0"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ touchAction: 'none' }}
    >
      
      {/* TOP QUICK-JUMP TIER BAR (PHASE 5.2: Replaces duplicate mode and view toggles) */}
      <div
        className="absolute top-3 left-3 right-3 z-20 flex justify-center pointer-events-none"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div
          role="toolbar"
          aria-label="Quick-jump tier navigation"
          className="pointer-events-auto inline-flex flex-wrap items-center justify-center gap-1 rounded-2xl p-1 bg-white/95 border border-slate-200 shadow-md backdrop-blur-md"
        >
          {QUICK_JUMP_OPTIONS.map((opt) => {
            const isActive =
              (opt.id === 'all' && isFullView) ||
              (opt.id !== 'all' && !isFullView && activeJumpTier === opt.id);

            return (
              <button
                key={opt.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => handleQuickJump(opt.id)}
                style={isActive ? { backgroundColor: opt.activeColor } : undefined}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B23267] ${
                  isActive
                    ? 'text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* OVERLAY: Mid-Right Rotary Dial Affordance */}
      <div 
        className="absolute right-6 sm:right-10 lg:right-12 top-1/2 -translate-y-1/2 z-20 pointer-events-none select-none flex items-center justify-center animate-in fade-in duration-300"
        title="Rotary dial - click & drag to rotate"
        aria-hidden="true"
      >
        <svg
          width="24"
          height="60"
          viewBox="0 0 24 60"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-slate-600/80 transition-colors"
        >
          <path d="M 18.6 8.3 L 11 5 L 11.1 13.3" />
          <path d="M 11 5 A 45 45 0 0 1 11 55" />
          <path d="M 18.6 51.7 L 11 55 L 11.1 46.7" />
        </svg>
      </div>

      {/* THE SVG WHEEL */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        className={`drop-shadow-xl transition-all duration-700 ease-in-out select-none ${
          isFullView 
            ? 'relative mx-auto w-full h-full max-h-[88%] mt-8 p-2' 
            : 'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[48%] h-[125%] sm:h-[135%] w-auto max-w-none'
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: 'none' }}
      >
        <defs>
          {/* High-contrast drop shadow for selected wheel slices */}
          <filter id="selected-slice-shadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.5" />
          </filter>

          {/* Subtle diagonal shading pattern for selected slices */}
          <pattern id="selected-slice-hatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="10" stroke="#0f172a" strokeWidth="2.5" strokeOpacity="0.16" />
          </pattern>

          {baseSlices.filter(s => s.level === 0).map(slice => {
            const textRadius = slice.innerRadius + (slice.outerRadius - slice.innerRadius) / 2;
            return (
              <path
                key={`text-path-${slice.id}`}
                id={`text-path-${slice.id}`}
                d={describeCurvedTextArc(center, center, textRadius, slice.startAngle, slice.endAngle)}
                fill="none"
              />
            );
          })}
        </defs>

        <g style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: `${center}px ${center}px`,
          transition: isManual ? 'none' : 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}>
          {orderedSlices.map(slice => {
            const isSelected = isSliceSelected(slice);

            // Preserve native ring palette color; never fill selected slices with blank white
            const fill = slice.color;
            const isLightBg = fill === '#00CCFF' || fill === '#FFAEC9' || fill === '#82D18D' || fill === '#FFCC00';
            const textFill = isLightBg ? "#2A2A2A" : "#ffffff";
            const strokeColor = "#ffffff";
            const strokeWidth = isSelected ? "3.5" : "1.5";
            const arcD = describeArc(center, center, slice.innerRadius, slice.outerRadius, slice.startAngle, slice.endAngle);

            const midAngle = slice.startAngle + (slice.endAngle - slice.startAngle) / 2;
            const textPos = polarToCartesian(
              center, center, 
              slice.innerRadius + (slice.outerRadius - slice.innerRadius) / 2, 
              midAngle
            );
            const textRotation = midAngle - 90;

            const shouldShowLabel = slice.level === 0 || !isFullView || isSelected;

            return (
              <g
                key={slice.id}
                role="button"
                tabIndex={0}
                aria-label={`${slice.path.join(' - ')}`}
                aria-pressed={isSelected}
                className="cursor-pointer focus:outline-none"
                onPointerDown={() => { pendingSliceRef.current = slice; }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (dragRef.current && dragRef.current.hasMoved) return;
                  selectSlice(slice);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    selectSlice(slice);
                  }
                }}
              >
                {/* Selected outer contrast ring + pure white 3.5px stroke */}
                {isSelected && (
                  <path
                    d={arcD}
                    fill="none"
                    stroke="#2A2A2A"
                    strokeWidth="7"
                    className="pointer-events-none"
                  />
                )}

                <path
                  d={arcD}
                  fill={fill}
                  fillOpacity={isSelected ? 1 : (currentSelected.length > 0 ? 0.72 : 1)}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  filter={isSelected ? "url(#selected-slice-shadow)" : undefined}
                  className="transition-all duration-200 pointer-events-auto"
                />

                {/* Shading overlays for selected slices */}
                {isSelected && (
                  <>
                    <path
                      d={arcD}
                      fill={isLightBg ? "rgba(15, 23, 42, 0.16)" : "rgba(0, 0, 0, 0.24)"}
                      stroke="none"
                      className="pointer-events-none"
                    />
                    <path
                      d={arcD}
                      fill="url(#selected-slice-hatch)"
                      stroke="#ffffff"
                      strokeWidth="3.5"
                      className="pointer-events-none"
                    />
                  </>
                )}

                {slice.level === 0 ? (
                  <text
                    fill={textFill}
                    fontSize={isFullView ? "24" : "19"}
                    fontFamily="Tenor Sans, Georgia, serif"
                    fontWeight="normal"
                    className="pointer-events-none select-none transition-colors"
                  >
                    <textPath
                      href={`#text-path-${slice.id}`}
                      startOffset="50%"
                      textAnchor="middle"
                    >
                      {slice.name}
                    </textPath>
                  </text>
                ) : (
                  shouldShowLabel && (() => {
                    const lines = wrapSliceLabel(slice.name, slice.level === 1 ? 13 : 10);
                    const fontSize = slice.level === 1 ? (isFullView ? "12" : "10.5") : "8.5";
                    return (
                      <text
                        x={textPos.x}
                        y={textPos.y}
                        fill={textFill}
                        fontSize={fontSize}
                        fontFamily="Open Sans, sans-serif"
                        fontWeight={isSelected ? "700" : "600"}
                        textAnchor="middle"
                        dominantBaseline="central"
                        pointerEvents="none"
                        transform={`rotate(${textRotation}, ${textPos.x}, ${textPos.y})`}
                        className="pointer-events-none select-none drop-shadow-sm transition-colors"
                      >
                        {lines.length === 1 ? (
                          lines[0]
                        ) : lines.length === 2 ? (
                          <>
                            <tspan x={textPos.x} dy="-0.6em">{lines[0]}</tspan>
                            <tspan x={textPos.x} dy="1.2em">{lines[1]}</tspan>
                          </>
                        ) : (
                          <>
                            <tspan x={textPos.x} dy="-1.1em">{lines[0]}</tspan>
                            <tspan x={textPos.x} dy="1.1em">{lines[1]}</tspan>
                            <tspan x={textPos.x} dy="1.1em">{lines[2]}</tspan>
                          </>
                        )}
                      </text>
                    );
                  })()
                )}
              </g>
            );
          })}

          {/* Center Hollow Donut Hub */}
          <circle
            cx={center}
            cy={center}
            r={centerRadius}
            fill="#ffffff"
            stroke="#E2E8F0"
            strokeWidth="2"
            className="pointer-events-none select-none drop-shadow-xs"
          />
        </g>
      </svg>
    </div>
  );
}
