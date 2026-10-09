import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { fetchAssessments } from '../lib/supabaseClient.js';

export function AssessmentScreen({ tier = 'ic', onComplete, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [bypassedLog, setBypassedLog] = useState([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchAssessments(tier);
      if (data && data.length > 0) {
        setQuestions(data);
      }
      setLoading(false);
    }
    loadData();
  }, [tier]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (chosen, bypassed) => {
    const qId = currentQ ? currentQ.id : `q_${currentIndex}`;
    const nextAnswers = { ...answers, [qId]: chosen };
    const nextBypassed = [
      ...bypassedLog.filter(b => b.questionId !== qId),
      {
        questionId: qId,
        chosen: chosen.competency,
        passedOver: bypassed.competency
      }
    ];

    setAnswers(nextAnswers);
    setBypassedLog(nextBypassed);

    if (currentIndex < (questions.length - 1)) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Completed all questions! Hand off to Results state
      if (onComplete) {
        onComplete({
          tier,
          answers: nextAnswers,
          bypassLog: nextBypassed,
          totalQuestions: questions.length
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-in fade-in">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-700 rounded-full animate-spin mb-4" />
        <h3 className="font-heading text-lg text-charcoal">Loading {tier.toUpperCase()} Assessment...</h3>
        <p className="text-xs text-slate-500 mt-1">Retrieving balanced ipsative pairings from Supabase</p>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 text-center">
        <h3 className="font-heading text-xl text-charcoal mb-2">Ready to Build Assessment</h3>
        <p className="text-xs text-slate-600 mb-6">
          The 15 questions for tier "{tier}" will be rendered in Sprint 3.
        </p>
        <button
          onClick={() => onComplete && onComplete({
            tier,
            answers: {},
            bypassLog: [],
            totalQuestions: 15
          })}
          className="py-3 px-6 rounded-xl bg-rose-700 text-white font-bold text-xs shadow-md"
        >
          Preview Results Screen ➔
        </button>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto w-full py-6 sm:py-10 animate-in fade-in duration-300">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-charcoal transition-colors"
        >
          <ArrowLeft size={14} /> Back to Tier Select
        </button>
        <span className="text-xs font-bold text-slate-600 bg-cloud px-3 py-1 rounded-full">
          Question {currentIndex + 1} of {questions.length} ({progressPercent}%)
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2 mb-8 overflow-hidden">
        <div 
          className="bg-rose-700 h-2 transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Prompt Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm mb-8 text-center">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-700 bg-blush border border-rose-200 px-3 py-1 rounded-full inline-block mb-3">
          Ipsative Forced-Choice
        </span>
        <h2 className="text-2xl sm:text-3xl font-heading text-charcoal max-w-2xl mx-auto leading-snug">
          "{currentQ.prompt}"
        </h2>
      </div>

      {/* Split-Screen Options (Option A vs Option B) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Option A */}
        <div
          onClick={() => handleSelectOption(
            { text: currentQ.option_a_text, competency: currentQ.option_a_competency },
            { text: currentQ.option_b_text, competency: currentQ.option_b_competency }
          )}
          className="bg-white hover:bg-rose-50/40 p-8 rounded-3xl border-2 border-slate-200 hover:border-rose-600 cursor-pointer transition-all shadow-sm hover:shadow-md flex flex-col justify-between group"
        >
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400 group-hover:text-rose-700 mb-3">
              Option A
            </div>
            <p className="text-base text-charcoal font-medium leading-relaxed">
              {currentQ.option_a_text}
            </p>
          </div>
          <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 bg-cloud px-2.5 py-1 rounded-lg">
              {currentQ.option_a_competency}
            </span>
            <span className="text-xs font-bold text-rose-700 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              Select <ChevronRight size={14} />
            </span>
          </div>
        </div>

        {/* Option B */}
        <div
          onClick={() => handleSelectOption(
            { text: currentQ.option_b_text, competency: currentQ.option_b_competency },
            { text: currentQ.option_a_text, competency: currentQ.option_a_competency }
          )}
          className="bg-white hover:bg-rose-50/40 p-8 rounded-3xl border-2 border-slate-200 hover:border-rose-600 cursor-pointer transition-all shadow-sm hover:shadow-md flex flex-col justify-between group"
        >
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400 group-hover:text-rose-700 mb-3">
              Option B
            </div>
            <p className="text-base text-charcoal font-medium leading-relaxed">
              {currentQ.option_b_text}
            </p>
          </div>
          <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 bg-cloud px-2.5 py-1 rounded-lg">
              {currentQ.option_b_competency}
            </span>
            <span className="text-xs font-bold text-rose-700 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              Select <ChevronRight size={14} />
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
