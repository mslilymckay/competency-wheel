import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { signUpUser, signInUser } from '../lib/supabaseClient.js';

export function AuthModal({ isOpen, onClose, onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setErrorMsg('');
    setLoading(true);

    try {
      if (isSignup) {
        if (!displayName.trim()) {
          setErrorMsg('Please enter your display name.');
          setLoading(false);
          return;
        }

        const { user: newUser, error } = await signUpUser({
          email: email.trim(),
          password,
          displayName: displayName.trim()
        });

        if (error) {
          let msg = error.message || 'Failed to create account. Please try again.';
          if (/rate limit/i.test(msg)) {
            msg = "Supabase email rate limit exceeded (free tier is limited to ~3 confirmation emails per hour). To fix this for development: in your Supabase Dashboard, navigate to Authentication ➔ Providers ➔ Email, and toggle OFF 'Confirm email'.";
          }
          setErrorMsg(msg);
          setLoading(false);
          return;
        }

        if (newUser && onLogin) {
          await onLogin(newUser);
        }
        onClose();
      } else {
        const { user: authUser, error } = await signInUser({
          email: email.trim(),
          password
        });

        if (error) {
          setErrorMsg(error.message || 'Invalid email or password.');
          setLoading(false);
          return;
        }

        if (authUser && onLogin) {
          await onLogin(authUser);
        }
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-heading text-[#2A2A2A]">
              {isSignup ? 'Create Your Account' : 'Welcome Back'}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              {isSignup
                ? 'Sign up to create your profile and sync your results.'
                : 'Sign in to sync your assessments across devices.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B23267]"
            aria-label="Close sign in dialog"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-600" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {isSignup && (
            <div className="flex flex-col gap-1">
              <label htmlFor="auth-display-name" className="text-xs font-semibold text-slate-700">
                Display Name
              </label>
              <input
                id="auth-display-name"
                type="text"
                required={isSignup}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Jane Doe"
                className="p-2.5 sm:p-3 rounded-xl bg-[#F5F5F7] border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#B23267] outline-none transition-all"
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="auth-email" className="text-xs font-semibold text-slate-700">
              Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="p-2.5 sm:p-3 rounded-xl bg-[#F5F5F7] border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#B23267] outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="auth-password" className="text-xs font-semibold text-slate-700">
              Password
            </label>
            <input
              id="auth-password"
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
            disabled={loading}
            className={`w-full mt-1 py-2.5 sm:py-3 btn-primary text-xs ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading
              ? (isSignup ? 'Creating Account...' : 'Signing In...')
              : (isSignup ? 'Create Account & Sync' : 'Sign In')}
          </button>
        </form>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setErrorMsg('');
            }}
            className="text-[#B23267] font-semibold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B23267] rounded"
          >
            {isSignup ? 'Already have an account? Log in' : 'Create an account'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B23267] rounded"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
