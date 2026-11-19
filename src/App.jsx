import React, { useState, useEffect } from 'react';
import { RotateCcw, LogIn } from 'lucide-react';
import { ThreeColorPieIcon } from './components/ThreeColorPieIcon.jsx';
import { WelcomeScreen } from './components/WelcomeScreen.jsx';
import { AssessmentScreen } from './components/AssessmentScreen.jsx';
import { ResultsScreen } from './components/ResultsScreen.jsx';
import { Wheel } from './components/Wheel.jsx';
import { DefinitionsPanel } from './components/DefinitionsPanel.jsx';
import { LearningPathView } from './components/LearningPathView.jsx';
import { ConfirmationModal } from './components/ConfirmationModal.jsx';
import { SignOutModal } from './components/SignOutModal.jsx';
import { AuthModal } from './components/AuthModal.jsx';
import { BrandFooter } from './components/BrandFooter.jsx';
import { NarrowViewportNotice } from './components/NarrowViewportNotice.jsx';
import { getPathForCompetency, applyHydratedFramework } from './lib/wheelTheme.js';
import { applyHydratedInterventions } from './data/interventionsData.js';
import { 
  getCurrentUser, 
  signOutUser, 
  deleteUserData,
  saveAssessmentResult, 
  fetchAllFrameworks, 
  fetchAllInterventions,
  fetchLatestAssessmentResult 
} from './lib/supabaseClient.js';

const TIER_BRAND_COLORS = {
  ic: '#0B538C',
  manager: '#1E5C32',
  director: '#B23267'
};

const VALID_TIERS = new Set(['ic', 'manager', 'director']);

const STEPPER_STAGES = [
  { id: 'WELCOME', step: 1, label: 'Select Assessment', shortLabel: 'Select' },
  { id: 'ASSESSMENT', step: 2, label: 'Assessment', shortLabel: 'Assessment' },
  { id: 'RESULTS', step: 3, label: 'Results Diagnostic', shortLabel: 'Results' },
  { id: 'WHEEL', step: 4, label: 'Wheel Explorer', shortLabel: 'Wheel' },
  { id: 'LEARNING_PATH', step: 5, label: 'Learning Plan', shortLabel: 'Learning Plan' }
];

export default function App() {
  // 1. STATE MACHINE ROUTER STATE
  // Unified Flow: WELCOME ➔ ASSESSMENT (or) WHEEL ➔ RESULTS ➔ WHEEL ➔ LEARNING_PATH
  const [screen, setScreen] = useState('WELCOME');
  const [selectedTier, setSelectedTier] = useState('ic');
  const [visitedStages, setVisitedStages] = useState({});

  // 2. WHEEL EXPLORATION STATE
  const [competencyPaths, setCompetencyPaths] = useState([]);
  const [isMultiSelect, setIsMultiSelect] = useState(true);

  // 3. ASSESSMENT RESULTS STATE
  const [assessmentResults, setAssessmentResults] = useState(null);
  const [assessmentKey, setAssessmentKey] = useState(0);

  // 4. USER & MODALS STATE
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNarrowViewport, setIsNarrowViewport] = useState(false);
  const [dismissNarrowNotice, setDismissNarrowNotice] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    confirmColor: 'bg-[#B23267]',
    onConfirm: () => {}
  });
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  const [frameworkVersion, setFrameworkVersion] = useState(0);

  // Track visited stages whenever screen changes
  useEffect(() => {
    if (screen !== 'WELCOME') {
      setVisitedStages(prev => ({ ...prev, [screen]: true }));
    }
  }, [screen]);

  // Track viewport width for narrow screen advisory
  useEffect(() => {
    const checkViewport = () => {
      setIsNarrowViewport(window.innerWidth < 1024);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport, { passive: true });
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // 1. Dynamic Framework Hydration & 2. Active Session (Authenticated report history only)
  useEffect(() => {
    async function initApp() {
      try {
        const [frameworkRows, interventionRows] = await Promise.all([
          fetchAllFrameworks(),
          fetchAllInterventions()
        ]);
        let didHydrate = false;
        if (frameworkRows && frameworkRows.length > 0) {
          didHydrate = applyHydratedFramework(frameworkRows) || didHydrate;
        }
        if (interventionRows && interventionRows.length > 0) {
          didHydrate = applyHydratedInterventions(interventionRows) || didHydrate;
        }
        if (didHydrate) {
          setFrameworkVersion(v => v + 1);
        }
      } catch (err) {
        console.warn('Framework/Interventions hydration error:', err);
      }

      try {
        const activeUser = await getCurrentUser();
        if (activeUser) {
          setUser(activeUser);
          const latestResult = await fetchLatestAssessmentResult(activeUser.id);
          if (latestResult && VALID_TIERS.has(latestResult.tier)) {
            setAssessmentResults(latestResult);
            setSelectedTier(latestResult.tier);
          }
        }
      } catch (err) {
        console.warn('User initialization error:', err);
      }
    }
    initApp();
  }, []);

  const handleRequestSignOut = () => {
    setIsSignOutModalOpen(true);
  };

  const handleConfirmSignOut = async ({ deleteData }) => {
    if (deleteData && user?.id) {
      await deleteUserData(user.id);
      setAssessmentResults(null);
      setCompetencyPaths([]);
      setVisitedStages({});
    } else {
      await signOutUser();
      setAssessmentResults(null);
    }
    setUser(null);
    setIsSignOutModalOpen(false);
    setScreen('WELCOME');
  };

  // --- TRANSITION & AUTH HANDLERS --- //

  const handleUserLogin = async (userData) => {
    setUser(userData);
    if (userData?.id) {
      try {
        if (assessmentResults) {
          await saveAssessmentResult({
            tier: assessmentResults.tier || selectedTier,
            scores: assessmentResults.scores,
            strengths: assessmentResults.strengths,
            focusAreas: assessmentResults.focusAreas,
            bypassLog: assessmentResults.bypassLog,
            profileId: userData.id
          });
        } else {
          const latest = await fetchLatestAssessmentResult(userData.id, selectedTier) || await fetchLatestAssessmentResult(userData.id);
          if (latest && VALID_TIERS.has(latest.tier)) {
            setAssessmentResults(latest);
            setSelectedTier(latest.tier);
          }
        }
      } catch (e) {
        console.warn('Could not sync assessment on login:', e);
      }
    }
  };

  const handleSelectTier = async (tierId, clearSelections = false) => {
    const safeTier = VALID_TIERS.has(tierId) ? tierId : 'ic';
    if (clearSelections && safeTier !== selectedTier) {
      setCompetencyPaths([]);
    }
    setSelectedTier(safeTier);

    // Authenticated users: check saved report for the newly selected tier
    if (user?.id) {
      try {
        const tierResult = await fetchLatestAssessmentResult(user.id, safeTier);
        setAssessmentResults(tierResult || null);
      } catch (e) {
        // ignore
      }
    } else if (assessmentResults && assessmentResults.tier !== safeTier) {
      setAssessmentResults(null);
    }
  };

  const handleStartAssessment = () => {
    setCompetencyPaths([]);
    setAssessmentResults(null);
    setVisitedStages({ ASSESSMENT: true });
    setAssessmentKey(prev => prev + 1);
    setScreen('ASSESSMENT');
  };

  const requestAssessmentRestart = ({ destination = 'WELCOME' } = {}) => {
    const isInProgressRestart = destination === 'ASSESSMENT';
    setConfirmModal({
      isOpen: true,
      title: isInProgressRestart ? 'Restart Assessment?' : 'Restart Session?',
      message: isInProgressRestart
        ? 'This will reset your current answers and restart this assessment from question 1.'
        : 'This will reset your current answers and selections and return you to the Welcome screen.',
      confirmText: isInProgressRestart ? 'Restart Assessment' : 'Restart Session',
      confirmColor: 'bg-[#B23267]',
      onConfirm: () => {
        setCompetencyPaths([]);
        setAssessmentResults(null);
        setVisitedStages(isInProgressRestart ? { ASSESSMENT: true } : {});
        setAssessmentKey(prev => prev + 1);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        setScreen(isInProgressRestart ? 'ASSESSMENT' : 'WELCOME');
      }
    });
  };

  const handleRetakeAssessment = () => {
    requestAssessmentRestart({ destination: 'WELCOME' });
  };

  const handleRequestInProgressRestart = () => {
    requestAssessmentRestart({ destination: 'ASSESSMENT' });
  };

  const handleExploreWheelDirectly = () => {
    setScreen('WHEEL');
  };

  const handleAssessmentComplete = async (results) => {
    setAssessmentResults(results);
    setScreen('RESULTS');

    if (user?.id) {
      try {
        await saveAssessmentResult({
          tier: results.tier,
          scores: results.scores,
          strengths: results.strengths,
          focusAreas: results.focusAreas,
          bypassLog: results.bypassLog,
          profileId: user.id
        });
      } catch (err) {
        console.error('Failed to update Supabase with assessment results:', err);
      }
    }
  };

  const populateWheelFromFocusAreas = () => {
    if (assessmentResults?.focusAreas && assessmentResults.focusAreas.length > 0) {
      const paths = assessmentResults.focusAreas
        .map(areaName => getPathForCompetency(areaName, selectedTier))
        .filter(Boolean);
      setCompetencyPaths(paths);
    }
  };

  const handleContinueToWheelWithFocus = () => {
    populateWheelFromFocusAreas();
    setScreen('WHEEL');
  };

  const handleClearAllSelections = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Clear All Selections',
      message: 'Are you sure you want to clear all selected competencies?',
      confirmText: 'Clear All',
      confirmColor: 'bg-[#B23267]',
      onConfirm: () => {
        setCompetencyPaths([]);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Stepper stage unlock logic
  const totalSelections = competencyPaths.length;
  const isStageUnlocked = (stageId) => {
    if (stageId === 'WELCOME') return true;
    if (stageId === screen) return true;
    if (visitedStages[stageId]) return true;
    if (stageId === 'ASSESSMENT') return true;
    if (stageId === 'RESULTS') return Boolean(assessmentResults);
    if (stageId === 'WHEEL') return Boolean(assessmentResults) || totalSelections > 0;
    if (stageId === 'LEARNING_PATH') return totalSelections > 0 || Boolean(assessmentResults);
    return false;
  };

  const handleStepperClick = (stageId) => {
    if (!isStageUnlocked(stageId) || stageId === screen) return;
    if (stageId === 'ASSESSMENT' && (screen === 'RESULTS' || screen === 'WHEEL' || screen === 'LEARNING_PATH')) {
      requestAssessmentRestart({ destination: 'WELCOME' });
      return;
    }
    if (stageId === 'ASSESSMENT') {
      handleStartAssessment();
      return;
    }
    if (stageId === 'WHEEL' && screen === 'RESULTS' && totalSelections === 0) {
      populateWheelFromFocusAreas();
    }
    if (stageId === 'LEARNING_PATH' && screen === 'RESULTS' && totalSelections === 0) {
      populateWheelFromFocusAreas();
    }
    setScreen(stageId);
  };

  const activeTierBrandColor = TIER_BRAND_COLORS[selectedTier] || TIER_BRAND_COLORS.ic;
  const currentStageObj = STEPPER_STAGES.find(s => s.id === screen) || STEPPER_STAGES[0];

  // Toggle html/body scroll unconstraining when on Learning Path screen
  useEffect(() => {
    if (screen === 'LEARNING_PATH') {
      document.documentElement.classList.add('screen-learning-path');
      document.body.classList.add('screen-learning-path');
      window.scrollTo(0, 0);
    } else {
      document.documentElement.classList.remove('screen-learning-path');
      document.body.classList.remove('screen-learning-path');
    }
    return () => {
      document.documentElement.classList.remove('screen-learning-path');
      document.body.classList.remove('screen-learning-path');
    };
  }, [screen]);

  return (
    <div className={`flex flex-col bg-white text-[#2A2A2A] font-sans selection:bg-rose-100 selection:text-rose-900 ${
      screen === 'LEARNING_PATH'
        ? 'min-h-screen h-auto overflow-visible bg-slate-50/50'
        : 'h-screen max-h-screen overflow-hidden'
    }`}>
      
      {/* NARROW VIEWPORT ADVISORY SCREEN */}
      {isNarrowViewport && !dismissNarrowNotice && (
        <NarrowViewportNotice onDismiss={() => setDismissNarrowNotice(true)} />
      )}

      {/* GLOBAL HEADER */}
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shrink-0 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
          
          {/* Left: App Icon & Clickable Title (Title shown only on WELCOME screen) */}
          <button
            type="button"
            onClick={() => setScreen('WELCOME')}
            className="flex items-center gap-2.5 cursor-pointer select-none text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B23267] rounded-xl p-1 -ml-1 shrink-0"
            title="Return to Welcome Launchpad"
            aria-label="Return to Welcome Launchpad"
          >
            <ThreeColorPieIcon size={26} />
            {screen === 'WELCOME' && (
              <span className="text-base sm:text-lg font-heading text-[#2A2A2A] group-hover:text-[#B23267] transition-colors leading-none tracking-tight">
                Competency Explorer
              </span>
            )}
          </button>

          {/* Center: Responsive 5-Stage Progress Stepper (Shown on non-WELCOME screens) */}
          {screen !== 'WELCOME' && (
            <nav aria-label="Assessment and exploration progress" className="flex items-center">
              {/* Desktop Stepper (>= 768px) */}
              <ol className="hidden md:flex items-center gap-1 bg-[#F5F5F7] p-1 rounded-2xl border border-slate-200/80">
                {STEPPER_STAGES.map((stage) => {
                  const isActive = screen === stage.id;
                  const unlocked = isStageUnlocked(stage.id);

                  return (
                    <li key={stage.id}>
                      <button
                        type="button"
                        disabled={!unlocked}
                        onClick={() => handleStepperClick(stage.id)}
                        aria-current={isActive ? 'step' : undefined}
                        style={isActive ? { backgroundColor: activeTierBrandColor } : undefined}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B23267] ${
                          isActive
                            ? 'text-white shadow-xs cursor-default'
                            : unlocked
                              ? 'text-slate-700 hover:bg-white hover:text-[#2A2A2A] cursor-pointer'
                              : 'text-slate-500 opacity-55 cursor-not-allowed'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : unlocked
                                ? 'bg-slate-200 text-slate-700'
                                : 'bg-slate-200/70 text-slate-500'
                          }`}
                        >
                          {stage.step}
                        </span>
                        <span>{stage.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>

              {/* Compact Mobile Stepper (< 768px) */}
              <div className="flex md:hidden items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F5F7] border border-slate-200 text-xs font-semibold text-slate-700">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: activeTierBrandColor }}
                />
                <span>
                  Step {currentStageObj.step} of {STEPPER_STAGES.length}: {currentStageObj.shortLabel}
                </span>
              </div>
            </nav>
          )}

          {/* Right: Auth Status */}
          <div className="flex items-center gap-2.5 shrink-0">
            {user ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="font-semibold text-slate-800 max-w-[120px] truncate">{user.displayName}</span>
                <button
                  type="button"
                  onClick={handleRequestSignOut}
                  className="text-xs text-slate-600 hover:text-rose-700 hover:underline ml-1 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B23267] rounded"
                  title="Sign Out"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="btn-secondary py-1.5 px-3.5 text-xs flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B23267]"
              >
                <LogIn size={14} className="text-[#B23267]" />
                <span>Sign in or Join</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* MAIN STATE MACHINE BODY */}
      <main className={`flex-1 flex flex-col ${
        screen === 'LEARNING_PATH'
          ? 'w-full overflow-visible p-0'
          : 'min-h-0 max-w-7xl w-full mx-auto p-2.5 sm:p-4 overflow-hidden'
      }`}>
        
        {/* STATE 1: UNIFIED WELCOME & TIER SELECT LAUNCHPAD */}
        {screen === 'WELCOME' && (
          <WelcomeScreen
            selectedTier={selectedTier}
            hasSavedResults={Boolean(user && assessmentResults && assessmentResults.tier === selectedTier)}
            onSelectTier={(tierId) => handleSelectTier(tierId, true)}
            onStartAssessment={handleStartAssessment}
            onExploreWheel={handleExploreWheelDirectly}
            onViewSavedResults={() => setScreen('RESULTS')}
          />
        )}

        {/* STATE 2: IPSATIVE ASSESSMENT SCREEN */}
        {screen === 'ASSESSMENT' && (
          <AssessmentScreen
            key={`assessment-${selectedTier}-${assessmentKey}`}
            tier={selectedTier}
            onComplete={handleAssessmentComplete}
            onBack={() => setScreen('WELCOME')}
            onRestart={handleRequestInProgressRestart}
          />
        )}

        {/* STATE 3: RESULTS REPORT SCREEN */}
        {screen === 'RESULTS' && (
          <ResultsScreen
            key={`results-${selectedTier}-${frameworkVersion}`}
            results={assessmentResults}
            user={user}
            onContinueToWheel={handleContinueToWheelWithFocus}
            onViewLearningPath={() => {
              populateWheelFromFocusAreas();
              setScreen('LEARNING_PATH');
            }}
            onRetake={handleRetakeAssessment}
          />
        )}

        {/* STATE 4: INTERACTIVE WHEEL VIEW */}
        {screen === 'WHEEL' && (
          <div key={`wheel-grid-${selectedTier}-${frameworkVersion}`} className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch animate-in fade-in duration-300 overflow-hidden">
            <Wheel
              competencyPaths={competencyPaths}
              setCompetencyPaths={setCompetencyPaths}
              isMultiSelect={isMultiSelect}
              selectedTier={selectedTier}
            />

            <DefinitionsPanel
              competencyPaths={competencyPaths}
              setCompetencyPaths={setCompetencyPaths}
              isMultiSelect={isMultiSelect}
              setIsMultiSelect={setIsMultiSelect}
              onExploreLearningPath={() => setScreen('LEARNING_PATH')}
              onRequestClearAll={handleClearAllSelections}
            />
          </div>
        )}

        {/* STATE 5: 70-20-10 LEARNING PATH VIEW */}
        {screen === 'LEARNING_PATH' && (
          <LearningPathView
            key={`learning-path-${selectedTier}-${frameworkVersion}`}
            competencies={competencyPaths}
            assessmentResults={assessmentResults}
            selectedTier={selectedTier}
            user={user}
            onBackToWheel={() => setScreen('WHEEL')}
            onBackToResults={assessmentResults ? () => setScreen('RESULTS') : null}
            onRetakeAssessment={handleRetakeAssessment}
          />
        )}

      </main>

      {/* GLOBAL FOOTER (Rendered on all pages, hidden in print) */}
      <BrandFooter />

      {/* AUTHENTICATION MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleUserLogin}
      />

      {/* CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        confirmColor={confirmModal.confirmColor}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />

      {/* SIGN OUT & DELETE DATA MODAL */}
      <SignOutModal
        isOpen={isSignOutModalOpen}
        user={user}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={handleConfirmSignOut}
      />

    </div>
  );
}
