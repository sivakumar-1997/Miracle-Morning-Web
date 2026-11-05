import React, { useState } from 'react';
import { Sun, Moon, BookOpen, Flame, Waves, Settings } from 'lucide-react';
import { UserProfile } from '../types';
import { audioSynth } from '../utils/audioSynthesizer';

interface HeaderProps {
  activeMode: 'morning' | 'evening';
  onModeChange: (mode: 'morning' | 'evening') => void;
  userProfile: UserProfile;
  onOpenBooks: () => void;
  onOpenStreak: () => void;
  onOpenAuth: () => void;
  isSupabaseConfigured: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeMode,
  onModeChange,
  userProfile,
  onOpenBooks,
  onOpenStreak,
  onOpenAuth,
  isSupabaseConfigured,
}) => {
  const [isAmbientPlaying, setIsAmbientPlaying] = useState<boolean>(false);

  const toggleAmbientSound = () => {
    if (isAmbientPlaying) {
      audioSynth.stopDawnAmbience();
      setIsAmbientPlaying(false);
    } else {
      audioSynth.playDawnAmbience(0.18);
      setIsAmbientPlaying(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-950/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-800 via-teal-700 to-amber-500 p-0.5 shadow-md flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-emerald-800">
              <Sun className="w-6 h-6 text-emerald-700 animate-spin-slow" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-950 font-heading">
                Miracle Mornings
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100/80 text-emerald-800 border border-emerald-300">
                28-Day Magic
              </span>
            </div>
            <p className="text-xs text-stone-500 font-sans hidden sm:block">
              Sacred Dawn Rituals &amp; Evening Subconscious Alchemy
            </p>
          </div>
        </div>

        {/* Center Mode Switcher: Morning Flow vs Evening Magic */}
        <div className="flex items-center bg-stone-100/90 p-1 rounded-2xl border border-emerald-950/10 shadow-inner">
          <button
            onClick={() => onModeChange('morning')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              activeMode === 'morning'
                ? 'bg-white text-emerald-950 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-emerald-950 hover:bg-stone-200/50'
            }`}
            aria-label="Switch to Miracle Mornings Flow"
          >
            <Sun className={`w-4 h-4 ${activeMode === 'morning' ? 'text-amber-500 fill-amber-400/30' : 'text-stone-400'}`} />
            <span>Morning Flow</span>
          </button>
          <button
            onClick={() => onModeChange('evening')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              activeMode === 'evening'
                ? 'bg-emerald-950 text-white shadow-xs font-semibold'
                : 'text-stone-600 hover:text-emerald-950 hover:bg-stone-200/50'
            }`}
            aria-label="Switch to Evening Magic Practice"
          >
            <Moon className={`w-4 h-4 ${activeMode === 'evening' ? 'text-teal-300 fill-teal-300/30' : 'text-stone-400'}`} />
            <span>Evening Magic</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Ambient Dawn Audio Atmosphere Button */}
          <button
            onClick={toggleAmbientSound}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              isAmbientPlaying
                ? 'bg-emerald-800 text-white border-emerald-700 shadow-xs'
                : 'bg-emerald-50/80 hover:bg-emerald-100 text-emerald-900 border-emerald-200'
            }`}
            title="Toggle soothing dawn stream & forest atmosphere"
            aria-label={isAmbientPlaying ? 'Stop Dawn Ambience' : 'Play Dawn Ambience'}
          >
            <Waves className={`w-4 h-4 ${isAmbientPlaying ? 'animate-pulse text-amber-300' : 'text-emerald-700'}`} />
            <span className="hidden md:inline">{isAmbientPlaying ? 'Atmosphere On' : 'Dawn Sound'}</span>
          </button>
          {/* Streak Counter */}
          <button
            onClick={onOpenStreak}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200/80 transition-all text-xs sm:text-sm font-semibold shadow-xs"
            title="View Conscious Streak & 28-Day Cycle"
            aria-label="Streak Counter"
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{userProfile.currentStreak} {userProfile.currentStreak === 1 ? 'Day' : 'Days'}</span>
            <span className="text-emerald-600/70 text-xs hidden md:inline">• Day {userProfile.magicDayNumber}/28</span>
          </button>

          {/* Reference Library */}
          <button
            onClick={onOpenBooks}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200/80 text-stone-700 border border-stone-200 transition-all text-xs sm:text-sm font-medium"
            title="Sacred Book References & Science"
            aria-label="Book References Library"
          >
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span className="hidden md:inline">Library</span>
          </button>

          {/* Settings & Configuration */}
          <button
            onClick={onOpenAuth}
            className="flex items-center justify-center p-2 rounded-lg bg-stone-100 hover:bg-stone-200/80 text-stone-700 hover:text-emerald-950 border border-stone-200 transition-all cursor-pointer"
            title="Settings & Cloud Sync"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
