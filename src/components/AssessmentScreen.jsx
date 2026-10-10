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
          // Reached question 15! Hand off to Results
          setAnimStage('stage-settled');
          setIsAnimating(false);
          if (onComplete) {
            onComplete({
              tier,
              answers: nextAnswers,
              bypassLog: nextBypassed,
              totalQuestions: qList.length
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
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-in fade-in">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-700 rounded-full animate-spin mb-4" />
        <h3 className="font-heading text-xl text-slate-800">Loading {tier.toUpperCase()} Assessment...</h3>
        <p className="text-xs text-slate-400 mt-1">Retrieving balanced ipsative pairings</p>
      </div>
    );
  }

  // Fallback if no questions loaded
  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 text-center">
        <h3 className="font-heading text-xl text-slate-900 mb-2">No Questions Found</h3>
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
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="w-full py-2 flex flex-col items-center animate-in fade-in duration-300">
      
      {/* Assessment Stage with Dynamic Transition Class */}
      <div className={`w-full max-w-5xl bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between min-h-[660px] relative ${animStage}`}>

        {/* 1. Header: Back Navigation & Question Counter */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Tier Select</span>
            </button>

            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-1 my-3 overflow-hidden">
            <div
              className="bg-rose-700 h-1 transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 2. Prompt Box (Choreographed Glide Stack) */}
        <div className="prompt-box text-center max-w-3xl mx-auto pt-2 pb-4">
          <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-2">
            Select the option that's most like you. Choose quickly for the best results.
          </p>
          <h2 className="text-2xl sm:text-4xl font-heading text-slate-900 leading-snug">
            "{currentQ.prompt}"
          </h2>
        </div>

        {/* 3. Cards Box (Fixed Dimensions, Centered Text, No Arrow Badges) */}
        <div className="cards-box flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-14 my-auto w-full max-w-4xl mx-auto py-2">

          {/* Option Card A (Left) */}
          <div
            onClick={() => handleChoice('A')}
            className={`assessment-card rounded-3xl p-8 sm:p-10 cursor-pointer flex flex-col justify-center items-center text-center w-full sm:w-[350px] h-[340px] sm:h-[390px] shrink-0 shadow-sm ${selectedSide === 'A' ? 'active-state' : ''}`}
          >
            <p className="behavior-text text-xl sm:text-2xl font-medium leading-relaxed transition-colors text-rose-700">
              {currentQ.option_a_text}
            </p>
          </div>

          {/* Option Card B (Right) */}
          <div
            onClick={() => handleChoice('B')}
            className={`assessment-card rounded-3xl p-8 sm:p-10 cursor-pointer flex flex-col justify-center items-center text-center w-full sm:w-[350px] h-[340px] sm:h-[390px] shrink-0 shadow-sm ${selectedSide === 'B' ? 'active-state' : ''}`}
          >
            <p className="behavior-text text-xl sm:text-2xl font-medium leading-relaxed transition-colors text-rose-700">
              {currentQ.option_b_text}
            </p>
          </div>

        </div>

        {/* 4. Bottom Row: ONLY the [i] Button by Default */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 relative min-h-[44px]">
          
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={() => setShowTooltip(prev => !prev)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="w-7 h-7 rounded-full border border-slate-300 hover:border-rose-700 text-slate-500 hover:text-rose-700 flex items-center justify-center font-serif text-xs font-bold transition-all focus:outline-none"
              title="Keyboard shortcut help"
              aria-label="Instructions"
            >
              i
            </button>

            {/* Minimal Tooltip */}
            {showTooltip && (
              <div className="absolute left-9 bottom-0 bg-slate-900 text-white text-xs px-3.5 py-2 rounded-xl shadow-xl whitespace-nowrap z-30">
                Click, tap, or press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[11px]">←</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[11px]">→</kbd> to make your selection.
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
