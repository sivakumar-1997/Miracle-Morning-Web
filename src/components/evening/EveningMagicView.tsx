import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sparkles, Volume2, Square, BookOpen, CheckCircle2, Heart, ArrowRight } from 'lucide-react';
import { MAGIC_28_DAYS } from '../../data/magicCurriculum';
import { UserProfile } from '../../types';
import { audioSynth } from '../../utils/audioSynthesizer';
import { formatDateKey } from '../../utils/streakManager';

interface EveningMagicProps {
  userProfile: UserProfile;
  onSwitchToMorning: () => void;
  onOpenBooks: () => void;
}

export const EveningMagicView: React.FC<EveningMagicProps> = ({
  userProfile,
  onSwitchToMorning,
  onOpenBooks,
}) => {
  const currentDay = userProfile.magicDayNumber || 1;
  const tomorrowDay = (currentDay % 28) + 1;
  const tomorrowPlan = MAGIC_28_DAYS[tomorrowDay - 1] || MAGIC_28_DAYS[0];

  const [isPlayingTheta, setIsPlayingTheta] = useState<boolean>(false);
  const [magicRockDone, setMagicRockDone] = useState<boolean>(false);
  const [bestEventNote, setBestEventNote] = useState<string>('');
  const [threeGoodThings, setThreeGoodThings] = useState<string[]>(['', '', '']);
  const [isSpeakingGuide, setIsSpeakingGuide] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const stopThetaRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Load existing evening entry for today if any
    const todayKey = `evening_journal_${formatDateKey()}`;
    try {
      const stored = localStorage.getItem(todayKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setBestEventNote(parsed.bestEvent || '');
        if (parsed.threeGoodThings) setThreeGoodThings(parsed.threeGoodThings);
        if (parsed.magicRockDone) setMagicRockDone(true);
      }
    } catch {
      // fallback
    }

    return () => {
      if (stopThetaRef.current) stopThetaRef.current();
      audioSynth.stopAllTones();
      audioSynth.stopSpeech();
    };
  }, []);

  const handleToggleThetaFrequency = () => {
    if (isPlayingTheta) {
      if (stopThetaRef.current) stopThetaRef.current();
      stopThetaRef.current = null;
      setIsPlayingTheta(false);
      audioSynth.stopAllTones();
    } else {
      setIsPlayingTheta(true);
      stopThetaRef.current = audioSynth.playEveningThetaBeat(0.22);
    }
  };

  const guidedRecallScript =
    'Take a slow, deep breath into your heart center. Hold your Magic Rock gently in your hand. Let your mind travel backwards across your day, like a movie reel. Recall the morning, the afternoon, and the evening. Look for the single best blessing that occurred today. Feel the warm gratitude in your chest. Now whisper the sacred magic words: Thank you. Thank you. Thank you.';

  const handleSpeakGuidance = () => {
    if (isSpeakingGuide) {
      audioSynth.stopSpeech();
      setIsSpeakingGuide(false);
    } else {
      setIsSpeakingGuide(true);
      audioSynth.speakText(guidedRecallScript, {
        rate: 0.82,
        pitch: 0.95,
        onEnd: () => setIsSpeakingGuide(false),
      });
    }
  };

  const handleSaveEvening = (e: React.FormEvent) => {
    e.preventDefault();
    const todayKey = `evening_journal_${formatDateKey()}`;
    const payload = {
      date: formatDateKey(),
      bestEvent: bestEventNote,
      threeGoodThings,
      magicRockDone,
      completedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(todayKey, JSON.stringify(payload));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      // Soft chime
      audioSynth.playWaterSipChime(7);
    } catch (err) {
      console.error('Failed to save evening journal', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Evening Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-emerald-950 to-stone-950 text-white p-6 sm:p-10 shadow-2xl border border-emerald-500/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none -ml-10 -mb-10" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold uppercase tracking-wider">
            <Moon className="w-3.5 h-3.5" />
            Evening Magic Sanctuary • Subconscious Reprogramming
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold font-heading text-white tracking-wide">
            The Evening Magic Book Practice
          </h2>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl font-sans">
            In Rhonda Byrne&apos;s <em>The Magic</em>, nighttime is when your subconscious mind integrates your waking reality.
            Tonight, we perform two sacred things: <strong>recall all the good that happened today</strong> with a soothing
            theta sound frequency, and <strong>read tomorrow&apos;s gratitude practice the night before</strong> so your brain
            primes your quantum field while you sleep.
          </p>

          {/* Theta Sleep Frequency Bar */}
          <div className="mt-6 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                  432 Hz + 4.0 Hz Theta Binaural Wave
                </div>
                <div className="text-xs text-stone-300">
                  Hypnagogic twilight sound to induce deep gratitude reflection and delta sleep
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleThetaFrequency}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md ${
                  isPlayingTheta
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-teal-500 hover:bg-teal-400 text-emerald-950 font-bold'
                }`}
                aria-label={isPlayingTheta ? 'Stop Theta Frequency' : 'Sound Theta Sleep Frequency'}
              >
                {isPlayingTheta ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Stop Frequency</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Sound Evening Frequency</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSpeakGuidance}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/15 transition-all cursor-pointer"
                aria-label="Guided Night Reflection Audio"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isSpeakingGuide ? 'text-amber-300 animate-spin' : 'text-stone-300'}`} />
                <span>{isSpeakingGuide ? 'Speaking...' : 'Guided Audio'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Practice 1: The Magic Rock Ritual (Rhonda Byrne) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/10 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl">
            🪨
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-heading text-emerald-950">
              Practice 1: The Magic Rock Nighttime Anchor
            </h3>
            <p className="text-xs text-stone-500">
              Hold your smooth stone in the palm of your hand before sleep
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
          &quot;When you hold the Magic Rock before closing your eyes, your mind cannot search for worries because it is commanded
          to scan for the <strong>single best thing that happened to you today</strong>. As you find that blessing, say the magic
          words: <em>Thank you</em>. Fall asleep with that feeling in your heart.&quot; — <em>The Magic</em>
        </p>

        {/* Guided Recall Script Box */}
        <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <Heart className="w-4 h-4 text-emerald-600" />
            Night Reflection Script (Spoken in your heart)
          </div>
          <p className="text-xs sm:text-sm font-serif-magic italic text-emerald-950 leading-relaxed">
            &ldquo;{guidedRecallScript}&rdquo;
          </p>
        </div>

        {/* Form to log the best event of today */}
        <form onSubmit={handleSaveEvening} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              What was the SINGLE BEST thing that happened to you today?
            </label>
            <textarea
              rows={2}
              value={bestEventNote}
              onChange={(e) => setBestEventNote(e.target.value)}
              placeholder="e.g. A peaceful cup of morning tea, an unexpected kind call from an old friend, or a breakthrough idea at work..."
              className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-stone-300 focus:outline-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-stone-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Three Good Things from Today
            </label>
            <div className="space-y-2">
              {threeGoodThings.map((thing, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={thing}
                  onChange={(e) => {
                    const copy = [...threeGoodThings];
                    copy[idx] = e.target.value;
                    setThreeGoodThings(copy);
                  }}
                  placeholder={`Good thing ${idx + 1}...`}
                  className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-emerald-600 bg-stone-50/50"
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-stone-200">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm text-stone-800">
              <input
                type="checkbox"
                checked={magicRockDone}
                onChange={(e) => setMagicRockDone(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-medium">I held my Magic Rock and said &quot;Thank you!&quot;</span>
            </label>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-semibold shadow-md transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{savedSuccess ? 'Saved to Miracle Journal ✓' : 'Save Evening Reflection'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Practice 2: Read Tomorrow's Gratitude Practice Tonight (The Magic Book Rule) */}
      <div className="bg-gradient-to-br from-teal-50 via-emerald-50/70 to-stone-50 rounded-3xl p-6 sm:p-8 border-2 border-teal-300 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-teal-200/80 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-800">
            <BookOpen className="w-4 h-4 text-teal-700" />
            The Magic Book Rule: Read Tomorrow&apos;s Practice Tonight
          </div>
          <span className="text-xs text-stone-500 font-semibold">
            Prepares your subconscious mind while sleeping
          </span>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-bold text-emerald-800">
            Tomorrow&apos;s Day {tomorrowPlan.day} Curriculum:
          </div>
          <h4 className="text-2xl font-bold font-heading text-emerald-950">
            &ldquo;{tomorrowPlan.title}&rdquo; ({tomorrowPlan.theme})
          </h4>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
            {tomorrowPlan.morningPractice}
          </p>
        </div>

        {/* Action Items for Tomorrow */}
        <div className="bg-white/80 p-4 rounded-2xl border border-teal-200/70 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
            Tomorrow Morning&apos;s Preparation:
          </span>
          <ul className="text-xs text-stone-700 space-y-1.5">
            {tomorrowPlan.actionItems.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-teal-600 font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <blockquote className="text-xs font-serif-magic italic text-teal-900 bg-teal-100/60 p-3 rounded-xl border border-teal-200">
          {tomorrowPlan.quote}
        </blockquote>

        <p className="text-xs text-stone-500 pt-1">
          <em>*Neuroscience Note (Dr. Joseph Murphy &amp; Dr. Tara Swart):</em> Reading your morning intention right before sleep
          primes the Reticular Activating System (RAS) and causes your sleeping brain to organize memories around these grateful targets.
        </p>
      </div>

      {/* Switch back to Morning Flow */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={onOpenBooks}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-emerald-700" />
          <span>Read Book Wisdom</span>
        </button>

        <button
          onClick={onSwitchToMorning}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
        >
          <span>Return to Morning Miracles</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
