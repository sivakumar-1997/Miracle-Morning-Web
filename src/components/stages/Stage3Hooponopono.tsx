import React, { useState, useEffect, useRef } from 'react';
import { HeartHandshake, Volume2, Sparkles, ArrowRight, Play, Square, Music, Mic } from 'lucide-react';
import { audioSynth } from '../../utils/audioSynthesizer';

interface Stage3Props {
  onComplete: () => void;
}

const PHRASES = [
  {
    id: 'sorry',
    text: "I'm sorry",
    meaning: 'Acknowledging the shared subconscious memories and energetic cords within me that manifest discord.',
    color: 'from-amber-500/20 to-amber-600/10 text-amber-950 border-amber-300',
  },
  {
    id: 'forgive',
    text: 'Please forgive me',
    meaning: 'Asking the Divine Source for purification, releasing blame, and letting go of karmic entanglements.',
    color: 'from-teal-500/20 to-teal-600/10 text-teal-950 border-teal-300',
  },
  {
    id: 'thankyou',
    text: 'Thank you',
    meaning: 'Expressing absolute faith and gratitude that the transmutation and cellular healing are already complete.',
    color: 'from-emerald-500/20 to-emerald-600/10 text-emerald-950 border-emerald-300',
  },
  {
    id: 'loveyou',
    text: 'I love you',
    meaning: 'Returning all energy to the state of Zero, unconditional divine love, and primordial light.',
    color: 'from-rose-500/20 to-rose-600/10 text-rose-950 border-rose-300',
  },
];

export const Stage3Hooponopono: React.FC<Stage3Props> = ({ onComplete }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playMode, setPlayMode] = useState<'words-only' | 'words-with-frequency'>('words-with-frequency');
  const [activePhraseIndex, setActivePhraseIndex] = useState<number>(0);
  const [currentRepetition, setCurrentRepetition] = useState<number>(1);
  const [targetRepetitions, setTargetRepetitions] = useState<number>(21);
  const [voiceGender, setVoiceGender] = useState<'female' | 'male'>('female');

  const stopToneRef = useRef<(() => void) | null>(null);
  const loopActiveRef = useRef<boolean>(false);

  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, []);

  const stopPlayback = () => {
    loopActiveRef.current = false;
    setIsPlaying(false);
    audioSynth.stopSpeech();
    if (stopToneRef.current) {
      stopToneRef.current();
      stopToneRef.current = null;
    }
    audioSynth.stopAllTones();
  };

  const startPlayback = (genderToUse?: 'female' | 'male') => {
    stopPlayback();
    setIsPlaying(true);
    loopActiveRef.current = true;

    // If Mode B: Start 528Hz Miracle background frequency
    if (playMode === 'words-with-frequency') {
      stopToneRef.current = audioSynth.playFrequency(528, 0.16);
    }

    runDictationCycle(0, 1, genderToUse || voiceGender);
  };

  const handleVoiceChange = (newGender: 'female' | 'male') => {
    setVoiceGender(newGender);
    if (isPlaying) {
      // Pause ongoing speech and restart dictating with the chosen voice
      audioSynth.stopSpeech();
      setTimeout(() => {
        if (!loopActiveRef.current) return;
        runDictationCycle(activePhraseIndex, currentRepetition, newGender);
      }, 150);
    }
  };

  const runDictationCycle = (
    phraseIdx: number,
    repCount: number,
    activeGender?: 'female' | 'male'
  ) => {
    if (!loopActiveRef.current) return;

    setActivePhraseIndex(phraseIdx);
    setCurrentRepetition(repCount);

    const gender = activeGender || voiceGender;
    const phrase = PHRASES[phraseIdx];
    audioSynth.speakText(phrase.text, {
      rate: 0.85,
      gender: gender,
      onEnd: () => {
        if (!loopActiveRef.current) return;

        // Pause 1.2s between phrases for deep breathing
        setTimeout(() => {
          if (!loopActiveRef.current) return;

          if (phraseIdx < PHRASES.length - 1) {
            runDictationCycle(phraseIdx + 1, repCount, gender);
          } else {
            // Completed 1 full round of 4 phrases
            if (repCount < targetRepetitions) {
              runDictationCycle(0, repCount + 1, gender);
            } else {
              // Completed all target repetitions
              stopPlayback();
            }
          }
        }, 1200);
      },
    });
  };

  const handleManualIncrement = () => {
    setCurrentRepetition((prev) => Math.min(targetRepetitions, prev + 1));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Intro Hero */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
          <HeartHandshake className="w-3.5 h-3.5" />
          Stage 3 • Sacred Transmutation
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-emerald-950">
          Sacred Ho&apos;oponopono Prayer
        </h2>
        <p className="text-stone-600 text-sm">
          The ancient Hawaiian method of reconciliation and cleansing (brought forward by Morrnah Simeona &amp; Dr. Hew Len).
          Cleanse subconscious memory blocks and restore zero-point divine love.
        </p>
      </div>

      {/* Dual Playback Mode & Voice Gender Selector */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <h3 className="text-base font-bold text-emerald-950 font-heading">
              Select Prayer Dictation &amp; Voice
            </h3>
            <p className="text-xs text-stone-500">Choose words with/without 528Hz frequency, and select Male or Female voice</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Male vs Female Voice Switcher */}
            <div className="flex items-center gap-1 bg-emerald-50/80 p-1 rounded-2xl border border-emerald-200">
              <button
                type="button"
                onClick={() => handleVoiceChange('female')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  voiceGender === 'female'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-700 hover:text-emerald-900'
                }`}
                aria-label="Select Female Voice for Prayer"
              >
                👩 Female Voice
              </button>
              <button
                type="button"
                onClick={() => handleVoiceChange('male')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  voiceGender === 'male'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-700 hover:text-emerald-900'
                }`}
                aria-label="Select Male Voice for Prayer"
              >
                👨 Male Voice
              </button>
            </div>

            {/* Mode A/B Switcher */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl border border-stone-200">
              <button
                onClick={() => {
                  if (isPlaying) stopPlayback();
                  setPlayMode('words-only');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  playMode === 'words-only'
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                aria-label="Dictate Words Only"
              >
                <Mic className="w-3.5 h-3.5 text-stone-600" />
                <span>Words Only</span>
              </button>

              <button
                onClick={() => {
                  if (isPlaying) stopPlayback();
                  setPlayMode('words-with-frequency');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  playMode === 'words-with-frequency'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                aria-label="Dictate Words Along With 528Hz Frequency"
              >
                <Music className="w-3.5 h-3.5 text-amber-300" />
                <span>Words + 528 Hz</span>
              </button>
            </div>
          </div>
        </div>

        {/* Player Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80">
          <div className="flex items-center gap-3">
            {!isPlaying ? (
              <button
                onClick={() => startPlayback()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                aria-label="Start Ho'oponopono Prayer Dictation"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Begin Prayer Chanting</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startPlayback()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  aria-label="Restart Prayer Dictation"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Restart Dictation</span>
                </button>
                <button
                  onClick={stopPlayback}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  aria-label="Pause Prayer Dictation"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Pause Prayer</span>
                </button>
              </div>
            )}

            <div className="text-xs text-stone-600">
              <span className="font-semibold text-emerald-950">
                Cycle {currentRepetition} of {targetRepetitions}
              </span>
              <span className="text-stone-400 mx-1.5">•</span>
              <span>
                {playMode === 'words-with-frequency' ? '528 Hz Miracles Active' : 'Spoken Dictation'}
              </span>
            </div>
          </div>

          {/* Target Repetitions Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500 font-medium">Sacred Rounds:</span>
            {[4, 21, 54, 108].map((count) => (
              <button
                key={count}
                onClick={() => setTargetRepetitions(count)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  targetRepetitions === count
                    ? 'bg-emerald-800 text-white'
                    : 'bg-white hover:bg-stone-200 text-stone-700 border border-stone-200'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* The Four Sacred Phrases Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 items-stretch">
          {PHRASES.map((phrase, idx) => {
            const isActive = isPlaying && activePhraseIndex === idx;

            return (
              <div
                key={phrase.id}
                className={`p-6 rounded-3xl border-2 transition-all duration-500 bg-gradient-to-br flex flex-col justify-between ${
                  phrase.color
                } ${
                  isActive
                    ? 'scale-102 shadow-lg ring-4 ring-emerald-500/30 border-emerald-600'
                    : 'opacity-90 hover:opacity-100 hover:border-emerald-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider opacity-75">
                      Sacred Step {idx + 1}
                    </span>
                    {isActive && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-white/95 px-2.5 py-0.5 rounded-full shadow-xs">
                        <Volume2 className="w-3.5 h-3.5 animate-pulse text-emerald-600" /> Chanting
                      </span>
                    )}
                  </div>

                  <div className="text-2xl sm:text-3xl font-bold font-serif-magic mt-3 tracking-wide text-stone-900 leading-snug">
                    &ldquo;{phrase.text}&rdquo;
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 mt-3 leading-relaxed">
                  {phrase.meaning}
                </p>
              </div>
            );
          })}
        </div>

        {/* Manual Bead Count & Zero State Guidance */}
        <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500 max-w-md">
            <em>&quot;Take 100% responsibility for whatever appears in your life. Clean, erase, erase, and find your own Shangri-La: at Zero.&quot;</em> — Dr. Ihaleakala Hew Len
          </p>

          <button
            onClick={handleManualIncrement}
            className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 cursor-pointer"
          >
            Count 1 Mala Bead (+1)
          </button>
        </div>
      </div>

      {/* Next Step */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => {
            stopPlayback();
            onComplete();
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm shadow-md transition-all cursor-pointer hover:shadow-lg group"
        >
          <span>Proceed to Water Manifestation Alchemy</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
