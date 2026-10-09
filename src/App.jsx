import React, { useState } from 'react';
import { ExternalLink, ArrowLeft, RotateCcw } from 'lucide-react';
import { ThreeColorPieIcon } from './components/ThreeColorPieIcon.jsx';
import { WelcomeScreen } from './components/WelcomeScreen.jsx';
import { TierSelectScreen } from './components/TierSelectScreen.jsx';
import { AssessmentScreen } from './components/AssessmentScreen.jsx';
import { ResultsScreen } from './components/ResultsScreen.jsx';
import { Wheel } from './components/Wheel.jsx';
import { DefinitionsPanel } from './components/DefinitionsPanel.jsx';
import { ConfirmationModal } from './components/ConfirmationModal.jsx';
import { BrandFooter } from './components/BrandFooter.jsx';

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

  // 4. USER & MODALS STATE
  const [user, setUser] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    confirmColor: 'bg-rose-700',
    onConfirm: () => {}
  });

  // --- TRANSITION HANDLERS --- //

  const handleStartFromWelcome = () => {
    setScreen('TIER_SELECT');
  };

  const handleSelectTier = (tierId) => {
    setSelectedTier(tierId);
    if (tierId === 'values') {
      setActiveMode('values');
    } else {
      setActiveMode('competencies');
    }
  };

  const handleStartAssessment = () => {
    setScreen('ASSESSMENT');
  };

  const handleExploreWheelDirectly = () => {
    setScreen('WHEEL');
  };

  const handleAssessmentComplete = (results) => {
    setAssessmentResults(results);
    setScreen('RESULTS');
  };

  const handleContinueToWheelWithFocus = () => {
    // If we have focus areas from the results, inject them into paths!
    if (assessmentResults?.focusAreas && assessmentResults.focusAreas.length > 0) {
      // Set the initial paths to the focus areas
      const tierPrefix = selectedTier === 'values' ? 'values' : 'competencies';
      // Switch to Wheel state in Focused Mode
    }
    setScreen('WHEEL');
  };

  const handleClearAllSelections = () => {
    setConfirmModal({
      isOpen: true,
      title: "Clear All Selections",
      message: "Are you sure you want to clear all selected competencies and values?",
      confirmText: "Clear All",
      confirmColor: "bg-rose-700",
      onConfirm: () => {
        setCompetencyPaths([]);
        setValuesPaths([]);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-charcoal font-sans selection:bg-rose-100 selection:text-rose-900">
      
      {/* GLOBAL HEADER */}
      <header className="w-full bg-white/95 border-b border-slate-200 sticky top-0 z-40 no-print backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Logo & Tool Title */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => setScreen('WELCOME')}
          >
            <ThreeColorPieIcon size={26} />
            <h1 className="text-base sm:text-lg font-heading text-charcoal leading-none tracking-tight">
              Competency and Values Wheel
            </h1>
          </div>

          {/* Right Header Navigation & Actions */}
          <div className="flex items-center gap-3">
            {screen === 'WHEEL' && (
              <button
                onClick={() => setScreen('TIER_SELECT')}
                className="py-1.5 px-3 rounded-lg text-xs font-bold text-slate-600 hover:text-charcoal bg-cloud hover:bg-slate-200 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw size={13} />
                <span>Change Tier</span>
              </button>
            )}

            <a
              href="https://www.mslilymckay.com"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
            >
              <span>Contact Me</span>
              <ExternalLink size={14} />
            </a>
          </div>

        </div>
      </header>

      {/* MAIN STATE MACHINE BODY */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col">
        
        {/* STATE 1: WELCOME SCREEN */}
        {screen === 'WELCOME' && (
          <WelcomeScreen
            onContinueAsGuest={handleStartFromWelcome}
            onLogin={(userData) => {
              setUser(userData);
              handleStartFromWelcome();
            }}
          />
        )}

        {/* STATE 2: TIER SELECT SCREEN */}
        {screen === 'TIER_SELECT' && (
          <TierSelectScreen
            onSelectTier={handleSelectTier}
            onStartAssessment={handleStartAssessment}
            onExploreWheel={handleExploreWheelDirectly}
            onBack={() => setScreen('WELCOME')}
          />
        )}

        {/* STATE 3: IPSATIVE ASSESSMENT SCREEN */}
        {screen === 'ASSESSMENT' && (
          <AssessmentScreen
            tier={selectedTier}
            onComplete={handleAssessmentComplete}
            onBack={() => setScreen('TIER_SELECT')}
          />
        )}

        {/* STATE 4: RESULTS REPORT SCREEN */}
        {screen === 'RESULTS' && (
          <ResultsScreen
            results={assessmentResults}
            onContinueToWheel={handleContinueToWheelWithFocus}
            onRetake={() => setScreen('ASSESSMENT')}
          />
        )}

        {/* STATE 5: INTERACTIVE WHEEL VIEW */}
        {screen === 'WHEEL' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch animate-in fade-in duration-300">
            <Wheel
              activeMode={activeMode}
              setActiveMode={setActiveMode}
              competencyPaths={competencyPaths}
              setCompetencyPaths={setCompetencyPaths}
              valuesPaths={valuesPaths}
              setValuesPaths={setValuesPaths}
              isMultiSelect={isMultiSelect}
              initialFocusAreas={assessmentResults?.focusAreas}
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
              onRequestClearAll={handleClearAllSelections}
            />
          </div>
        )}

      </main>

      {/* FOOTER (Shown on all pages except Wheel) */}
      {screen !== 'WHEEL' && <BrandFooter />}

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

    </div>
  );
}
