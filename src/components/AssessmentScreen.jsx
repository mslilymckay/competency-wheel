import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { fetchAssessments } from '../lib/supabaseClient.js';

export function AssessmentScreen({ tier = 'ic', onComplete, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedSide, setSelectedSide] = useState(null);
  const [animStage, setAnimStage] = useState('stage-settled');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [answers, setAnswers] = useState({});
  const [bypassedLog, setBypassedLog] = useState([]);

  // Ref to hold latest state for keyboard event handler
  const stateRef = useRef({
    isAnimating: false,
    currentIndex: 0,
    questions: [],
    answers: {},
    bypassedLog: []
  });

  stateRef.current = {
    isAnimating,
    currentIndex,
    questions,
    answers,
    bypassedLog
  };

  // 1. Fetch questions on mount or tier change
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      const data = await fetchAssessments(tier);
      if (isMounted) {
        if (data && data.length > 0) {
          setQuestions(data);
        }
        setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [tier]);

  // 2. Choice Selection & Cinematic Transition Sequence
  const handleChoice = useCallback((side) => {
    const { isAnimating: inAnim, currentIndex: idx, questions: qList, answers: ans, bypassedLog: bLog } = stateRef.current;
    if (inAnim || !qList || qList.length === 0 || idx >= qList.length) return;

    const currentQ = qList[idx];
    const qId = currentQ.id || `q_${idx}`;

    const chosen = side === 'A'
      ? { text: currentQ.option_a_text, competency: currentQ.option_a_competency }
      : { text: currentQ.option_b_text, competency: currentQ.option_b_competency };

    const bypassed = side === 'A'
      ? { text: currentQ.option_b_text, competency: currentQ.option_b_competency }
      : { text: currentQ.option_a_text, competency: currentQ.option_a_competency };

    const nextAnswers = { ...ans, [qId]: chosen };
    const nextBypassed = [
      ...bLog.filter(b => b.questionId !== qId),
      {
        questionId: qId,
        chosen: chosen.competency,
        passedOver: bypassed.competency
      }
    ];

    setAnswers(nextAnswers);
    setBypassedLog(nextBypassed);
    setIsAnimating(true);
    setSelectedSide(side);

    // Sequence Step 1: Active card color inversion flash
    setTimeout(() => {
      // Step 2: Dissolve both situation and cards simultaneously
      setAnimStage('stage-dissolve');

      setTimeout(() => {
        setSelectedSide(null);

        // Advance to next question or complete
        if (idx < qList.length - 1) {
          setCurrentIndex(idx + 1);

          // Step 3: Render new situation centered where cards were
          setAnimStage('stage-center-situation');

          // Hold briefly in center so user registers the new prompt
          setTimeout(() => {
            // Step 4: Glide situation smoothly up to top spot
            setAnimStage('stage-glide-up');

            // Step 5: Reveal new cards as situation reaches the top
            setTimeout(() => {
              setAnimStage('stage-settled');
              setIsAnimating(false);
            }, 380);

          }, 240); // 240ms pause in center

        } else {
          // Reached question 15! Calculate scoring and hand off to Results
          setAnimStage('stage-settled');
          setIsAnimating(false);

          // Tally 0/1/2 scores from forced choices
          const scores = {};
          const bypassedCounts = {};

          Object.values(nextAnswers).forEach(ansItem => {
            if (ansItem && ansItem.competency) {
              scores[ansItem.competency] = (scores[ansItem.competency] || 0) + 1;
            }
          });

          nextBypassed.forEach(b => {
            if (b && b.passedOver) {
              bypassedCounts[b.passedOver] = (bypassedCounts[b.passedOver] || 0) + 1;
            }
          });

          const allCompetencies = Array.from(new Set([
            ...Object.keys(scores),
            ...Object.keys(bypassedCounts)
          ]));

          // Strengths: Highest scores, fewest passed over
          const sortedStrengths = [...allCompetencies].sort((a, b) => {
            const scoreDiff = (scores[b] || 0) - (scores[a] || 0);
            if (scoreDiff !== 0) return scoreDiff;
            return (bypassedCounts[a] || 0) - (bypassedCounts[b] || 0);
          });
          const topStrengths = sortedStrengths.slice(0, 3);

          // Focus Areas: Lowest scores (0/2s), most passed over
          const sortedFocus = [...allCompetencies].sort((a, b) => {
            const scoreDiff = (scores[a] || 0) - (scores[b] || 0);
            if (scoreDiff !== 0) return scoreDiff;
            return (bypassedCounts[b] || 0) - (bypassedCounts[a] || 0);
          });
          const topFocusAreas = sortedFocus.slice(0, 3);

          if (onComplete) {
            onComplete({
              tier,
              answers: nextAnswers,
              bypassLog: nextBypassed,
              totalQuestions: qList.length,
              scores,
              strengths: topStrengths,
              focusAreas: topFocusAreas
            });
          }
        }

      }, 220); // Dissolve duration

    }, 140); // Active selection flash

  }, [tier, onComplete]);

  // 3. Desktop Keyboard Shortcuts (← Left Arrow, → Right Arrow)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (stateRef.current.isAnimating) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleChoice('A');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleChoice('B');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleChoice]);

  // Loading State
  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-[#B23267] rounded-full animate-spin mb-4" />
        <h3 className="font-heading text-xl text-[#2A2A2A]">Loading {tier.toUpperCase()} Assessment...</h3>
        <p className="text-xs text-slate-400 mt-1">Retrieving balanced ipsative pairings</p>
      </div>
    );
  }

  // Fallback if no questions loaded
  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-auto p-8 bg-white rounded-3xl border border-slate-200 text-center">
        <h3 className="font-heading text-xl text-[#2A2A2A] mb-2">No Questions Found</h3>
        <p className="text-xs text-slate-600 mb-6">
          Unable to load pairings for tier "{tier}".
        </p>
        <button onClick={onBack} className="btn-primary py-2.5 px-6">
          Back to Tier Select
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const tierClass = tier === 'ic' ? 'tier-ic' : tier === 'manager' ? 'tier-manager' : tier === 'values' ? 'tier-values' : 'tier-director';
  const tierColorHex = tier === 'ic' ? '#0B538C' : tier === 'manager' ? '#1E5C32' : tier === 'values' ? '#B45309' : '#B23267';

  return (
    <div className="w-full flex flex-col items-center flex-1 min-h-0 justify-center animate-in fade-in duration-300">
      
      {/* Assessment Stage: Open canvas with Viewport Fit & Dynamic Transition Class */}
      <div className={`w-full max-w-5xl flex flex-col justify-between flex-1 min-h-0 py-3 sm:py-6 px-4 sm:px-8 relative ${animStage}`}>

        {/* 1. Header: Back Navigation & Question Counter (Progress bar removed, text preserved) */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-200/60 shrink-0">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-[#2A2A2A] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Tier Select</span>
          </button>

          <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        {/* 2. Prompt Box with Generous Breathing Room */}
        <div className="prompt-box text-center max-w-3xl mx-auto pt-4 sm:pt-8 pb-3 sm:pb-6 shrink-0">
          <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-2">
            Select the option that's most like you. Choose quickly for the best results.
          </p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-heading text-[#2A2A2A] leading-snug">
            "{currentQ.prompt}"
          </h2>
        </div>

        {/* 3. Cards Box (Tier-Themed, Generous Spacing, Fixed Dimensions, Centered Text) */}
        <div className="cards-box flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 md:gap-16 my-auto w-full max-w-4xl mx-auto py-4 sm:py-6 flex-1 min-h-0">

          {/* Option Card A (Left) */}
          <div
            onClick={() => handleChoice('A')}
            className={`assessment-card ${tierClass} rounded-3xl p-6 sm:p-8 cursor-pointer flex flex-col justify-center items-center text-center w-full sm:w-[340px] md:w-[350px] h-[250px] sm:h-[300px] md:h-[320px] shrink-0 shadow-sm ${selectedSide === 'A' ? 'active-state' : ''}`}
          >
            <p className="behavior-text text-lg sm:text-xl md:text-2xl font-medium leading-relaxed transition-colors">
              {currentQ.option_a_text}
            </p>
          </div>

          {/* Option Card B (Right) */}
          <div
            onClick={() => handleChoice('B')}
            className={`assessment-card ${tierClass} rounded-3xl p-6 sm:p-8 cursor-pointer flex flex-col justify-center items-center text-center w-full sm:w-[340px] md:w-[350px] h-[250px] sm:h-[300px] md:h-[320px] shrink-0 shadow-sm ${selectedSide === 'B' ? 'active-state' : ''}`}
          >
            <p className="behavior-text text-lg sm:text-xl md:text-2xl font-medium leading-relaxed transition-colors">
              {currentQ.option_b_text}
            </p>
          </div>

        </div>

        {/* 4. Bottom Row: ONLY the [i] Button by Default */}
        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-slate-200/60 shrink-0 relative min-h-[40px]">
          
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={() => setShowTooltip(prev => !prev)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="w-7 h-7 rounded-full border border-slate-300 text-slate-500 flex items-center justify-center font-serif text-xs font-bold transition-all focus:outline-none"
              style={{
                borderColor: showTooltip ? tierColorHex : undefined,
                color: showTooltip ? tierColorHex : undefined
              }}
              title="Keyboard shortcut help"
              aria-label="Instructions"
            >
              i
            </button>

            {/* Minimal Tooltip */}
            {showTooltip && (
              <div className="absolute left-9 bottom-0 bg-[#2A2A2A] text-white text-xs px-3.5 py-2 rounded-xl shadow-xl whitespace-nowrap z-30">
                Click, tap, or press <kbd className="px-1.5 py-0.5 bg-slate-700 rounded border border-slate-600 font-mono text-[11px]">←</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-700 rounded border border-slate-600 font-mono text-[11px]">→</kbd> to make your selection.
              </div>
            )}
          </div>

          {/* Right side is intentionally empty */}
          <div />

        </div>

      </div>

    </div>
  );
}
