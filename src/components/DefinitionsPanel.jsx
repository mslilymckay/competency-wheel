import React from 'react';
import { Award, Heart, Trash2, X, Route, ArrowRight } from 'lucide-react';
import { allDefinitions, getSegmentThemeColor } from '../lib/wheelTheme.js';

export function DefinitionsPanel({
  activeMode,
  setActiveMode,
  competencyPaths,
  setCompetencyPaths,
  valuesPaths,
  setValuesPaths,
  isMultiSelect,
  setIsMultiSelect,
  onExploreLearningPath,
  onRequestClearAll
}) {
  const isValues = activeMode === 'values';
  const activePaths = isValues ? valuesPaths : competencyPaths;
  const setActivePaths = isValues ? setValuesPaths : setCompetencyPaths;

  const truncatePath = (pathIndex, levelIndex) => {
    setActivePaths(prev => {
      const newPaths = [...prev];
      if (levelIndex === 0) newPaths.splice(pathIndex, 1);
      else newPaths[pathIndex] = newPaths[pathIndex].slice(0, levelIndex);
      const unique = [];
      newPaths.forEach(p => {
        if (!unique.some(u => u.join('---') === p.join('---'))) unique.push(p);
      });
      return unique;
    });
  };

  const removeWholePath = (pathIndex) => {
    setActivePaths(prev => prev.filter((_, i) => i !== pathIndex));
  };

  const totalSelected = competencyPaths.length + valuesPaths.length;

  return (
    <div className="flex flex-col justify-between h-full flex-1 min-h-0 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 sm:p-6 overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col gap-2.5 pb-2.5 shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-heading text-[#2A2A2A] tracking-tight">
            {isValues ? 'Your Selected Values' : 'Your Selected Competencies'}
          </h2>

          {/* CLEAR ALL BUTTON */}
          {totalSelected > 0 && (
            <button
              onClick={onRequestClearAll}
              className="py-1 px-2.5 rounded-lg text-xs font-bold text-[#B23267] hover:bg-[#FCE7F3] border border-[#B23267]/30 transition-colors flex items-center gap-1"
            >
              <Trash2 size={13} /> Clear All
            </button>
          )}
        </div>

        {/* Sub-tab navigation & Multi-select checkbox */}
        <div className="flex items-center justify-between pt-1 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveMode('competencies')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${!isValues ? 'bg-[#B23267] text-white shadow-sm' : 'bg-[#F5F5F7] text-slate-600 hover:bg-slate-200'}`}
            >
              <Award size={13} /> Competencies ({competencyPaths.length})
            </button>
            <button
              onClick={() => setActiveMode('values')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${isValues ? 'bg-[#B23267] text-white shadow-sm' : 'bg-[#F5F5F7] text-slate-600 hover:bg-slate-200'}`}
            >
              <Heart size={13} /> Values ({valuesPaths.length})
            </button>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-slate-600">
            <input
              type="checkbox"
              checked={isMultiSelect}
              onChange={(e) => setIsMultiSelect(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-[#B23267] focus:ring-[#B23267] border-gray-300"
            />
            <span>Select multiple</span>
          </label>
        </div>
      </div>

      {/* Scrollable Definition Cards (Viewport Constrained: Only this container scrolls) */}
      <div className="flex-1 min-h-0 overflow-y-auto py-2 pr-1.5 flex flex-col gap-3.5 custom-scrollbar">
        {activePaths.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-100 rounded-2xl my-auto">
            <div className="w-12 h-12 rounded-2xl bg-[#FCE7F3] text-[#B23267] flex items-center justify-center mb-3">
              {isValues ? <Heart size={24} /> : <Award size={24} />}
            </div>
            <h3 className="font-heading text-lg text-[#2A2A2A] mb-1">
              No {isValues ? 'Values' : 'Competencies'} Selected
            </h3>
            <p className="text-xs text-slate-500 max-w-[280px] leading-relaxed">
              Select segments on the wheel to inspect definitions, leadership tiers, and behavioral indicators.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {activePaths.map((path, pathIndex) => (
              <div 
                key={path.join('---')} 
                className="bg-[#F5F5F7] rounded-2xl border border-slate-200/80 p-4 flex flex-col gap-2.5 shadow-sm"
              >
                {/* Linear Breadcrumbs */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                  <div className="flex flex-wrap items-center gap-1 text-[11px] font-bold text-[#B23267]">
                    {path.map((segment, idx) => (
                      <React.Fragment key={segment}>
                        <span>{segment}</span>
                        {idx < path.length - 1 && <span className="text-slate-400">→</span>}
                      </React.Fragment>
                    ))}
                  </div>

                  <button
                    onClick={() => removeWholePath(pathIndex)}
                    className="text-xs text-slate-400 hover:text-[#B23267] p-1 transition-colors"
                    title="Remove entire path"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Hierarchical definitions stack */}
                {path.map((segmentName, levelIndex) => {
                  const segmentColor = getSegmentThemeColor(path, levelIndex, isValues);
                  const defText = allDefinitions[segmentName] || "Core organizational competency benchmark.";
                  
                  let tierLabel = "Skill";
                  if (isValues) {
                    tierLabel = levelIndex === 0 ? "Value" : "Behavior";
                  } else {
                    tierLabel = levelIndex === 0 ? "Level" : (levelIndex === 1 ? "Competency" : "Skill");
                  }

                  return (
                    <div key={segmentName} className="flex items-start gap-2.5 relative group">
                      <div 
                        className="w-5 h-5 rounded-md flex items-center justify-center font-bold text-white text-[11px] shrink-0 shadow-sm mt-0.5"
                        style={{ backgroundColor: segmentColor }}
                      >
                        {levelIndex + 1}
                      </div>

                      <div className="flex-1 pr-6">
                        <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-0.5">
                          {tierLabel}
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-[#2A2A2A] leading-snug mb-0.5">
                          {segmentName}
                        </div>
                        <div className="text-[11px] text-slate-600 leading-relaxed">
                          {defText}
                        </div>
                      </div>

                      <button
                        onClick={() => truncatePath(pathIndex, levelIndex)}
                        className="absolute right-0 top-0 w-5 h-5 rounded-md bg-white hover:bg-rose-50 text-slate-400 hover:text-[#B23267] flex items-center justify-center transition-colors"
                        title="Remove segment"
                      >
                        <X size={12} strokeWidth={2.5} />
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA Button */}
      {onExploreLearningPath && (
        <div className="pt-2.5 shrink-0">
          <button
            disabled={totalSelected === 0}
            onClick={onExploreLearningPath}
            className="w-full py-3 px-5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md bg-[#B23267] hover:bg-[#9d174d] text-white disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed hover:shadow-lg active:scale-[0.99]"
          >
            <Route size={16} />
            <span>Explore Learning Path ({totalSelected})</span>
            <ArrowRight size={15} />
          </button>
        </div>
      )}

    </div>
  );
}
