import React from 'react';
import { Award, Trash2, X, Search, ArrowRight } from 'lucide-react';
import { allDefinitions, getSegmentThemeColor } from '../lib/wheelTheme.js';

function getPathTierTheme(path) {
  const root = path?.[0];
  if (root === 'Manager') {
    return {
      primary: '#1E5C32',
      lightBg: '#E8F8EC',
      border: 'rgba(30, 92, 50, 0.25)'
    };
  }
  if (root === 'Director') {
    return {
      primary: '#B23267',
      lightBg: '#FDE8EF',
      border: 'rgba(178, 50, 103, 0.25)'
    };
  }
  return {
    primary: '#0B538C',
    lightBg: '#EBF5FB',
    border: 'rgba(11, 83, 140, 0.25)'
  };
}

export function DefinitionsPanel({
  competencyPaths,
  setCompetencyPaths,
  isMultiSelect,
  setIsMultiSelect,
  onExploreLearningPath,
  onRequestClearAll
}) {
  const truncatePath = (pathIndex, levelIndex) => {
    setCompetencyPaths(prev => {
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
    setCompetencyPaths(prev => prev.filter((_, i) => i !== pathIndex));
  };

  const totalSelections = competencyPaths.length;

  return (
    <div className="flex flex-col justify-between h-full flex-1 min-h-0 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 sm:p-6 overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col gap-2.5 pb-2.5 shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-heading text-[#2A2A2A] tracking-tight">
            Your Selected Competencies
          </h2>

          {/* CLEAR ALL BUTTON */}
          {totalSelections > 0 && (
            <button
              type="button"
              onClick={onRequestClearAll}
              className="py-1 px-2.5 rounded-lg text-xs font-bold text-[#B23267] hover:bg-[#FCE7F3] border border-[#B23267]/30 transition-colors flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B23267]"
            >
              <Trash2 size={13} /> Clear All
            </button>
          )}
        </div>

        {/* Selection Count & Multi-select checkbox */}
        <div className="flex items-center justify-between pt-1 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FCE7F3] text-[#B23267] border border-[#B23267]/20">
            <Award size={13} /> Competencies ({competencyPaths.length})
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-slate-700">
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

      {/* Scrollable Definition Cards */}
      <div className="flex-1 min-h-0 overflow-y-auto py-2 pr-1.5 flex flex-col gap-3.5 custom-scrollbar">
        {competencyPaths.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-2xl my-auto">
            <div className="w-12 h-12 rounded-2xl bg-[#FCE7F3] text-[#B23267] flex items-center justify-center mb-3">
              <Award size={24} />
            </div>
            <h3 className="font-heading text-lg text-[#2A2A2A] mb-1">
              No Competencies Selected
            </h3>
            <p className="text-xs text-slate-600 max-w-[280px] leading-relaxed">
              Select segments on the wheel to inspect definitions, leadership tiers, and behavioral indicators.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {competencyPaths.map((path, pathIndex) => {
              const cardTheme = getPathTierTheme(path);

              return (
                <div 
                  key={path.join('---')} 
                  className="rounded-2xl border p-4 flex flex-col gap-2.5 shadow-sm transition-colors"
                  style={{
                    backgroundColor: `${cardTheme.lightBg}85`,
                    borderColor: cardTheme.border
                  }}
                >
                  {/* Linear Breadcrumbs */}
                  <div
                    className="flex items-center justify-between pb-2 border-b"
                    style={{ borderColor: cardTheme.border }}
                  >
                    <div
                      className="flex flex-wrap items-center gap-1 text-xs font-bold"
                      style={{ color: cardTheme.primary }}
                    >
                      {path.map((segment, idx) => (
                        <React.Fragment key={segment}>
                          <span>{segment}</span>
                          {idx < path.length - 1 && <span className="text-slate-600">→</span>}
                        </React.Fragment>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeWholePath(pathIndex)}
                      className="text-xs text-slate-600 hover:text-[#2A2A2A] p-1 transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B23267]"
                      title="Remove entire path"
                      aria-label={`Remove ${path.join(' to ')}`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Hierarchical definitions stack */}
                  {path.map((segmentName, levelIndex) => {
                    const segmentColor = getSegmentThemeColor(path, levelIndex);
                    const defText = allDefinitions[segmentName] || "Core organizational competency benchmark.";
                    const tierLabel = levelIndex === 0 ? "Level" : (levelIndex === 1 ? "Competency" : "Skill");

                    return (
                      <div key={segmentName} className="flex items-start gap-2.5 relative group">
                        <div 
                          className="w-5 h-5 rounded-md flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm mt-0.5"
                          style={{ backgroundColor: segmentColor }}
                        >
                          {levelIndex + 1}
                        </div>

                        <div className="flex-1 pr-6">
                          <div
                            className="text-xs font-extrabold uppercase tracking-wider mb-0.5"
                            style={{ color: cardTheme.primary }}
                          >
                            {tierLabel}
                          </div>
                          <div className="text-xs sm:text-sm font-bold text-[#2A2A2A] leading-snug mb-0.5">
                            {segmentName}
                          </div>
                          <div className="text-xs text-slate-600 leading-relaxed">
                            {defText}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => truncatePath(pathIndex, levelIndex)}
                          className="absolute right-0 top-0 w-5 h-5 rounded-md bg-white/90 hover:bg-white text-slate-600 hover:text-[#2A2A2A] border border-slate-200/70 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B23267]"
                          title="Remove segment"
                          aria-label={`Remove ${segmentName}`}
                        >
                          <X size={12} strokeWidth={2.5} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom CTA Button */}
      {onExploreLearningPath && (
        <div className="pt-2.5 shrink-0">
          <button
            type="button"
            disabled={totalSelections === 0}
            onClick={onExploreLearningPath}
            className="w-full py-3 px-5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md bg-[#B23267] hover:bg-[#9d174d] text-white disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed hover:shadow-lg active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#B23267]"
          >
            <Search size={16} />
            <span>Explore Learning Plan ({totalSelections})</span>
            <ArrowRight size={15} />
          </button>
        </div>
      )}

    </div>
  );
}
