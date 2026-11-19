import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw } from 'lucide-react';
import { fetchAssessments } from '../lib/supabaseClient.js';

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const MIN_LOADING_MS = 650;

const TIER_LABELS = {
  ic: 'Individual Contributor',
  manager: 'Manager',
  director: 'Director'
};

export function AssessmentScreen({ tier = 'ic', onComplete, onBack, onRestart }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSide, setSelectedSide] = useState(null);
  const [animStage, setAnimStage] = useState('stage-settled');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showRestartTooltip, setShowRestartTooltip] = useState(false);
  const [answers, setAnswers] = useState({});
  const [bypassedLog, setBypassedLog] = useState([]);

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

  // 1. Fetch questions on mount or tier change (enforce minimum loading display for consistency)
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      const [data] = await Promise.all([
        fetchAssessments(tier),
        new Promise(resolve => setTimeout(resolve, MIN_LOADING_MS))
      ]);
      if (isMounted) {
        if (data && data.length > 0) {
          setQuestions(shuffleArray(data));
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

          setTimeout(() => {
            // Step 4: Glide situation smoothly up to top spot
            setAnimStage('stage-glide-up');

            // Step 5: Reveal new cards as situation reaches the top
            setTimeout(() => {
              setAnimStage('stage-settled');
              setIsAnimating(false);
            }, 380);

          }, 240);

        } else {
          // Completed assessment: calculate scoring and hand off to Results
          setAnimStage('stage-settled');
          setIsAnimating(false);

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

          const sortedStrengths = [...allCompetencies].sort((a, b) => {
            const scoreDiff = (scores[b] || 0) - (scores[a] || 0);
            if (scoreDiff !== 0) return scoreDiff;
            return (bypassedCounts[a] || 0) - (bypassedCounts[b] || 0);
          });
          const topStrengths = sortedStrengths.slice(0, 3);

          const sortedFocus = [...allCompetencies].sort((a, b) => {
            const scoreDiff = (scores[a] || 0) - (scores[b] || 0);
            if (scoreDiff !== 0) return scoreDiff;
            return (bypassedCounts[b] || 0) - (bypassedCounts[a] || 0);
          });
          const topFocusAreas = sortedFocus.slice(0, 3);

          if (onComplete) {
            setIsProcessing(true);
            setTimeout(() => {
              onComplete({
                tier,
                answers: nextAnswers,
                bypassLog: nextBypassed,
                totalQuestions: qList.length,
                scores,
                strengths: topStrengths,
                focusAreas: topFocusAreas
              });
            }, 1400);
          }
        }

      }, 220);

    }, 140);

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

  const tierClass = tier === 'ic' ? 'tier-ic' : tier === 'manager' ? 'tier-manager' : 'tier-director';
  const tierColorHex = tier === 'ic' ? '#0B538C' : tier === 'manager' ? '#1E5C32' : '#B23267';
  const tierLabel = TIER_LABELS[tier] || 'Competency';

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-200">
        <div
          className="w-10 h-10 border-4 rounded-full animate-spin mb-4"
          style={{
            borderColor: `${tierColorHex}25`,
            borderTopColor: tierColorHex
          }}
        />
        <h3 className="font-heading text-xl text-[#2A2A2A]">Loading {tierLabel} Assessment...</h3>
        <p className="text-xs text-slate-600 mt-1">Retrieving balanced ipsative pairings</p>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-auto p-8 bg-white rounded-3xl border border-slate-200 text-center">
        <h3 className="font-heading text-xl text-[#2A2A2A] mb-2">No Questions Found</h3>
        <p className="text-xs text-slate-600 mb-6">
          Unable to load pairings for tier "{tier}".
        </p>
        <button type="button" onClick={onBack} className="btn-primary py-2.5 px-6">
          Back to Welcome
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  if (isProcessing) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
        <div
          className="w-12 h-12 border-4 rounded-full animate-spin mb-5"
          style={{
            borderColor: `${tierColorHex}25`,
            borderTopColor: tierColorHex
          }}
        />
        <h3 className="font-heading text-2xl text-[#2A2A2A]">
          Processing Your Assessment...
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-md">
          Synthesizing competency trade-offs and building your personalized diagnostic profile.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center flex-1 min-h-0 justify-center animate-in fade-in duration-300">
      
      {/* Assessment Stage */}
      <div className={`w-full max-w-5xl flex flex-col justify-between flex-1 min-h-0 py-3 sm:py-6 px-4 sm:px-8 relative ${animStage}`}>

        {/* 1. Header: Question Counter (Back link removed; Step 1 in stepper handles Select Assessment) */}
        <div className="flex items-center justify-end pb-3 sm:pb-4 shrink-0">
          <span className="text-xs font-bold text-slate-600 tracking-wider uppercase">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        {/* 2. Prompt Box */}
        <div className="prompt-box text-center max-w-3xl mx-auto pt-4 sm:pt-8 pb-3 sm:pb-6 shrink-0">
          <p className="text-xs font-semibold text-slate-600 tracking-wider uppercase mb-2">
            Select the option that's most like you. Choose quickly for the best results.
          </p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-heading text-[#2A2A2A] leading-snug">
            "{currentQ.prompt}"
          </h2>
        </div>

        {/* 3. Cards Box (Semantic <button> Cards with Keyboard Focus Rings) */}
        <div className="cards-box flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 md:gap-16 my-auto w-full max-w-4xl mx-auto py-4 sm:py-6 flex-1 min-h-0">

          {/* Option Card A (Left) */}
          <button
            type="button"
            onClick={() => handleChoice('A')}
            aria-label={`Option A: ${currentQ.option_a_text}`}
            className={`assessment-card ${tierClass} rounded-3xl p-6 sm:p-8 cursor-pointer flex flex-col justify-center items-center text-center w-full sm:w-[340px] md:w-[350px] h-[250px] sm:h-[300px] md:h-[320px] shrink-0 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#B23267] ${selectedSide === 'A' ? 'active-state' : ''}`}
          >
            <span className="behavior-text text-lg sm:text-xl md:text-2xl font-medium leading-relaxed transition-colors">
              {currentQ.option_a_text}
            </span>
          </button>

          {/* Option Card B (Right) */}
          <button
            type="button"
            onClick={() => handleChoice('B')}
            aria-label={`Option B: ${currentQ.option_b_text}`}
            className={`assessment-card ${tierClass} rounded-3xl p-6 sm:p-8 cursor-pointer flex flex-col justify-center items-center text-center w-full sm:w-[340px] md:w-[350px] h-[250px] sm:h-[300px] md:h-[320px] shrink-0 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#B23267] ${selectedSide === 'B' ? 'active-state' : ''}`}
          >
            <span className="behavior-text text-lg sm:text-xl md:text-2xl font-medium leading-relaxed transition-colors">
              {currentQ.option_b_text}
            </span>
          </button>

        </div>

        {/* 4. Bottom Row: [i] Keyboard Help Button (left) & Restart Icon+Tooltip (right) */}
        <div className="flex items-center justify-between pt-3 sm:pt-4 shrink-0 relative min-h-[40px]">
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={() => setShowTooltip(prev => !prev)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="w-7 h-7 rounded-full border border-slate-300 text-slate-600 flex items-center justify-center font-serif text-xs font-bold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B23267]"
              style={{
                borderColor: showTooltip ? tierColorHex : undefined,
                color: showTooltip ? tierColorHex : undefined
              }}
              aria-label="Instructions"
            >
              i
            </button>

            {showTooltip && (
              <div className="absolute left-9 bottom-0 bg-[#2A2A2A] text-white text-xs px-3.5 py-2 rounded-xl shadow-xl whitespace-nowrap z-30">
                Click, tap, or press <kbd className="px-1.5 py-0.5 bg-slate-700 rounded border border-slate-600 font-mono text-xs">←</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-700 rounded border border-slate-600 font-mono text-xs">→</kbd> to make your selection.
              </div>
            )}
          </div>

          {onRestart && (
            <div className="relative flex items-center">
              {showRestartTooltip && (
                <div className="absolute right-9 bottom-0 bg-[#2A2A2A] text-white text-xs px-3.5 py-2 rounded-xl shadow-xl whitespace-nowrap z-30">
                  Restart Assessment
                </div>
              )}

              <button
                type="button"
                onClick={onRestart}
                onMouseEnter={() => setShowRestartTooltip(true)}
                onMouseLeave={() => setShowRestartTooltip(false)}
                onFocus={() => setShowRestartTooltip(true)}
                onBlur={() => setShowRestartTooltip(false)}
                className="w-7 h-7 rounded-full border border-slate-300 text-slate-600 flex items-center justify-center transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B23267]"
                style={{
                  borderColor: showRestartTooltip ? tierColorHex : undefined,
                  color: showRestartTooltip ? tierColorHex : undefined
                }}
                aria-label="Restart Assessment"
              >
                <RotateCcw size={13} />
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
