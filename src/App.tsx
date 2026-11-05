import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StageProgressBar } from './components/StageProgressBar';
import { Stage1BrahmaMuhurtha } from './components/stages/Stage1BrahmaMuhurtha';
import { Stage2ChakraCleansing } from './components/stages/Stage2ChakraCleansing';
import { Stage3Hooponopono } from './components/stages/Stage3Hooponopono';
import { Stage4WaterAlchemy } from './components/stages/Stage4WaterAlchemy';
import { Stage5MagicBlessings } from './components/stages/Stage5MagicBlessings';
import { Stage6Completion } from './components/stages/Stage6Completion';
import { EveningMagicView } from './components/evening/EveningMagicView';
import { BooksLibraryModal } from './components/library/BooksLibraryModal';
import { AuthModal } from './components/auth/AuthModal';
import { StreakModal } from './components/streak/StreakModal';
import { UserProfile } from './types';
import {
  loadStoredProfile,
  saveStoredProfile,
  updateStreakRecord,
  formatDateKey,
} from './utils/streakManager';
import { getSupabaseCredentials } from './utils/supabaseClient';

export default function App() {
  const [activeMode, setActiveMode] = useState<'morning' | 'evening'>('morning');
  const [morningStage, setMorningStage] = useState<number>(1);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => loadStoredProfile());

  // Modals
  const [isBooksOpen, setIsBooksOpen] = useState<boolean>(false);
  const [isStreakOpen, setIsStreakOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  const { isConfigured: isSupabaseConfigured } = getSupabaseCredentials();

  // Load completed stages for today from storage if available
  useEffect(() => {
    const today = formatDateKey();
    const stored = localStorage.getItem(`morning_miracles_stages_${today}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCompletedStages(parsed);
        }
      } catch {
        // fallback
      }
    }
  }, []);

  const markStageComplete = (stageNumber: number) => {
    setCompletedStages((prev) => {
      const updated = prev.includes(stageNumber) ? prev : [...prev, stageNumber];
      const today = formatDateKey();
      try {
        localStorage.setItem(`morning_miracles_stages_${today}`, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleStageComplete = (current: number) => {
    markStageComplete(current);
    if (current < 6) {
      setMorningStage(current + 1);
    }

    // When reaching stage 6, update user streak
    if (current === 5) {
      const { profile } = updateStreakRecord(userProfile, formatDateKey());
      setUserProfile(profile);
      saveStoredProfile(profile);
      markStageComplete(6);
      setMorningStage(6);
    }
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    saveStoredProfile(newProfile);
  };

  return (
    <div className="min-h-screen bg-[#f7faf7] text-[#1e2923] flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Header */}
      <Header
        activeMode={activeMode}
        onModeChange={setActiveMode}
        userProfile={userProfile}
        onOpenBooks={() => setIsBooksOpen(true)}
        onOpenStreak={() => setIsStreakOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        isSupabaseConfigured={isSupabaseConfigured}
      />

      {/* Main Content Area */}
      {activeMode === 'morning' ? (
        <>
          {/* Progress Stepper for the 6 Morning Stages */}
          <StageProgressBar
            currentStage={morningStage}
            onSelectStage={(stage) => setMorningStage(stage)}
            completedStages={completedStages}
          />

          <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            {morningStage === 1 && (
              <Stage1BrahmaMuhurtha onComplete={() => handleStageComplete(1)} />
            )}
            {morningStage === 2 && (
              <Stage2ChakraCleansing onComplete={() => handleStageComplete(2)} />
            )}
            {morningStage === 3 && (
              <Stage3Hooponopono onComplete={() => handleStageComplete(3)} />
            )}
            {morningStage === 4 && (
              <Stage4WaterAlchemy onComplete={() => handleStageComplete(4)} />
            )}
            {morningStage === 5 && (
              <Stage5MagicBlessings
                userProfile={userProfile}
                onComplete={() => handleStageComplete(5)}
              />
            )}
            {morningStage === 6 && (
              <Stage6Completion
                userProfile={userProfile}
                onOpenEvening={() => setActiveMode('evening')}
                onOpenStreak={() => setIsStreakOpen(true)}
                onOpenBooks={() => setIsBooksOpen(true)}
              />
            )}
          </main>
        </>
      ) : (
        /* Evening Magic Sanctuary */
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <EveningMagicView
            userProfile={userProfile}
            onSwitchToMorning={() => setActiveMode('morning')}
            onOpenBooks={() => setIsBooksOpen(true)}
          />
        </main>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-emerald-900/10 bg-white/70 py-6 px-4 text-center text-xs text-stone-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-heading font-semibold text-emerald-950">Morning Miracles</span>
            <span>•</span>
            <span>Vedic Dawn Wisdom, 7 Chakras, Ho&apos;oponopono &amp; 28-Day Magic</span>
          </div>

          <div className="flex items-center gap-4 text-stone-600">
            <button
              onClick={() => setIsBooksOpen(true)}
              className="hover:text-emerald-800 underline cursor-pointer"
            >
              References &amp; Books
            </button>
            <button
              onClick={() => setIsStreakOpen(true)}
              className="hover:text-emerald-800 underline cursor-pointer"
            >
              Streak Tracker
            </button>
            <button
              onClick={() => setIsAuthOpen(true)}
              className="hover:text-emerald-800 underline cursor-pointer"
            >
              Supabase / Vercel
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BooksLibraryModal isOpen={isBooksOpen} onClose={() => setIsBooksOpen(false)} />
      <StreakModal
        isOpen={isStreakOpen}
        onClose={() => setIsStreakOpen(false)}
        userProfile={userProfile}
      />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={handleUpdateProfile}
      />
    </div>
  );
}
