import React, { useState, useEffect } from 'react';
import { BookMarked, Sparkles, Plus, Trash2, CheckCircle2, ArrowRight, RefreshCw, Volume2 } from 'lucide-react';
import { MAGIC_28_DAYS } from '../../data/magicCurriculum';
import { getWordOfDay, WordOfDay } from '../../data/wordsOfDay';
import { BlessingItem, UserProfile } from '../../types';
import { STORAGE_KEY_BLESSINGS_PREFIX } from '../../utils/streakManager';
import { audioSynth } from '../../utils/audioSynthesizer';

interface Stage5Props {
  userProfile: UserProfile;
  onComplete: () => void;
}

export const Stage5MagicBlessings: React.FC<Stage5Props> = ({ userProfile, onComplete }) => {
  const dayNumber = userProfile.magicDayNumber || 1;
  const currentMagicPlan = MAGIC_28_DAYS[dayNumber - 1] || MAGIC_28_DAYS[0];
  const wordOfDay: WordOfDay = getWordOfDay(dayNumber);

  const [blessings, setBlessings] = useState<BlessingItem[]>([]);
  const [newTopic, setNewTopic] = useState<string>('');
  const [newReason, setNewReason] = useState<string>('');
  const [isSpeakingWord, setIsSpeakingWord] = useState<boolean>(false);
  const [isSpeakingBlessings, setIsSpeakingBlessings] = useState<boolean>(false);
  const [speakingBlessingIndex, setSpeakingBlessingIndex] = useState<number>(-1);
  const [voiceGender, setVoiceGender] = useState<'female' | 'male'>('female');

  // Load blessings for today or initialize with day's curriculum defaults
  useEffect(() => {
    const todayKey = `${STORAGE_KEY_BLESSINGS_PREFIX}day_${dayNumber}`;
    try {
      const stored = localStorage.getItem(todayKey);
      if (stored) {
        setBlessings(JSON.parse(stored));
        return;
      }
    } catch {
      // fallback
    }

    // Initialize from 28-day curriculum defaults
    const initial: BlessingItem[] = currentMagicPlan.defaultBlessings.map((b, idx) => ({
      id: `blessing_${dayNumber}_${idx + 1}`,
      topic: b.topic,
      reason: b.reason,
      completed: false,
    }));
    setBlessings(initial);
  }, [dayNumber, currentMagicPlan]);

  const saveBlessings = (updated: BlessingItem[]) => {
    setBlessings(updated);
    const todayKey = `${STORAGE_KEY_BLESSINGS_PREFIX}day_${dayNumber}`;
    try {
      localStorage.setItem(todayKey, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save blessings', e);
    }
  };

  const handleToggleComplete = (id: string) => {
    const updated = blessings.map((b) => {
      if (b.id === id) {
        const nextState = !b.completed;
        if (nextState) {
          // Play soft confirmation chime
          audioSynth.playWaterSipChime(5);
        }
        return { ...b, completed: nextState };
      }
      return b;
    });
    saveBlessings(updated);
  };

  const handleAddBlessing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim() || !newReason.trim()) return;

    const newItem: BlessingItem = {
      id: `blessing_custom_${Date.now()}`,
      topic: newTopic.trim(),
      reason: newReason.trim(),
      completed: true,
    };
    saveBlessings([...blessings, newItem]);
    setNewTopic('');
    setNewReason('');
  };

  const handleDeleteBlessing = (id: string) => {
    saveBlessings(blessings.filter((b) => b.id !== id));
  };

  const completedCount = blessings.filter((b) => b.completed).length;

  const handleVoiceChange = (newGender: 'female' | 'male') => {
    setVoiceGender(newGender);
    if (isSpeakingWord) {
      audioSynth.stopSpeech();
      setIsSpeakingWord(true);
      setTimeout(() => {
        const textToSpeak = `Word of the Day: ${wordOfDay.word}, in Sanskrit ${wordOfDay.sanskrit}. Meaning: ${wordOfDay.meaning}. Wisdom: ${wordOfDay.philosophicalWisdom}. Affirmation: ${wordOfDay.affirmation}`;
        audioSynth.speakText(textToSpeak, {
          gender: newGender,
          onEnd: () => setIsSpeakingWord(false),
        });
      }, 150);
    } else if (isSpeakingBlessings) {
      audioSynth.stopSpeech();
      setTimeout(() => {
        speakBlessingStep(Math.max(0, speakingBlessingIndex), newGender);
      }, 150);
    }
  };

  const handleSpeakWord = () => {
    if (isSpeakingWord) {
      audioSynth.stopSpeech();
      setIsSpeakingWord(false);
    } else {
      if (isSpeakingBlessings) {
        audioSynth.stopSpeech();
        setIsSpeakingBlessings(false);
        setSpeakingBlessingIndex(-1);
      }
      setIsSpeakingWord(true);
      const textToSpeak = `Word of the Day: ${wordOfDay.word}, in Sanskrit ${wordOfDay.sanskrit}. Meaning: ${wordOfDay.meaning}. Wisdom: ${wordOfDay.philosophicalWisdom}. Affirmation: ${wordOfDay.affirmation}`;
      audioSynth.speakText(textToSpeak, {
        gender: voiceGender,
        onEnd: () => setIsSpeakingWord(false),
      });
    }
  };

  const handleToggleSpeakBlessings = () => {
    if (isSpeakingBlessings) {
      audioSynth.stopSpeech();
      setIsSpeakingBlessings(false);
      setSpeakingBlessingIndex(-1);
      return;
    }

    if (isSpeakingWord) {
      audioSynth.stopSpeech();
      setIsSpeakingWord(false);
    }

    setIsSpeakingBlessings(true);
    speakBlessingStep(0);
  };

  const speakBlessingStep = (idx: number, activeGender?: 'female' | 'male') => {
    if (idx >= blessings.length) {
      setIsSpeakingBlessings(false);
      setSpeakingBlessingIndex(-1);
      return;
    }

    setSpeakingBlessingIndex(idx);
    const item = blessings[idx];
    const textToSpeak = `Blessing number ${idx + 1}. I am truly blessed to have ${item.topic}, because ${item.reason}. Thank you, thank you, thank you.`;
    const gender = activeGender || voiceGender;

    audioSynth.speakText(textToSpeak, {
      gender: gender,
      rate: 0.9,
      onEnd: () => {
        setTimeout(() => speakBlessingStep(idx + 1, gender), 600);
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Info */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
          <BookMarked className="w-3.5 h-3.5" />
          Stage 5 • Rhonda Byrne&apos;s The Magic Book
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-emerald-950">
          Word of the Day &amp; 10 Daily Blessings
        </h2>
        <p className="text-stone-600 text-sm">
          Practicing the sacred 28-day gratitude cycle from Rhonda Byrne&apos;s <em>The Magic</em>.
          Each day refreshes with specific blessings, looping to Day 1 after 28 days of conscious rewiring.
        </p>
      </div>

      {/* Part A: Positive Note & Word of the Day Wisdom */}
      <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/25 space-y-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <span className="text-xs text-amber-300 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Wisdom Anchor • Day {dayNumber} of 28
            </span>
            <div className="flex items-baseline gap-3 pt-1">
              <h3 className="text-3xl sm:text-4xl font-bold font-heading text-emerald-50 tracking-wide">
                {wordOfDay.word}
              </h3>
              <span className="text-base sm:text-lg text-emerald-300 font-serif-magic italic">
                ({wordOfDay.sanskrit})
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Voice Gender Selector */}
            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-2xl border border-white/20">
              <button
                type="button"
                onClick={() => handleVoiceChange('female')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  voiceGender === 'female'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
                aria-label="Select Female Voice for Wisdom"
              >
                👩 Female Voice
              </button>
              <button
                type="button"
                onClick={() => handleVoiceChange('male')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  voiceGender === 'male'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
                aria-label="Select Male Voice for Wisdom"
              >
                👨 Male Voice
              </button>
            </div>

            <button
              onClick={handleSpeakWord}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold transition-all cursor-pointer shadow-xs"
              aria-label="Listen to Word of the Day Audio Wisdom"
            >
              <Volume2 className={`w-4 h-4 ${isSpeakingWord ? 'text-amber-300 animate-pulse' : 'text-stone-300'}`} />
              <span>{isSpeakingWord ? 'Speaking Wisdom...' : 'Listen to Wisdom'}</span>
            </button>
          </div>
        </div>

        <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-sans relative z-10">
          <strong className="text-emerald-200">Cosmic Meaning:</strong> {wordOfDay.meaning}
        </p>

        <p className="text-sm sm:text-base font-serif-magic italic text-emerald-100 bg-white/5 rounded-2xl p-4 sm:p-5 border border-white/10 relative z-10 leading-relaxed">
          &ldquo;{wordOfDay.philosophicalWisdom}&rdquo;
        </p>

        <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-300 border-t border-white/10 gap-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">Affirmation:</span>
            <em className="text-white">&quot;{wordOfDay.affirmation}&quot;</em>
          </div>
          <span className="text-amber-200/90 font-medium bg-white/5 px-3 py-1 rounded-full border border-white/10">
            Contemplate: {wordOfDay.contemplationPrompt}
          </span>
        </div>
      </div>

      {/* Part B: The 28-Day Magic Curriculum Day Focus */}
      <div className="bg-emerald-50/70 rounded-3xl p-6 border border-emerald-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            Day {currentMagicPlan.day} of 28 • {currentMagicPlan.theme}
          </div>
          <span className="text-xs text-stone-500">Refreshes every 28 days automatically</span>
        </div>

        <h3 className="text-xl font-bold font-heading text-emerald-950">
          Practice: &ldquo;{currentMagicPlan.title}&rdquo;
        </h3>

        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
          {currentMagicPlan.morningPractice}
        </p>

        <blockquote className="text-xs text-emerald-900 font-serif-magic italic bg-white/80 p-3 rounded-xl border border-emerald-200">
          {currentMagicPlan.quote}
        </blockquote>
      </div>

      {/* Part C: 10 Daily Blessings Interactive List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/10 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <h3 className="text-lg font-bold text-emerald-950 font-heading">
              Count Your 10 Blessings Today
            </h3>
            <p className="text-xs text-stone-500">
              State WHY you are grateful. Seal each with: &quot;Thank you, thank you, thank you!&quot;
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Recite 10 Blessings Button */}
            <button
              onClick={handleToggleSpeakBlessings}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold shadow-xs transition-all cursor-pointer"
              aria-label="Recite All Blessings Out Loud"
            >
              <Volume2 className={`w-4 h-4 ${isSpeakingBlessings ? 'text-emerald-600 animate-pulse' : 'text-stone-500'}`} />
              <span>{isSpeakingBlessings ? `Reciting (#${speakingBlessingIndex + 1})...` : 'Recite 10 Blessings'}</span>
            </button>

            <div className="text-right">
              <span className="text-xs font-bold text-emerald-800">
                {completedCount} of {blessings.length} Counted
              </span>
              <div className="w-28 h-2 bg-stone-200 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${(completedCount / Math.max(1, blessings.length)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Blessings List */}
        <div className="space-y-3">
          {blessings.map((blessing, idx) => {
            const isCurrentlySpoken = isSpeakingBlessings && speakingBlessingIndex === idx;

            return (
              <div
                key={blessing.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrentlySpoken
                    ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/40 shadow-sm'
                    : blessing.completed
                    ? 'bg-emerald-50/60 border-emerald-300'
                    : 'bg-stone-50/60 border-stone-200 hover:border-emerald-200'
                }`}
              >
              <div className="flex items-start justify-between gap-3">
                <button
                  onClick={() => handleToggleComplete(blessing.id)}
                  className="mt-0.5 flex-shrink-0 cursor-pointer"
                  aria-label={blessing.completed ? 'Uncheck blessing' : 'Mark blessing completed'}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      blessing.completed
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'border-2 border-stone-300 hover:border-emerald-500'
                    }`}
                  >
                    {blessing.completed && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                </button>

                <div className="flex-1 text-sm text-stone-800 leading-relaxed">
                  <span className="font-bold text-emerald-950">
                    {idx + 1}. I am truly blessed to have {blessing.topic}{' '}
                  </span>
                  <span className="text-stone-700">because {blessing.reason}</span>

                  {blessing.completed && (
                    <div className="mt-1 text-xs font-serif-magic font-bold text-emerald-800 italic">
                      ✨ Thank you, thank you, thank you!
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteBlessing(blessing.id)}
                  className="text-stone-300 hover:text-rose-500 p-1 cursor-pointer transition-colors"
                  title="Delete blessing"
                  aria-label={`Delete blessing ${idx + 1}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

        {/* Add Custom Blessing Form */}
        <form onSubmit={handleAddBlessing} className="pt-4 border-t border-stone-200 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Add Your Own Blessing
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="I am truly blessed to have [Topic]..."
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-stone-50/50"
            />
            <input
              type="text"
              placeholder="Because [Reason]..."
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-stone-50/50"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newTopic.trim() || !newReason.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold disabled:opacity-40 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Blessing</span>
            </button>
          </div>
        </form>
      </div>

      {/* Next Step */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onComplete}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm shadow-md transition-all cursor-pointer hover:shadow-lg group"
        >
          <span>Complete Morning Miracles Ritual</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
