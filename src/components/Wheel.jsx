import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Award, Heart } from 'lucide-react';
import { describeArc, describeCurvedTextArc, polarToCartesian } from '../lib/wheelMath.js';
import { defaultCompetencyFramework, defaultValuesFramework } from '../lib/wheelTheme.js';

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

export function Wheel({
  activeMode,
  setActiveMode,
  competencyPaths,
  setCompetencyPaths,
  valuesPaths,
  setValuesPaths,
  isMultiSelect,
  initialFocusAreas,
  selectedTier
}) {
  const [isZoomedOut, setIsZoomedOut] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [isManual, setIsManual] = useState(false);

  const autoRotateKeyRef = useRef(null);

  // Auto-focus and zoom to focused view when focus areas are ported from assessment
  useEffect(() => {
    if (initialFocusAreas && initialFocusAreas.length > 0) {
      setIsZoomedOut(false);
    }
  }, [initialFocusAreas]);

  // Rotate wheel to appropriate position (focus areas cluster or selected tier)
  useEffect(() => {
    const hasFocusAreas = initialFocusAreas && initialFocusAreas.length > 0;
    
    // When focus areas are ported, wait until Focused View slices (Ring 3) are rendered
    if (hasFocusAreas && isZoomedOut) return;

    const currentKey = hasFocusAreas
      ? `focus:${initialFocusAreas.join(',')}`
      : `tier:${selectedTier || 'ic'}:${activeMode}`;

    if (autoRotateKeyRef.current === currentKey) return;
    autoRotateKeyRef.current = currentKey;

    if (hasFocusAreas) {
      // Find matching slices in baseSlices for the ported focus areas
      const matched = [];
      initialFocusAreas.forEach(areaName => {
        const s = baseSlices.find(slice => 
          slice.name.toLowerCase() === areaName.toLowerCase() ||
          (slice.path && slice.path[slice.path.length - 1].toLowerCase() === areaName.toLowerCase())
        );
        if (s) matched.push(s);
      });

      if (matched.length > 0) {
        const midAngles = matched.map(s => s.startAngle + (s.endAngle - s.startAngle) / 2);
        const avgAngle = midAngles.reduce((a, b) => a + b, 0) / midAngles.length;

        // Rotate so the focus cluster centers at 3 o'clock (90 deg, facing Definitions panel)
        let targetRotation = 90 - avgAngle;
        let delta = targetRotation - (rotation % 360);
        delta = ((delta + 180) % 360 + 360) % 360 - 180;

        setIsManual(false);
        setRotation(prev => prev + delta);
      }
    } else if (selectedTier && activeMode === 'competencies') {
      // Rotate core tier to 3 o'clock
      const tierSlice = baseSlices.find(s => 
        s.level === 0 && (
          (selectedTier === 'ic' && s.name === 'Individual Contributor') ||
          (selectedTier === 'manager' && s.name === 'Manager') ||
          (selectedTier === 'director' && s.name === 'Director')
        )
      );
      if (tierSlice) {
        const midAngle = tierSlice.startAngle + (tierSlice.endAngle - tierSlice.startAngle) / 2;
        let targetRotation = 90 - midAngle;
        let delta = targetRotation - (rotation % 360);
        delta = ((delta + 180) % 360 + 360) % 360 - 180;

        setIsManual(false);
        setRotation(prev => prev + delta);
      }
    }
  }, [initialFocusAreas, isZoomedOut, baseSlices, selectedTier, activeMode, rotation]);

  const dragRef = useRef({ isDown: false, hasMoved: false, lastAtan: 0 });
  const velocityRef = useRef(0);
  const lastAngleRef = useRef(0);
  const lastTimeRef = useRef(0);
  const rafRef = useRef(null);
  const clickStartRef = useRef({ x: 0, y: 0 });
  const lastClickTimeRef = useRef(0);
  const pendingSliceRef = useRef(null);
  const svgRef = useRef(null);

  const viewBoxSize = 1000;
  const center = viewBoxSize / 2;
  const centerRadius = 82;

  // RADIUS CONFIGURATION
  const rRing1_Full = 295;
  const rRing2_Full = 465;

  const rRing1_Focus = 215;
  const rRing2_Focus = activeMode === 'values' ? 465 : 340;
  const rRing3_Focus = 465;

  const baseSlices = useMemo(() => {
    const result = [];

    if (activeMode === 'competencies') {
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
          outerRadius: isZoomedOut ? rRing1_Full : rRing1_Focus,
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
            innerRadius: isZoomedOut ? rRing1_Full : rRing1_Focus,
            outerRadius: isZoomedOut ? rRing2_Full : rRing2_Focus,
            color: lvl.palette.ring2
          });

          // RING 3: Sub-competencies (ONLY IN FOCUSED VIEW!)
          if (!isZoomedOut) {
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
    } else {
      // VALUES: 2 Rings for both Full View and Focused View
      const sectorAngle = 360 / defaultValuesFramework.length;
      defaultValuesFramework.forEach((val, valIdx) => {
        const valStart = valIdx * sectorAngle;
        const valEnd = valStart + sectorAngle;
        const valPath = [val.name];

        // RING 1: Core Value
        result.push({
          id: valPath.join('---'),
          name: val.name,
          level: 0,
          path: valPath,
          startAngle: valStart,
          endAngle: valEnd,
          innerRadius: centerRadius,
          outerRadius: isZoomedOut ? rRing1_Full : rRing1_Focus,
          color: val.palette.ring1
        });

        const behSpan = sectorAngle / val.children.length;
        val.children.forEach((beh, behIdx) => {
          const behStart = valStart + (behIdx * behSpan);
          const behEnd = behStart + behSpan;
          const behPath = [...valPath, beh.name];

          // RING 2: Behavior
          result.push({
            id: behPath.join('---'),
            name: beh.name,
            level: 1,
            path: behPath,
            startAngle: behStart,
            endAngle: behEnd,
            innerRadius: isZoomedOut ? rRing1_Full : rRing1_Focus,
            outerRadius: isZoomedOut ? rRing2_Full : rRing2_Focus,
            color: val.palette.ring2
          });
        });
      });
    }

    return result;
  }, [activeMode, isZoomedOut]);

  // Snapping logic
  const focusOnPath = (path) => {
    if (!path || path.length === 0) return;
    const targetName = path[path.length - 1];
    const activeSlice = baseSlices.find(s => s.name === targetName);
    if (!activeSlice) return;

    const midAngle = activeSlice.startAngle + (activeSlice.endAngle - activeSlice.startAngle) / 2;
    let targetRotation = 90 - midAngle;
    let delta = targetRotation - rotation;
    delta = ((delta + 180) % 360 + 360) % 360 - 180;

    setIsManual(false);
    setRotation(rotation + delta);
  };

  const handleSliceClick = (slice) => {
    const isValues = activeMode === 'values';
    const selectedPaths = isValues ? valuesPaths : competencyPaths;
    const setSelectedPaths = isValues ? setValuesPaths : setCompetencyPaths;

    const sliceKey = slice.path.join('---');
    const existingIdx = selectedPaths.findIndex(p => p.join('---') === sliceKey);
    let updated = [...selectedPaths];

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

    setSelectedPaths(updated);

    if (updated.length > 0) {
      if (isZoomedOut) setIsZoomedOut(false);
      setTimeout(() => focusOnPath(slice.path), 40);
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

  const currentSelected = activeMode === 'values' ? valuesPaths : competencyPaths;

  const handleFullView = () => {
    setIsZoomedOut(true);
    setRotation(0);
  };

  const handleFocusedView = () => {
    setIsZoomedOut(false);
    if (currentSelected.length > 0) {
      focusOnPath(currentSelected[currentSelected.length - 1]);
    }
  };

  return (
    <div className="relative w-full h-full flex-1 min-h-0 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-center overflow-hidden p-0">
      
      {/* OVERLAY: Upper-Right (Mode Toggle) */}
      <div className="absolute top-4 right-4 z-20">
        <div className="inline-flex rounded-xl p-1 bg-white/95 border border-slate-200 shadow-md backdrop-blur-md">
          <button
            onClick={() => setActiveMode('competencies')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeMode === 'competencies' ? 'bg-[#B23267] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Award size={14} /> Competencies
          </button>
          <button
            onClick={() => setActiveMode('values')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeMode === 'values' ? 'bg-[#B23267] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Heart size={14} /> Values
          </button>
        </div>
      </div>

      {/* OVERLAY: Lower-Right (Full View & Focused View Only) */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
        <div className="inline-flex rounded-xl p-1 bg-white/95 border border-slate-200 shadow-md backdrop-blur-md">
          <button
            onClick={handleFullView}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isZoomedOut ? 'bg-[#2A2A2A] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            title="Full View (Resets Rotation)"
          >
            Full View
          </button>
          <button
            onClick={handleFocusedView}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${!isZoomedOut ? 'bg-[#2A2A2A] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            title="Focused View (Snaps to Selection)"
          >
            Focused View
          </button>
        </div>
      </div>

      {/* THE SVG WHEEL */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        className={`drop-shadow-xl transition-all duration-700 ease-in-out select-none ${
          isZoomedOut 
            ? 'relative mx-auto w-full h-full max-h-[96%] p-2' 
            : 'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[48%] h-[125%] sm:h-[135%] w-auto max-w-none'
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: 'none' }}
      >
        <defs>
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
          {baseSlices.map(slice => {
            const isSelected = currentSelected.some(p => 
              p.join('---') === slice.path.join('---') || p.join('---').startsWith(slice.path.join('---') + '---')
            );

            const fill = isSelected ? "#ffffff" : slice.color;
            const isLightBg = isSelected || fill === '#00CCFF' || fill === '#FFAEC9' || fill === '#82D18D' || fill === '#FFCC00';
            const textFill = isLightBg ? "#2A2A2A" : "#ffffff";
            const strokeColor = "#ffffff";
            const strokeWidth = "1.5";

            const midAngle = slice.startAngle + (slice.endAngle - slice.startAngle) / 2;
            const textPos = polarToCartesian(
              center, center, 
              slice.innerRadius + (slice.outerRadius - slice.innerRadius) / 2, 
              midAngle
            );
            const textRotation = midAngle - 90;

            const shouldShowLabel = slice.level === 0 || !isZoomedOut || isSelected;

            return (
              <g
                key={slice.id}
                className="cursor-pointer"
                onPointerDown={() => { pendingSliceRef.current = slice; }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (dragRef.current && dragRef.current.hasMoved) return;
                  selectSlice(slice);
                }}
              >
                <path
                  d={describeArc(center, center, slice.innerRadius, slice.outerRadius, slice.startAngle, slice.endAngle)}
                  fill={fill}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  className="transition-colors duration-200 pointer-events-auto"
                />

                {slice.level === 0 ? (
                  <text
                    fill={textFill}
                    fontSize={isZoomedOut ? "24" : "19"}
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
                    const fontSize = slice.level === 1 ? (isZoomedOut ? "12" : "10.5") : "8";
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

          {/* Center Toggle Circle */}
          <g
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setActiveMode(prev => prev === 'competencies' ? 'values' : 'competencies');
            }}
          >
            {activeMode === 'competencies' ? (
              <>
                <circle
                  cx={center} cy={center} r={centerRadius}
                  fill="#be185d"
                  className="drop-shadow-sm"
                />
                <foreignObject x={center - 20} y={center - 20} width="40" height="40" className="pointer-events-none">
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <Award size={32} strokeWidth={2.2} />
                  </div>
                </foreignObject>
              </>
            ) : (
              <>
                <circle
                  cx={center} cy={center} r={centerRadius}
                  fill="#ffffff"
                  stroke="#be185d"
                  strokeWidth="3.5"
                  className="drop-shadow-sm"
                />
                <foreignObject x={center - 20} y={center - 20} width="40" height="40" className="pointer-events-none">
                  <div className="w-full h-full flex items-center justify-center text-rose-700">
                    <Heart size={32} strokeWidth={2.2} fill="#be185d" />
                  </div>
                </foreignObject>
              </>
            )}
          </g>
        </g>
      </svg>
    </div>
  );
}
