import React, { useState, useEffect } from 'react';
import { ExternalLink, RotateCcw, ArrowLeft } from 'lucide-react';
import { ThreeColorPieIcon } from './components/ThreeColorPieIcon.jsx';
import { WelcomeScreen } from './components/WelcomeScreen.jsx';
import { TierSelectScreen } from './components/TierSelectScreen.jsx';
import { AssessmentScreen } from './components/AssessmentScreen.jsx';
import { ResultsScreen } from './components/ResultsScreen.jsx';
import { Wheel } from './components/Wheel.jsx';
import { DefinitionsPanel } from './components/DefinitionsPanel.jsx';
import { LearningPathView } from './components/LearningPathView.jsx';
import { ConfirmationModal } from './components/ConfirmationModal.jsx';
import { SignOutModal } from './components/SignOutModal.jsx';
import { BrandFooter } from './components/BrandFooter.jsx';
import { NarrowViewportNotice } from './components/NarrowViewportNotice.jsx';
import { getPathForCompetency, applyHydratedFramework } from './lib/wheelTheme.js';
import { 
  getCurrentUser, 
  signOutUser, 
  deleteUserData,
  saveAssessmentResult, 
  fetchAllFrameworks, 
  fetchLatestAssessmentResult 
} from './lib/supabaseClient.js';

export default function App() {
  // 1. STATE MACHINE ROUTER STATE
  // Flow: WELCOME ➔ TIER_SELECT ➔ ASSESSMENT (or) WHEEL ➔ RESULTS ➔ WHEEL
  const [screen, setScreen] = useState('WELCOME');
  const [selectedTier, setSelectedTier] = useState('ic');

  // 2. WHEEL EXPLORATION STATE
  const [activeMode, setActiveMode] = useState('competencies');
  const [competencyPaths, setCompetencyPaths] = useState([]);
  const [valuesPaths, setValuesPaths] = useState([]);
  const [isMultiSelect, setIsMultiSelect] = useState(true);

  // 3. ASSESSMENT RESULTS STATE
  const [assessmentResults, setAssessmentResults] = useState(null);
  const [assessmentKey, setAssessmentKey] = useState(0);

  // 4. USER & MODALS STATE
  const [user, setUser] = useState(null);
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

  // Track viewport width for narrow screen advisory
  useEffect(() => {
    const checkViewport = () => {
      setIsNarrowViewport(window.innerWidth < 1024);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport, { passive: true });
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // 1. Dynamic Framework Hydration & 2. Active Session / Option A Latest Assessment
  useEffect(() => {
    async function initApp() {
      // 1. Dynamic Hydration of Framework from Supabase
      try {
        const rows = await fetchAllFrameworks();
        if (rows && rows.length > 0) {
          applyHydratedFramework(rows);
          setFrameworkVersion(v => v + 1);
        }
      } catch (err) {
        console.warn('Framework hydration error:', err);
      }

      // 2. Check active user session & load Option A latest assessment
      try {
        const activeUser = await getCurrentUser();
        if (activeUser) {
          setUser(activeUser);
          const latestResult = await fetchLatestAssessmentResult(activeUser.id);
          if (latestResult) {
            setAssessmentResults(latestResult);
            if (latestResult.tier) {
              setSelectedTier(latestResult.tier);
            }
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
      setValuesPaths([]);
    } else {
      await signOutUser();
    }
    setUser(null);
    setIsSignOutModalOpen(false);
    setScreen('WELCOME');
  };

  // --- TRANSITION HANDLERS --- //

  const handleStartFromWelcome = () => {
    setScreen('TIER_SELECT');
  };

  const handleUserLogin = async (userData) => {
    setUser(userData);
    if (userData?.id) {
      try {
        const latest = await fetchLatestAssessmentResult(userData.id);
        if (latest) {
          setAssessmentResults(latest);
          if (latest.tier) {
            setSelectedTier(latest.tier);
          }
        }
      } catch (e) {
        console.warn('Could not load latest assessment on login:', e);
      }
    }
    handleStartFromWelcome();
  };

  const handleSelectTier = async (tierId, clearSelections = false) => {
    if (clearSelections && tierId !== selectedTier) {
      setCompetencyPaths([]);
      setValuesPaths([]);
    }
    setSelectedTier(tierId);
    if (tierId === 'values') {
      setActiveMode('values');
    } else {
      setActiveMode('competencies');
    }

    // Option A: Check if signed-in user has a saved assessment for this specific tier
    if (user?.id) {
      try {
        const tierResult = await fetchLatestAssessmentResult(user.id, tierId);
        if (tierResult) {
          setAssessmentResults(tierResult);
        }
      } catch (e) {
        // ignore
      }
    }
  };

  const handleStartAssessment = () => {
    // Fresh assessment start: clear any previous selections & results, randomize key
    setCompetencyPaths([]);
    setValuesPaths([]);
    setAssessmentResults(null);
    setAssessmentKey(prev => prev + 1);
    setScreen('ASSESSMENT');
  };

  const handleRetakeAssessment = () => {
    // Retake assessment: clear previous selections & results, randomize key
    setCompetencyPaths([]);
    setValuesPaths([]);
    setAssessmentResults(null);
    setAssessmentKey(prev => prev + 1);
    setScreen('ASSESSMENT');
  };

  const handleRestart = () => {
    // Restart: clear selections & results, and return to Tier Select
    setCompetencyPaths([]);
    setValuesPaths([]);
    setAssessmentResults(null);
    setAssessmentKey(prev => prev + 1);
    setScreen('TIER_SELECT');
  };

  const handleBackFromWheel = () => {
    if (assessmentResults) {
      setScreen('RESULTS');
    } else {
      setScreen('TIER_SELECT');
    }
  };

  const handleExploreWheelDirectly = () => {
    setScreen('WHEEL');
  };

  const handleAssessmentComplete = async (results) => {
    setAssessmentResults(results);
    setScreen('RESULTS');

    // When signed in, update Supabase with user's results
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

  const handleContinueToWheelWithFocus = () => {
    // Port assessment focus areas directly into wheel selections & zoom to focus
    if (assessmentResults?.focusAreas && assessmentResults.focusAreas.length > 0) {
      const isValues = selectedTier === 'values';
      setActiveMode(isValues ? 'values' : 'competencies');

      const paths = assessmentResults.focusAreas
        .map(areaName => getPathForCompetency(areaName, selectedTier))
        .filter(Boolean);

      if (isValues) {
        setValuesPaths(paths);
      } else {
        setCompetencyPaths(paths);
      }
    }
    setScreen('WHEEL');
  };

  const handleClearAllSelections = () => {
    setConfirmModal({
      isOpen: true,
      title: "Clear All Selections",
      message: "Are you sure you want to clear all selected competencies and values?",
      confirmText: "Clear All",
      confirmColor: "bg-[#B23267]",
      onConfirm: () => {
        setCompetencyPaths([]);
        setValuesPaths([]);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          
          {/* Logo & Tool Title */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => setScreen('WELCOME')}
          >
            <ThreeColorPieIcon size={26} />
            <h1 className="text-base sm:text-lg font-heading text-[#2A2A2A] leading-none tracking-tight">
              Competency & Values Explorer
            </h1>
          </div>

          {/* Right Header Navigation & Actions */}
          <div className="flex items-center gap-3">
            {(screen === 'WHEEL' || screen === 'LEARNING_PATH') && (
              <>
                <button
                  onClick={() => {
                    if (screen === 'LEARNING_PATH') {
                      setScreen('WHEEL');
                    } else {
                      handleBackFromWheel();
                    }
                  }}
                  className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
                  title={screen === 'LEARNING_PATH' ? "Back to Wheel" : (assessmentResults ? "Back to Assessment Results" : "Back to Tier Select")}
                >
                  <ArrowLeft size={13} />
                  <span>Back</span>
                </button>

                <button
                  onClick={handleRestart}
                  className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
                >
                  <RotateCcw size={13} />
                  <span>Restart</span>
                </button>
              </>
            )}

            {user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-semibold text-slate-800">{user.displayName}</span>
                <button
                  onClick={handleRequestSignOut}
                  className="text-[11px] text-slate-500 hover:text-rose-600 hover:underline ml-1"
                  title="Sign Out"
                >
                  Sign Out
                </button>
              </div>
            )}

            <a
              href="https://www.mslilymckay.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary py-2 px-4 flex items-center gap-1.5"
            >
              <span>Contact Me</span>
              <ExternalLink size={14} />
            </a>
          </div>

        </div>
      </header>

      {/* MAIN STATE MACHINE BODY */}
      <main className={`flex-1 flex flex-col ${
        screen === 'LEARNING_PATH'
          ? 'w-full overflow-visible p-0'
          : 'min-h-0 max-w-7xl w-full mx-auto p-2.5 sm:p-4 overflow-hidden'
      }`}>
        
        {/* STATE 1: WELCOME SCREEN */}
        {screen === 'WELCOME' && (
          <WelcomeScreen
            user={user}
            onContinueAsGuest={handleStartFromWelcome}
            onLogin={handleUserLogin}
            onSignOut={handleRequestSignOut}
          />
        )}

        {/* STATE 2: TIER SELECT SCREEN */}
        {screen === 'TIER_SELECT' && (
          <TierSelectScreen
            selectedTier={selectedTier}
            hasSavedResults={Boolean(assessmentResults && assessmentResults.tier === selectedTier)}
            onViewSavedResults={() => setScreen('RESULTS')}
            onSelectTier={(tierId) => handleSelectTier(tierId, true)}
            onStartAssessment={handleStartAssessment}
            onExploreWheel={handleExploreWheelDirectly}
            onBack={() => setScreen('WELCOME')}
          />
        )}

        {/* STATE 3: IPSATIVE ASSESSMENT SCREEN */}
        {screen === 'ASSESSMENT' && (
          <AssessmentScreen
            key={`assessment-${selectedTier}-${assessmentKey}`}
            tier={selectedTier}
            onComplete={handleAssessmentComplete}
            onBack={() => setScreen('TIER_SELECT')}
          />
        )}

        {/* STATE 4: RESULTS REPORT SCREEN */}
        {screen === 'RESULTS' && (
          <ResultsScreen
            key={`results-${selectedTier}-${frameworkVersion}`}
            results={assessmentResults}
            user={user}
            onContinueToWheel={handleContinueToWheelWithFocus}
            onViewLearningPath={() => {
              handleContinueToWheelWithFocus();
              setScreen('LEARNING_PATH');
            }}
            onRetake={handleRetakeAssessment}
          />
        )}

        {/* STATE 5: INTERACTIVE WHEEL VIEW */}
        {screen === 'WHEEL' && (
          <div key={`wheel-grid-${selectedTier}-${frameworkVersion}`} className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch animate-in fade-in duration-300 overflow-hidden">
            <Wheel
              activeMode={activeMode}
              setActiveMode={setActiveMode}
              competencyPaths={competencyPaths}
              setCompetencyPaths={setCompetencyPaths}
              valuesPaths={valuesPaths}
              setValuesPaths={setValuesPaths}
              isMultiSelect={isMultiSelect}
              initialFocusAreas={assessmentResults?.focusAreas}
              selectedTier={selectedTier}
              onSelectTier={handleSelectTier}
            />

            <DefinitionsPanel
              activeMode={activeMode}
              setActiveMode={setActiveMode}
              competencyPaths={competencyPaths}
              setCompetencyPaths={setCompetencyPaths}
              valuesPaths={valuesPaths}
              setValuesPaths={setValuesPaths}
              isMultiSelect={isMultiSelect}
              setIsMultiSelect={setIsMultiSelect}
              onExploreLearningPath={() => setScreen('LEARNING_PATH')}
              onRequestClearAll={handleClearAllSelections}
            />
          </div>
        )}

        {/* STATE 6: 70-20-10 LEARNING PATH VIEW */}
        {screen === 'LEARNING_PATH' && (
          <LearningPathView
            competencies={competencyPaths}
            values={valuesPaths}
            assessmentResults={assessmentResults}
            selectedTier={selectedTier}
            user={user}
            onBackToWheel={() => setScreen('WHEEL')}
            onBackToResults={assessmentResults ? () => setScreen('RESULTS') : null}
            onRetakeAssessment={handleRetakeAssessment}
          />
        )}

      </main>

      {/* FOOTER (Shown on all pages except Wheel and Learning Path) */}
      {screen !== 'WHEEL' && screen !== 'LEARNING_PATH' && <BrandFooter />}

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
