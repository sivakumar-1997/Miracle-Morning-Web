import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2, ArrowRight, ShieldCheck, Sparkles, Sliders, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { CHAKRAS_DATA } from '../../data/chakrasData';
import { ChakraInfo } from '../../types';
import { audioSynth } from '../../utils/audioSynthesizer';

interface Stage2Props {
  onComplete: () => void;
}

export const Stage2ChakraCleansing: React.FC<Stage2Props> = ({ onComplete }) => {
  const [selectedChakra, setSelectedChakra] = useState<ChakraInfo>(CHAKRAS_DATA[0]);
  const [activePlayingFreq, setActivePlayingFreq] = useState<number | null>(null);
  const [isJourneyRunning, setIsJourneyRunning] = useState<boolean>(false);
  const [journeySecondsLeft, setJourneySecondsLeft] = useState<number>(300); // 5 min = 300s
  const [journeyTotalDuration, setJourneyTotalDuration] = useState<number>(300);
  const [activeJourneyChakraIndex, setActiveJourneyChakraIndex] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.28);
  const [isAnatomyOpen, setIsAnatomyOpen] = useState<boolean>(false); // Collapsed by default

  const stopToneRef = useRef<(() => void) | null>(null);
  const journeyTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (stopToneRef.current) stopToneRef.current();
      if (journeyTimerRef.current) clearInterval(journeyTimerRef.current);
      audioSynth.stopAllTones();
    };
  }, []);

  /**
   * Play single individual frequency
   */
  const handlePlaySingle = (chakra: ChakraInfo) => {
    if (isJourneyRunning) {
      handleStopJourney();
    }

    if (activePlayingFreq === chakra.frequency) {
      // Toggle off
      if (stopToneRef.current) stopToneRef.current();
      stopToneRef.current = null;
      setActivePlayingFreq(null);
    } else {
      // Play new
      if (stopToneRef.current) stopToneRef.current();
      setSelectedChakra(chakra);
      setActivePlayingFreq(chakra.frequency);
      stopToneRef.current = audioSynth.playFrequency(chakra.frequency, volume);
    }
  };

  /**
   * Start 5-Minute (or preview) Cumulative Cleansing Journey
   */
  const handleStartJourney = (totalSeconds: number = 300) => {
    if (stopToneRef.current) stopToneRef.current();
    if (journeyTimerRef.current) clearInterval(journeyTimerRef.current);

    setJourneyTotalDuration(totalSeconds);
    setJourneySecondsLeft(totalSeconds);
    setIsJourneyRunning(true);
    setActiveJourneyChakraIndex(0);

    const timePerChakra = totalSeconds / CHAKRAS_DATA.length;
    let elapsed = 0;

    // Start with Root Chakra (index 0)
    const firstChakra = CHAKRAS_DATA[0];
    setSelectedChakra(firstChakra);
    setActivePlayingFreq(firstChakra.frequency);
    stopToneRef.current = audioSynth.playFrequency(firstChakra.frequency, volume);

    journeyTimerRef.current = setInterval(() => {
      elapsed += 1;
      const remaining = Math.max(0, totalSeconds - elapsed);
      setJourneySecondsLeft(remaining);

      const newIndex = Math.min(CHAKRAS_DATA.length - 1, Math.floor(elapsed / timePerChakra));
      setActiveJourneyChakraIndex(newIndex);
      setSelectedChakra(CHAKRAS_DATA[newIndex]);

      // Check if frequency should transition
      const targetFreq = CHAKRAS_DATA[newIndex].frequency;
      if (activePlayingFreq !== targetFreq) {
        setActivePlayingFreq(targetFreq);
        if (stopToneRef.current) stopToneRef.current();
        stopToneRef.current = audioSynth.playFrequency(targetFreq, volume);
      }

      if (remaining <= 0) {
        handleStopJourney();
      }
    }, 1000);
  };

  const handleStopJourney = () => {
    setIsJourneyRunning(false);
    if (journeyTimerRef.current) {
      clearInterval(journeyTimerRef.current);
      journeyTimerRef.current = null;
    }
    if (stopToneRef.current) {
      stopToneRef.current();
      stopToneRef.current = null;
    }
    setActivePlayingFreq(null);
    audioSynth.stopAllTones();
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Info */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Stage 2 • Bio-Energetic Alignment
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-emerald-950">
          Seven Chakras Aura Cleansing
        </h2>
        <p className="text-stone-600 text-sm">
          Immerse in pure acoustic healing harmonics. Click any chakra to hear its healing vibration individually,
          or embark on the cumulative 5-minute ascending journey.
        </p>
      </div>

      {/* Cumulative 5-Minute Master Player Controller */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs text-emerald-300 font-semibold tracking-wider uppercase">
              Cumulative Multi-Chakra Program
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-heading">
              5-Minute Ascending Chakra Alignment
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-md">
              Sounds each chakra frequency in harmonic succession (43 seconds each) from Root (396Hz) up to Crown (963Hz).
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 justify-center">
            {!isJourneyRunning ? (
              <>
                <button
                  onClick={() => handleStartJourney(300)}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-sm shadow-lg transition-all cursor-pointer hover:scale-102"
                  aria-label="Start 5-Minute Chakra Journey"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Play 5-Minute Cleansing</span>
                </button>
                <button
                  onClick={() => handleStartJourney(35)}
                  className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-medium border border-white/15 transition-all cursor-pointer"
                  title="35-second quick demonstration (5 seconds per chakra)"
                  aria-label="Play 35-Second Fast Preview"
                >
                  <span>35s Preview</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleStopJourney}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg transition-all cursor-pointer"
                aria-label="Stop Cumulative Cleansing"
              >
                <Square className="w-5 h-5 fill-current" />
                <span>Stop Journey ({formatTimer(journeySecondsLeft)})</span>
              </button>
            )}
          </div>
        </div>

        {/* Journey Progress Bar */}
        {isJourneyRunning && (
          <div className="mt-6 pt-6 border-t border-white/15 space-y-3">
            <div className="flex justify-between items-center text-xs text-stone-300">
              <span className="font-semibold text-emerald-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                Active: {CHAKRAS_DATA[activeJourneyChakraIndex].name} ({CHAKRAS_DATA[activeJourneyChakraIndex].frequency} Hz)
              </span>
              <span className="font-mono text-emerald-200 text-sm font-bold">
                {formatTimer(journeySecondsLeft)} remaining
              </span>
            </div>

            <div className="w-full h-3 bg-white/15 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-red-500 via-emerald-400 to-purple-500 rounded-full transition-all duration-1000"
                style={{
                  width: `${((journeyTotalDuration - journeySecondsLeft) / journeyTotalDuration) * 100}%`,
                }}
              />
            </div>

            {/* Stepper Dots */}
            <div className="grid grid-cols-7 gap-1 pt-1">
              {CHAKRAS_DATA.map((chakra, idx) => (
                <div
                  key={chakra.id}
                  className={`text-center py-1 rounded-md text-[10px] font-semibold transition-all ${
                    idx === activeJourneyChakraIndex
                      ? 'bg-white text-emerald-950 font-bold shadow-xs scale-105'
                      : idx < activeJourneyChakraIndex
                      ? 'bg-emerald-500/30 text-emerald-200'
                      : 'bg-white/5 text-stone-400'
                  }`}
                >
                  {chakra.frequency}Hz
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Spiritual Body Silhouette & Chakra Center View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Spiritual Human Body Silhouette with 7 Glowing Chakras */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-emerald-900/10 shadow-sm flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-emerald-950 font-heading">
              Sushumna &amp; Pranic Vortexes
            </h3>
            <span className="text-xs text-stone-500 font-medium">Click center to sound</span>
          </div>

          {/* Interactive Silhouette Canvas with Sacred Geometry Backdrop */}
          <div className="relative w-full max-w-[300px] h-[450px] bg-gradient-to-b from-emerald-50/80 via-teal-50/40 to-stone-100/70 rounded-2xl flex items-center justify-center border border-emerald-900/10 overflow-hidden shadow-inner my-auto">
            {/* Ambient Toroidal Aura Rings */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0%,transparent_75%)] animate-pulse" />
            <div className="absolute w-64 h-64 border border-emerald-500/15 rounded-full pointer-events-none animate-spin-slow" />
            <div className="absolute w-44 h-44 border border-teal-500/20 rounded-full pointer-events-none" />

            {/* Stylized Meditative Human Silhouette SVG */}
            <svg
              viewBox="0 0 200 360"
              className="w-full h-full text-emerald-950/20 pointer-events-none drop-shadow-sm"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Head */}
              <circle cx="100" cy="42" r="23" opacity="0.85" />
              {/* Neck */}
              <path d="M93 64 L107 64 L109 82 L91 82 Z" opacity="0.85" />
              {/* Torso */}
              <path
                d="M62 90 C62 83 80 82 100 82 C120 82 138 83 138 90 L144 170 C144 195 128 220 100 220 C72 220 56 195 56 170 Z"
                opacity="0.85"
              />
              {/* Arms folded in meditation / Gyan mudra */}
              <path
                d="M62 90 L38 170 C36 185 47 200 64 205 L84 212 L78 200 L58 192 L70 120 Z"
                opacity="0.75"
              />
              <path
                d="M138 90 L162 170 C164 185 153 200 136 205 L116 212 L122 200 L142 192 L130 120 Z"
                opacity="0.75"
              />
              {/* Crossed legs / Padmasana Base */}
              <path
                d="M32 290 C27 260 52 230 85 220 L115 220 C148 230 173 260 168 290 C163 315 138 325 100 325 C62 325 37 315 32 290 Z"
                opacity="0.9"
              />
              {/* Central Sushumna Nadi Line */}
              <line
                x1="100"
                y1="30"
                x2="100"
                y2="300"
                stroke="rgba(16, 185, 129, 0.45)"
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />
            </svg>

            {/* 7 Interactive Chakras on Body Silhouette */}
            {CHAKRAS_DATA.map((chakra) => {
              const isSelected = selectedChakra.id === chakra.id;
              const isPlaying = activePlayingFreq === chakra.frequency;

              return (
                <button
                  key={chakra.id}
                  onClick={() => handlePlaySingle(chakra)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all duration-300"
                  style={{
                    top: `${chakra.yPercent}%`,
                    left: `${chakra.xPercent}%`,
                  }}
                  aria-label={`${chakra.name} (${chakra.frequency} Hz)`}
                >
                  {/* Aura Glow Ring */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isPlaying
                        ? 'animate-aura-glow ring-4 scale-120'
                        : isSelected
                        ? 'ring-2 scale-110 shadow-md'
                        : 'hover:scale-115'
                    }`}
                    style={{
                      backgroundColor: chakra.color,
                      boxShadow: isPlaying || isSelected ? `0 0 24px ${chakra.color}` : 'none',
                    }}
                  >
                    <span className="text-white text-[11px] font-bold font-mono">
                      {chakra.number}
                    </span>
                  </div>

                  {/* Frequency Label Tooltip */}
                  <div
                    className={`absolute left-11 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap shadow-sm transition-opacity ${
                      isSelected || isPlaying
                        ? 'bg-emerald-950 text-white opacity-100 z-10'
                        : 'bg-white/95 text-stone-700 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {chakra.name} • {chakra.frequency}Hz
                  </div>
                </button>
              );
            })}
          </div>

          {/* Volume Control */}
          <div className="w-full mt-4 pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
            <span className="flex items-center gap-1.5 font-medium">
              <Sliders className="w-3.5 h-3.5 text-emerald-700" /> Acoustic Volume
            </span>
            <input
              type="range"
              min="0.05"
              max="0.6"
              step="0.05"
              value={volume}
              onChange={(e) => {
                const newVol = Number(e.target.value);
                setVolume(newVol);
                audioSynth.setToneVolume(newVol);
              }}
              className="w-32 accent-emerald-700 cursor-pointer"
              aria-label="Tone Volume"
            />
          </div>
        </div>

        {/* Right: Selected Chakra Details & Frequency Player */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          {/* Active Highlight Card */}
          <div
            className={`rounded-3xl p-6 sm:p-7 border transition-all ${
              selectedChakra.bgLight
            } shadow-sm`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider opacity-75">
                  Chakra {selectedChakra.number} of 7 • {selectedChakra.sanskrit}
                </div>
                <h3 className="text-2xl font-bold font-heading text-stone-900 mt-1">
                  {selectedChakra.name}
                </h3>
                <div className="text-xs font-semibold mt-0.5 text-stone-700 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-white shadow-xs font-mono font-bold">
                    {selectedChakra.frequency} Hz
                  </span>
                  <span>Element: {selectedChakra.element}</span>
                </div>
              </div>

              {/* Play / Pause button for this specific chakra */}
              <button
                onClick={() => handlePlaySingle(selectedChakra)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer ${
                  activePlayingFreq === selectedChakra.frequency
                    ? 'bg-stone-900 text-white hover:bg-stone-800'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}
                aria-label={
                  activePlayingFreq === selectedChakra.frequency
                    ? `Stop ${selectedChakra.frequency}Hz`
                    : `Play ${selectedChakra.frequency}Hz`
                }
              >
                {activePlayingFreq === selectedChakra.frequency ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause Sound</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Sound {selectedChakra.frequency} Hz</span>
                  </>
                )}
              </button>
            </div>

            {/* Sound Wave Animation if Playing */}
            {activePlayingFreq === selectedChakra.frequency && (
              <div className="mt-4 p-3 bg-white/70 rounded-xl flex items-center justify-between gap-2 border border-black/5 animate-pulse">
                <span className="text-xs font-medium text-stone-700">
                  Resonating at pure {selectedChakra.frequency} Hz sine tone with warm acoustic overtones...
                </span>
                <div className="flex items-end gap-1 h-5">
                  <div className="w-1 bg-emerald-600 h-2 animate-bounce" />
                  <div className="w-1 bg-emerald-600 h-5 animate-bounce delay-75" />
                  <div className="w-1 bg-emerald-600 h-3 animate-bounce delay-150" />
                  <div className="w-1 bg-emerald-600 h-4 animate-bounce delay-100" />
                </div>
              </div>
            )}

            <div className="mt-5 space-y-3 pt-4 border-t border-black/10 text-stone-800 text-sm leading-relaxed">
              <p>
                <strong>Location:</strong> {selectedChakra.location}
              </p>
              <p>
                <strong>Affirmation:</strong> <em>&quot;{selectedChakra.affirmation}&quot;</em>
              </p>
              <p>
                <strong>Healing Benefit:</strong> {selectedChakra.healingBenefit}
              </p>
              <p className="text-xs text-stone-600">
                <strong>Bio-Energetic Description:</strong> {selectedChakra.description}
              </p>
            </div>
          </div>

          {/* Quick Select Grid for all 7 Chakras */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {CHAKRAS_DATA.map((ch) => {
              const isSelected = selectedChakra.id === ch.id;
              const isPlaying = activePlayingFreq === ch.frequency;

              return (
                <button
                  key={ch.id}
                  onClick={() => handlePlaySingle(ch)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-900 text-white border-emerald-900 shadow-md scale-102'
                      : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800'
                  }`}
                  aria-label={`Select ${ch.name}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: ch.color }}
                    />
                    <span className="text-[11px] font-mono font-bold">
                      {ch.frequency}Hz
                    </span>
                  </div>
                  <div className="text-xs font-bold font-heading mt-2 line-clamp-1">
                    {ch.name}
                  </div>
                  <div className={`text-[10px] mt-0.5 line-clamp-1 ${isSelected ? 'text-emerald-200' : 'text-stone-500'}`}>
                    {isPlaying ? 'Playing Sound' : ch.mantra}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                handleStopJourney();
                onComplete();
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm shadow-md transition-all cursor-pointer hover:shadow-lg group"
            >
              <span>Proceed to Sacred Ho&apos;oponopono</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible Dropdown: Seven Chakras Anatomy & Detailed Positions (Collapsed by default) */}
      <div className="bg-white rounded-3xl border border-emerald-900/10 shadow-sm overflow-hidden transition-all">
        <button
          onClick={() => setIsAnatomyOpen(!isAnatomyOpen)}
          className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left bg-gradient-to-r from-stone-50 via-emerald-50/40 to-stone-50 hover:bg-emerald-50/70 transition-colors cursor-pointer"
          aria-expanded={isAnatomyOpen}
          aria-label="Toggle In-Depth Guide on Seven Chakras Positions and Anatomy"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base sm:text-lg font-bold font-heading text-emerald-950">
                  Seven Chakras Anatomical Positions &amp; Energy Centers Guide
                </h4>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {isAnatomyOpen ? 'Tap to Collapse' : 'Tap to Expand'}
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Detailed physiological positions, endocrine glands, emotional balance, and healing frequencies
              </p>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-600 shadow-xs shrink-0">
            {isAnatomyOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {isAnatomyOpen && (
          <div className="p-5 sm:p-6 border-t border-emerald-900/10 space-y-4 animate-fadeIn bg-stone-50/40">
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
              The chakras are metaphysical vortexes of <em>Prana</em> (vital life force) arranged along the <em>Sushumna Nadi</em> (the central spinal bio-energetic channel). Each corresponds to a major biological nerve plexus, an endocrine master gland, and an emotional developmental stage.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {CHAKRAS_DATA.map((ch) => (
                <div
                  key={ch.id}
                  className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2 hover:border-emerald-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: ch.color }} />
                      <span className="text-sm font-bold font-heading text-stone-900">
                        {ch.number}. {ch.name}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-800">
                      {ch.frequency} Hz
                    </span>
                  </div>

                  <div className="text-xs text-stone-500 italic">
                    Sanskrit: {ch.sanskrit} • Element: {ch.element} • Mantra: &quot;{ch.mantra}&quot;
                  </div>

                  <div className="text-xs text-stone-700 space-y-1 pt-1 border-t border-stone-100">
                    <p>
                      <strong>Anatomical Position:</strong> {ch.location}
                    </p>
                    <p>
                      <strong>Healing Focus:</strong> {ch.healingBenefit}
                    </p>
                    <p className="text-stone-600">
                      <strong>Biofield Role:</strong> {ch.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
