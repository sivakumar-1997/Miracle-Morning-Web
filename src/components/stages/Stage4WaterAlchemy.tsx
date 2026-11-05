import React, { useState } from 'react';
import { Droplets, Sparkles, Volume2, ArrowRight, Award, CheckCircle2, Heart } from 'lucide-react';
import { audioSynth } from '../../utils/audioSynthesizer';

interface Stage4Props {
  onComplete: () => void;
}

const WATER_AFFIRMATIONS = [
  {
    step: 1,
    title: 'Abundance & Wealth Flow',
    phrase: 'Money and infinite financial abundance flow effortlessly into my life in expected and unexpected ways.',
    intention: 'Charging water with the frequency of gratitude and limitless prosperity.',
  },
  {
    step: 2,
    title: 'Cellular Health & Vitality',
    phrase: 'My physical health is in a good manner; every organ and cell vibrates with radiant vitality and youth.',
    intention: 'Imprinting molecular coherence for biological rejuvenation and healing.',
  },
  {
    step: 3,
    title: 'Divine Harmony & Love',
    phrase: 'I am deeply loved, completely safe, and surrounded by sacred peace and affectionate goodwill.',
    intention: 'Infusing the water with emotional tranquility and heart coherence.',
  },
  {
    step: 4,
    title: 'Cosmic Trust & Joy',
    phrase: 'I trust the divine timing of the universe; every breath I take aligns me with miraculous joy.',
    intention: 'Surrendering doubt and opening to effortless quantum synchronicity.',
  },
];

export const Stage4WaterAlchemy: React.FC<Stage4Props> = ({ onComplete }) => {
  const [sipsCount, setSipsCount] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [waterBlessed, setWaterBlessed] = useState<boolean>(false);
  const [voiceGender, setVoiceGender] = useState<'female' | 'male'>('female');

  const handleSip = () => {
    if (sipsCount >= 7) return;
    const nextCount = sipsCount + 1;
    setSipsCount(nextCount);
    // Play soothing crystal chime for each conscious sip
    audioSynth.playWaterSipChime(nextCount);
  };

  const handleResetSips = () => {
    setSipsCount(0);
  };

  const handleStartOrRestartDictation = (genderToUse?: 'female' | 'male') => {
    audioSynth.stopSpeech();
    setIsSpeaking(true);
    speakStep(0, genderToUse || voiceGender);
  };

  const handleStopDictation = () => {
    audioSynth.stopSpeech();
    setIsSpeaking(false);
  };

  const handleVoiceChange = (newGender: 'female' | 'male') => {
    setVoiceGender(newGender);
    if (isSpeaking) {
      // Pause speech and immediately restart with the chosen voice
      audioSynth.stopSpeech();
      setTimeout(() => {
        speakStep(activeStepIndex, newGender);
      }, 150);
    }
  };

  const speakStep = (idx: number, activeGender?: 'female' | 'male') => {
    if (idx >= WATER_AFFIRMATIONS.length) {
      setIsSpeaking(false);
      return;
    }

    setActiveStepIndex(idx);
    const item = WATER_AFFIRMATIONS[idx];
    // Speak header and description only, without "Step 1" or "Step 2"
    const speechText = `${item.title}. ${item.phrase}`;
    const gender = activeGender || voiceGender;

    audioSynth.speakText(speechText, {
      rate: 0.88,
      gender: gender,
      onEnd: () => {
        setTimeout(() => speakStep(idx + 1, gender), 800);
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-900 text-xs font-semibold uppercase tracking-wider">
          <Droplets className="w-3.5 h-3.5 text-cyan-700" />
          Stage 4 • Molecular Alchemy
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-emerald-950">
          Water Manifestation Alchemy
        </h2>
        <p className="text-stone-600 text-sm">
          Drawing from Dr. Masaru Emoto&apos;s breakthrough research in <em>The Hidden Messages in Water</em>.
          Water molecules structure into symmetrical hexagonal crystals when infused with conscious love and positive affirmations.
        </p>
      </div>

      {/* Dr. Masaru Emoto Scientific Background & Blessing Prayer */}
      <div className="bg-gradient-to-br from-cyan-950 via-teal-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-cyan-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              ❄️
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-heading text-cyan-100">
                Dr. Masaru Emoto&apos;s Water Memory Science
              </h3>
              <p className="text-xs text-stone-300">High-speed cryogenic photography of water crystals</p>
            </div>
          </div>

          <label className="flex items-center gap-2.5 bg-white/10 px-3.5 py-2 rounded-xl border border-white/15 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={waterBlessed}
              onChange={(e) => setWaterBlessed(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400"
            />
            <span className="font-semibold text-cyan-200">
              {waterBlessed ? 'Water Blessed with Love ✓' : 'Hold glass with both hands'}
            </span>
          </label>
        </div>

        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
          Dr. Emoto showed that water exposed to expressions of <strong>&quot;Love and Gratitude&quot;</strong> and 528 Hz frequencies
          forms breathtaking, flawless hexagonal crystalline mandalas, while hostile words form murky, broken shapes.
          Because human biology is <strong>over 70% water</strong>, the words spoken over your morning glass restructure
          your cellular hydrology from within.
        </p>

        {/* Sacred Water Prayer Protocol */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-4 h-4 text-cyan-400" />
            Sacred Prayer over the Water Glass
          </div>
          <p className="text-sm font-serif-magic italic text-cyan-50 leading-relaxed">
            &ldquo;Water of life, I thank you for your purity and nourishment. I infuse you with unconditional love, radiant health,
            infinite abundance, and peace. As you enter my body, transmute every cell into crystalline harmony.&rdquo;
          </p>
        </div>
      </div>

      {/* The 4 Manifestation Steps / Positive Intentions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-emerald-950 font-heading">
              The Four Manifestation Decrees
            </h3>
            <p className="text-xs text-stone-500">Dictate these intentions directly into your water before sipping</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Voice Gender Selector */}
            <div className="flex items-center gap-1 bg-emerald-50/80 p-1 rounded-2xl border border-emerald-200">
              <button
                type="button"
                onClick={() => handleVoiceChange('female')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  voiceGender === 'female'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-700 hover:text-emerald-900'
                }`}
                aria-label="Select Female Voice for Water Decrees"
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
                aria-label="Select Male Voice for Water Decrees"
              >
                👨 Male Voice
              </button>
            </div>

            {!isSpeaking ? (
              <button
                onClick={() => handleStartOrRestartDictation()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold shadow-xs transition-all cursor-pointer"
                aria-label="Dictate the 4 Water Manifestation Steps"
              >
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span>Dictate All 4 Decrees</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStartOrRestartDictation()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  aria-label="Restart Dictation from Beginning"
                >
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  <span>Restart Dictation</span>
                </button>
                <button
                  onClick={handleStopDictation}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  aria-label="Pause Dictation"
                >
                  <span>Pause</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WATER_AFFIRMATIONS.map((item, idx) => {
            const isCurrent = isSpeaking && activeStepIndex === idx;

            return (
              <div
                key={item.step}
                className={`p-5 rounded-2xl border-2 transition-all ${
                  isCurrent
                    ? 'border-cyan-500 bg-cyan-50/70 shadow-md ring-2 ring-cyan-400/30'
                    : 'border-stone-200 bg-stone-50/50 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-700">
                    Step {item.step}
                  </span>
                  <span className="text-[11px] font-semibold text-cyan-800">
                    {item.title}
                  </span>
                </div>

                <div className="mt-3 text-base font-semibold text-stone-900 font-serif-magic">
                  &ldquo;{item.phrase}&rdquo;
                </div>

                <div className="mt-2 text-xs text-stone-600">
                  {item.intention}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* The 7 Sips of Water Interactive Chamber */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50/70 to-cyan-50/80 rounded-3xl p-6 sm:p-8 border border-cyan-200/80 shadow-sm relative overflow-hidden">
        {/* Subtle Hexagonal Crystal Water Mandala Backdrop */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 border border-cyan-300/30 rounded-full pointer-events-none opacity-40 animate-spin-slow" />
        <div className="absolute -right-6 -bottom-6 w-48 h-48 border border-teal-400/25 rotate-45 pointer-events-none opacity-40" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          {/* Glass Visual & Sip Counter */}
          <div className="flex items-center gap-6">
            {/* Elegant Alchemical Glass Vessel */}
            <div className="relative w-24 h-32 bg-white/95 rounded-b-3xl rounded-t-xl border-2 border-cyan-400/80 shadow-lg p-1.5 flex flex-col justify-end overflow-hidden ring-4 ring-cyan-200/40">
              {/* Water Level Fill with wave ripple */}
              <div
                className="w-full bg-gradient-to-t from-cyan-600 via-teal-400 to-cyan-300 rounded-b-2xl transition-all duration-700 relative overflow-hidden"
                style={{ height: `${Math.min(100, Math.max(18, (sipsCount / 7) * 100))}%` }}
              >
                {/* Surface shimmering wave */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-white/50 animate-pulse" />

                {/* Animated Rising Bubbles */}
                <div className="absolute w-1.5 h-1.5 bg-white/70 rounded-full left-2 bottom-1 animate-bounce" />
                <div className="absolute w-2 h-2 bg-white/70 rounded-full left-8 bottom-3 animate-bounce delay-150" />
                <div className="absolute w-1 h-1 bg-white/80 rounded-full right-3 bottom-2 animate-bounce delay-75" />
              </div>

              {/* Sip Badge */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-bold text-sm text-cyan-950 font-mono drop-shadow-xs">
                  {sipsCount}/7
                </span>
                <span className="text-[9px] uppercase tracking-wider font-semibold text-cyan-900/80">
                  {sipsCount >= 7 ? 'Complete' : 'Sips'}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-800">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Conscious Hydration Ritual
              </div>
              <h4 className="text-xl sm:text-2xl font-bold font-heading text-emerald-950">
                The Seven Sacred Sips
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 max-w-sm leading-relaxed">
                Drink in 7 slow, reverent sips. Each sip rings a 528 Hz water alchemy crystal chime to awaken cellular absorption.
              </p>
            </div>
          </div>

          {/* Interactive Sip Button */}
          <div className="flex flex-col items-center gap-2.5">
            <button
              onClick={handleSip}
              disabled={sipsCount >= 7}
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm sm:text-base shadow-lg transition-all cursor-pointer ${
                sipsCount >= 7
                  ? 'bg-emerald-700 text-white cursor-default ring-2 ring-emerald-400/40'
                  : 'bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white hover:shadow-cyan-500/30'
              }`}
              aria-label={sipsCount >= 7 ? 'Completed 7 Sips' : `Take Sip ${sipsCount + 1} of 7`}
            >
              <Droplets className={`w-5 h-5 ${sipsCount < 7 ? 'animate-bounce' : 'fill-current'}`} />
              <span>{sipsCount >= 7 ? 'All 7 Sips Blessed & Complete! ✓' : `Sip Button (${sipsCount}/7)`}</span>
            </button>

            {sipsCount > 0 && (
              <button
                onClick={handleResetSips}
                className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
              >
                Reset Sips Counter
              </button>
            )}
          </div>
        </div>

        {/* 7 Sips Visual Progress Indicators */}
        <div className="grid grid-cols-7 gap-2 mt-6 pt-5 border-t border-cyan-200/80">
          {[1, 2, 3, 4, 5, 6, 7].map((num) => {
            const isDone = sipsCount >= num;
            return (
              <div
                key={num}
                className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition-all ${
                  isDone
                    ? 'bg-cyan-600 text-white shadow-xs scale-102 font-bold'
                    : 'bg-white text-stone-400 border border-stone-200'
                }`}
              >
                <div className="text-[10px] opacity-75">Sip</div>
                <div className="font-mono text-sm">{num}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Step */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onComplete}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm shadow-md transition-all cursor-pointer hover:shadow-lg group"
        >
          <span>Proceed to Word of the Day &amp; 10 Blessings</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
