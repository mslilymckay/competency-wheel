import React, { useState, useMemo } from 'react';
import { X, Mail, Copy, Check, FileText, Send, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';

export function SendToManagerModal({
  isOpen,
  onClose,
  blueprints = [],
  level = "Professional",
  onTriggerPrint
}) {
  const [activeTab, setActiveTab] = useState('email'); // 'email' | 'briefing'
  const [hasCopied, setHasCopied] = useState(false);

  // Generate Email Text
  const emailData = useMemo(() => {
    const focusSummary = blueprints.map((bp, i) => {
      return `${i + 1}. ${bp.name} (${bp.category})
   • Daily Micro-Habit: ${bp.microHabit}
   • 70% Experiential: ${bp.experiential.action}
   • 20% Social: ${bp.social.action}
   • 10% Formal: ${bp.formal.action}
   • Manager Support Requested: ${bp.managerUnblocker}`;
    }).join('\n\n');

    const subject = `Career Development Blueprint & 1-on-1 Alignment (${level} Focus)`;
    const body = `Hi [Manager Name],

I recently completed my competency self-assessment and mapped out my 70-20-10 professional growth blueprint. 

Here are the focus areas and specific commitments I’m prioritizing:

${focusSummary}

I would love to walk through this during our next 1-on-1 and align on the "Manager Support Requested" items noted above.

Thank you!`;

    const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    return { subject, body, mailto };
  }, [blueprints, level]);

  // Generate 1-on-1 Agenda Briefing (for Slack/Teams/Notion)
  const briefingText = useMemo(() => {
    const items = blueprints.map((bp, i) => {
      return `### ${i + 1}. ${bp.name} (${bp.category})
* **Daily Micro-Habit:** ${bp.microHabit}
* **70% On-the-Job:** ${bp.experiential.action}
* **20% Peer / Mentorship:** ${bp.social.action}
* **10% Framework:** ${bp.formal.action}
* **🛡️ Manager Commitment:** ${bp.managerUnblocker}
* **💬 1-on-1 Check-in:** ${bp.managerCoachingQuestion}`;
    }).join('\n\n');

    return `## 🎯 70-20-10 Career Development Blueprint (${level})

${items}

---
*Created via Competency & Values Wheel Framework • Lily McKay*`;
  }, [blueprints, level]);

  if (!isOpen) return null;

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A2A2A]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FCE7F3] text-[#B23267] flex items-center justify-center shrink-0">
              <Send size={18} />
            </div>
            <div>
              <h3 className="font-heading text-xl text-[#2A2A2A]">Send Blueprint to Manager</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Share your 70-20-10 goals and concrete manager unblocking requests for your next 1-on-1.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <button
            onClick={() => setActiveTab('email')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'email' ? 'bg-[#B23267] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            <Mail size={13} /> Email Draft
          </button>
          <button
            onClick={() => setActiveTab('briefing')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'briefing' ? 'bg-[#B23267] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            <Copy size={13} /> 1-on-1 Agenda (Slack / Teams)
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 min-h-0 overflow-y-auto py-1 custom-scrollbar flex flex-col gap-3">
          {activeTab === 'email' ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Subject: {emailData.subject}</span>
                <span className="text-[11px] text-[#B23267] font-bold flex items-center gap-1">
                  <ShieldCheck size={13} /> Pre-formatted with unblockers
                </span>
              </div>
              <textarea
                readOnly
                value={emailData.body}
                rows={12}
                className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-[#2A2A2A] outline-none leading-relaxed select-text"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <span className="text-xs text-slate-500">
                Formatted markdown ready to paste into 1-on-1 meeting agendas, Notion docs, or direct messages.
              </span>
              <textarea
                readOnly
                value={briefingText}
                rows={12}
                className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-[#2A2A2A] outline-none leading-relaxed select-text"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => {
              onClose();
              if (onTriggerPrint) onTriggerPrint();
            }}
            className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <FileText size={14} />
            <span>Export Manager PDF</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopyText(activeTab === 'email' ? emailData.body : briefingText)}
              className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors shadow-2xs"
            >
              {hasCopied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{hasCopied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
            </button>

            {activeTab === 'email' && (
              <a
                href={emailData.mailto}
                className="btn-primary py-2 px-4 text-xs font-bold flex items-center gap-1.5"
              >
                <span>Open in Email App</span>
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
