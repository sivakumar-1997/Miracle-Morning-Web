import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Flame, CheckCircle2, Moon, Calendar, Share2, BookOpen } from 'lucide-react';
import { UserProfile } from '../../types';

interface Stage6Props {
  userProfile: UserProfile;
  onOpenEvening: () => void;
  onOpenStreak: () => void;
  onOpenBooks: () => void;
}

export const Stage6Completion: React.FC<Stage6Props> = ({
  userProfile,
  onOpenEvening,
  onOpenStreak,
  onOpenBooks,
}) => {
  useEffect(() => {
    // Fire celebratory confetti on arrival
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#059669', '#34d399', '#f59e0b', '#06b6d4'],
      });
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn text-center">
      {/* Celebration Icon & Banner */}
      <div className="space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 p-1 mx-auto shadow-xl flex items-center justify-center">
          <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center text-emerald-700">
            <Sparkles className="w-10 h-10 animate-bounce" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
          Stage 6 • Miracle Morning Complete
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold font-heading text-emerald-950">
          Your Sacred Morning Has Been Anchored
        </h2>

        <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto font-sans leading-relaxed">
          You have successfully aligned your biofield through ancient Brahma Muhurtha wisdom, sacred chakra sound therapy,
          sacred Ho&apos;oponopono prayer, water manifestation, and 10 magical blessings.
        </p>
      </div>

      {/* Streak Achievement Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/30 text-left">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Flame className="w-8 h-8 fill-amber-500" />
            </div>
            <div>
              <div className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                Conscious Practice Streak
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-heading">
                {userProfile.currentStreak} {userProfile.currentStreak === 1 ? 'Day' : 'Days'} Consecutive
              </div>
              <p className="text-xs text-stone-300">
                Magic Curriculum: Day {userProfile.magicDayNumber} of 28
              </p>
            </div>
          </div>

          <button
            onClick={onOpenStreak}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold transition-all cursor-pointer text-white"
          >
            View Streak Calendar
          </button>
        </div>

        {/* 5 Stages Completed Checklist */}
        <div className="mt-6 pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Brahma Muhurtha Intention Declared</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>7 Chakras Sound Frequency Cleansed</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Sacred Ho&apos;oponopono Prayer Recited</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>7 Sips of Blessed Masaru Emoto Water</span>
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Word of the Day Anchored &amp; 10 Magic Blessings Sealed</span>
          </div>
        </div>
      </div>

      {/* Bridge to Evening Magic (As requested: instructions on the evening magic book) */}
      <div className="bg-emerald-50 rounded-3xl p-6 sm:p-8 border border-emerald-200 text-left space-y-4">
        <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-teal-800">
          <Moon className="w-4 h-4 text-teal-700" />
          The Evening Magic Practice (Rhonda Byrne)
        </div>

        <h3 className="text-xl font-bold font-heading text-emerald-950">
          Tonight: Prepare for The Magic Rock &amp; Night Recall
        </h3>

        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
          Remember what Rhonda Byrne specifies in <em>The Magic</em>:
          At night, hold your <strong>Magic Rock</strong>, recall the best single blessing that occurred today,
          and listen to the soothing evening theta frequency so your subconscious mind works on tomorrow&apos;s gratitude while you sleep.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenEvening}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-semibold shadow-md transition-all cursor-pointer"
          >
            <Moon className="w-4 h-4" />
            <span>Open Evening Magic Sanctuary</span>
          </button>

          <button
            onClick={onOpenBooks}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 text-xs sm:text-sm font-medium transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>Browse Reference Library</span>
          </button>
        </div>
      </div>
    </div>
  );
};
