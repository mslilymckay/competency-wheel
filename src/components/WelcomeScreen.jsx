import React, { useState } from 'react';
import { Award, Heart, Route, ArrowRight } from 'lucide-react';
import { ThreeColorPieIcon } from './ThreeColorPieIcon.jsx';

export function WelcomeScreen({ onContinueAsGuest, onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    if (onLogin) onLogin({ email });
  };

  return (
    <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-10 py-6 sm:py-12 items-center animate-in fade-in duration-300">
      
      {/* Left Column: Overview Details & 3-Pillar List */}
      <div className="flex flex-col gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blush text-rose-700 text-xs font-bold border border-rose-200 mb-3">
            <ThreeColorPieIcon size={16} /> 360° Career Navigation
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading text-charcoal leading-tight">
            Competency and Values Wheel
          </h1>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            A tactile self-assessment framework designed to chart leadership capabilities, anchor day-to-day work in core organizational values, and construct tailored 70-20-10 growth pathways.
          </p>
        </div>

        {/* 3 Pillars List */}
        <div className="flex flex-col gap-4 border-t border-slate-200 pt-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blush text-rose-700 flex items-center justify-center shrink-0 shadow-sm border border-rose-100">
              <Award size={20} />
            </div>
            <div>
              <h3 className="font-heading text-base text-charcoal">Three-Tier Competency Wheel</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Concentric rings covering Individual Contributor, Manager, and Director tiers across 15 core categories and 45 observable skills.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blush text-rose-700 flex items-center justify-center shrink-0 shadow-sm border border-rose-100">
              <Heart size={20} fill="#be185d" />
            </div>
            <div>
              <h3 className="font-heading text-base text-charcoal">Core Values Alignment</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Flip seamlessly to examine company core values (Teamwork, Empathy, Agility, Integrity) and actionable workplace behaviors.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blush text-rose-700 flex items-center justify-center shrink-0 shadow-sm border border-rose-100">
              <Route size={20} />
            </div>
            <div>
              <h3 className="font-heading text-base text-charcoal">70-20-10 & Focused Growth</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Transform assessment insights into focused leadership goals, peer mentorship, and tailored growth priorities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Clean Login / Create Account / Continue as Guest */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl flex flex-col gap-5">
        <div>
          <h2 className="text-2xl font-heading text-charcoal">
            {isSignup ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sign in to sync your assessments, or explore immediately as a guest.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-600">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="p-3 rounded-xl bg-cloud border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-rose-600 outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-600">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="p-3 rounded-xl bg-cloud border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-rose-600 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-1 py-3.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-md transition-colors"
          >
            {isSignup ? 'Create Account & Start' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center justify-between text-xs pt-1">
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-rose-700 font-bold hover:underline"
          >
            {isSignup ? 'Already have an account? Log in' : 'Create an account'}
          </button>
        </div>

        <div className="relative my-1">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-3 text-slate-400 font-bold text-[10px]">or</span></div>
        </div>

        {/* Continue as Guest */}
        <button
          type="button"
          onClick={onContinueAsGuest}
          className="w-full py-3.5 rounded-xl border-2 border-charcoal hover:bg-charcoal hover:text-white text-charcoal font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <span>Continue as Guest</span>
          <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
}
