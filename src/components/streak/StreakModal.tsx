import React from 'react';
import { X, Flame, Award, Calendar, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../../types';
import { MAGIC_28_DAYS } from '../../data/magicCurriculum';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
}

export const StreakModal: React.FC<StreakModalProps> = ({
  isOpen,
  onClose,
  userProfile,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-emerald-900/10 max-h-[92vh] flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="streak-modal-title"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 flex items-center justify-between gap-4 bg-gradient-to-r from-amber-600 via-emerald-700 to-teal-800 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-300">
              <Flame className="w-7 h-7 fill-amber-300" />
            </div>
            <div>
              <h3 id="streak-modal-title" className="text-xl font-bold font-heading">
                Conscious Practice Streak
              </h3>
              <p className="text-xs text-emerald-100">
                Daily spiritual discipline rewires neural pathways through repetition
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close Streak Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Current Streak
              </div>
              <div className="text-3xl font-extrabold text-amber-950 font-heading mt-1">
                {userProfile.currentStreak}
              </div>
              <div className="text-[11px] text-amber-700 mt-0.5">Consecutive Days</div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Longest Streak
              </div>
              <div className="text-3xl font-extrabold text-emerald-950 font-heading mt-1">
                {userProfile.longestStreak}
              </div>
              <div className="text-[11px] text-emerald-700 mt-0.5">Personal Best</div>
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 text-center">
              <div className="text-xs font-bold uppercase tracking-wider text-teal-800">
                Magic Cycle
              </div>
              <div className="text-3xl font-extrabold text-teal-950 font-heading mt-1">
                {userProfile.magicDayNumber}
                <span className="text-xs text-teal-700 font-normal">/28</span>
              </div>
              <div className="text-[11px] text-teal-700 mt-0.5">Current Day</div>
            </div>
          </div>

          {/* 28-Day Magic Curriculum Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                28-Day Magic Journey Matrix
              </h4>
              <span className="text-[11px] text-stone-500">
                Loops automatically right after Day 28
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {MAGIC_28_DAYS.map((plan) => {
                const isCurrent = userProfile.magicDayNumber === plan.day;
                const isPast = plan.day < userProfile.magicDayNumber;

                return (
                  <div
                    key={plan.day}
                    className={`p-2 rounded-xl text-center border transition-all ${
                      isCurrent
                        ? 'bg-emerald-800 text-white border-emerald-900 shadow-md font-bold scale-105 ring-2 ring-emerald-500/30'
                        : isPast
                        ? 'bg-emerald-100/70 text-emerald-900 border-emerald-200'
                        : 'bg-stone-50 text-stone-500 border-stone-200'
                    }`}
                    title={`Day ${plan.day}: ${plan.title}`}
                  >
                    <div className="text-[10px] opacity-75">Day</div>
                    <div className="text-sm font-bold font-mono">{plan.day}</div>
                    <div className="text-[9px] line-clamp-1 mt-0.5 font-medium">
                      {isCurrent ? 'Today' : isPast ? 'Done ✓' : plan.title.split(' ')[0]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Neuroscience & Habit Anchor Note */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-2 leading-relaxed">
            <div className="font-bold text-emerald-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              The Science of Consecutive Repetition
            </div>
            <p>
              As Dr. Norman Doidge (<em>The Brain That Changes Itself</em>) and Dr. Joe Dispenza reveal,
              synaptic connections that fire together, wire together. Maintaining a conscious consecutive streak
              dissolves old stress ruts in the amygdala, making gratitude your natural subconscious operating system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
