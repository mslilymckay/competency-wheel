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
    <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 py-2 sm:py-4 items-center flex-1 min-h-0 my-auto animate-in fade-in duration-300">
      
      {/* Left Column: Overview Details & 3-Pillar List */}
      <div className="flex flex-col gap-4 sm:gap-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FCE7F3] text-[#B23267] text-xs font-bold border border-[#B23267]/20 mb-2.5">
            <ThreeColorPieIcon size={16} /> 360° Career Navigation
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading text-[#2A2A2A] leading-tight">
            Competency and Values Wheel
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            A tactile self-assessment framework designed to chart leadership capabilities, anchor day-to-day work in core organizational values, and construct tailored 70-20-10 growth pathways.
          </p>
        </div>

        {/* 3 Pillars List */}
        <div className="flex flex-col gap-3 border-t border-slate-200/80 pt-3.5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E0F7FE] text-[#0B538C] flex items-center justify-center shrink-0 shadow-sm border border-[#0B538C]/20">
              <Award size={18} />
            </div>
            <div>
              <h3 className="font-heading text-sm sm:text-base text-[#2A2A2A]">Three-Tier Competency Wheel</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Concentric rings covering Individual Contributor, Manager, and Director tiers across 15 core categories and 45 observable skills.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FCE7F3] text-[#B23267] flex items-center justify-center shrink-0 shadow-sm border border-[#B23267]/20">
              <Heart size={18} fill="#B23267" />
            </div>
            <div>
              <h3 className="font-heading text-sm sm:text-base text-[#2A2A2A]">Core Values Alignment</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Flip seamlessly to examine company core values (Teamwork, Empathy, Agility, Integrity) and actionable workplace behaviors.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E8F8EC] text-[#1E5C32] flex items-center justify-center shrink-0 shadow-sm border border-[#1E5C32]/20">
              <Route size={18} />
            </div>
            <div>
              <h3 className="font-heading text-sm sm:text-base text-[#2A2A2A]">70-20-10 & Focused Growth</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Transform assessment insights into focused leadership goals, peer mentorship, and tailored growth priorities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Clean Login / Create Account / Continue as Guest */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.06)] flex flex-col gap-4 max-w-md mx-auto w-full">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading text-[#2A2A2A]">
            {isSignup ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sign in to sync your assessments, or explore immediately as a guest.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="p-2.5 sm:p-3 rounded-xl bg-[#F5F5F7] border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#B23267] outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="p-2.5 sm:p-3 rounded-xl bg-[#F5F5F7] border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#B23267] outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-1 py-2.5 sm:py-3 btn-primary text-xs"
          >
            {isSignup ? 'Create Account & Start' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center justify-between text-xs pt-0.5">
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-[#B23267] font-semibold hover:underline"
          >
            {isSignup ? 'Already have an account? Log in' : 'Create an account'}
          </button>
        </div>

        <div className="relative my-0.5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-3 text-slate-400 font-semibold text-[10px]">or</span></div>
        </div>

        {/* Continue as Guest (Cohesive Secondary Button) */}
        <button
          type="button"
          onClick={onContinueAsGuest}
          className="w-full py-2.5 sm:py-3 btn-secondary flex items-center justify-center gap-2"
        >
          <span>Continue as Guest</span>
          <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
}
