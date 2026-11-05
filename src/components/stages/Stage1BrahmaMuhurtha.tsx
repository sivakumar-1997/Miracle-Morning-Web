import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Clock, Compass, Brain, Sun, Volume2, VolumeX, ArrowRight, CheckCircle2, Music } from 'lucide-react';
import { calculateBrahmaMuhurtha } from '../../utils/brahmaMuhurtha';
import { audioSynth } from '../../utils/audioSynthesizer';

interface Stage1Props {
  onComplete: () => void;
}

export const Stage1BrahmaMuhurtha: React.FC<Stage1Props> = ({ onComplete }) => {
  const [sunriseHour, setSunriseHour] = useState<number>(6);
  const [sunriseMinute, setSunriseMinute] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [pledgeAccepted, setPledgeAccepted] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Pause'>('Inhale');
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [voiceGender, setVoiceGender] = useState<'female' | 'male'>('female');
  const [isAudioAnnounce, setIsAudioAnnounce] = useState<boolean>(true);

  const voiceGenderRef = useRef<'female' | 'male'>('female');
  voiceGenderRef.current = voiceGender;

  // Update clock every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  // 4-4-4-4 Pranic breath pacer cycle with vocal announcements and mild background
  useEffect(() => {
    if (!isBreathingActive) {
      audioSynth.stopPranayamaBackground();
      audioSynth.stopSpeech();
      return;
    }

    // Start mild BG soundscape (432Hz ambient drone)
    audioSynth.playPranayamaBackground(0.08);

    const phases: Array<'Inhale' | 'Hold' | 'Exhale' | 'Pause'> = ['Inhale', 'Hold', 'Exhale', 'Pause'];
    const pitches = [432, 528, 396, 432];
    let idx = 0;

    // Immediately trigger phase 0 ("Inhale")
    setBreathPhase('Inhale');
    if (isAudioAnnounce) {
      audioSynth.playSoftChime(pitches[0]);
      audioSynth.speakText('Inhale', {
        gender: voiceGenderRef.current,
        rate: 0.85,
        pitch: voiceGenderRef.current === 'female' ? 1.05 : 0.88,
      });
    }

    const interval = setInterval(() => {
      idx = (idx + 1) % phases.length;
      const nextPhase = phases[idx];
      setBreathPhase(nextPhase);

      if (isAudioAnnounce) {
        audioSynth.playSoftChime(pitches[idx]);
        audioSynth.speakText(nextPhase, {
          gender: voiceGenderRef.current,
          rate: 0.85,
          pitch: voiceGenderRef.current === 'female' ? 1.05 : 0.88,
        });
      }
    }, 4000);

    return () => {
      clearInterval(interval);
      audioSynth.stopPranayamaBackground();
      audioSynth.stopSpeech();
    };
  }, [isBreathingActive, isAudioAnnounce]);

  const handleVoiceChange = (newGender: 'female' | 'male') => {
    setVoiceGender(newGender);
    voiceGenderRef.current = newGender;
    if (isBreathingActive && isAudioAnnounce) {
      audioSynth.stopSpeech();
      setTimeout(() => {
        audioSynth.speakText(breathPhase, {
          gender: newGender,
          rate: 0.85,
          pitch: newGender === 'female' ? 1.05 : 0.88,
        });
      }, 100);
    }
  };

  const status = calculateBrahmaMuhurtha(currentTime, sunriseHour, sunriseMinute);

  const morningIntentionNote =
    'I awaken with the sacred dawn in pristine reverence. Today, my heart is coherent, my speech is kind, and my mind is anchored in infinite divine grace. I welcome abundance, vibrant health, and effortless joy into every moment.';

  const handleSpeakNote = () => {
    if (isSpeaking) {
      audioSynth.stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      audioSynth.speakText(morningIntentionNote, {
        gender: voiceGender,
        onEnd: () => setIsSpeaking(false),
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Hero Dawn Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-stone-900 text-white p-6 sm:p-10 shadow-xl border border-emerald-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Stage 1 • Divine Dawn Initiation
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold font-heading tracking-wide text-emerald-50">
            Brahma Muhurtha: The Creator&apos;s Hour
          </h2>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl font-sans">
            In timeless Vedic wisdom, <span className="text-emerald-200 font-medium">Brahma Muhurtha</span> (literally{' '}
            <em>&quot;The Time of the Creator&quot;</em>) begins exactly two Muhurthas (96 minutes) prior to sunrise. It is the
            holiest window of the 24-hour cycle, when the veil between spiritual consciousness and physical reality is thinnest.
          </p>

          {/* Live Status Card */}
          <div className="mt-6 pt-6 border-t border-emerald-500/20 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="text-xs text-emerald-200/80 font-medium flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-300" />
                Current Window
              </div>
              <div className="text-lg font-bold text-white mt-1">
                {status.startTimeStr} - {status.endTimeStr}
              </div>
              <div className="text-[11px] text-stone-300 mt-0.5">Based on {status.sunriseTimeStr} sunrise</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="text-xs text-emerald-200/80 font-medium flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-300" />
                Atmospheric State
              </div>
              <div className="text-sm font-semibold mt-1 flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    status.isActive ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                  }`}
                />
                <span className={status.isActive ? 'text-emerald-300' : 'text-amber-200'}>
                  {status.isActive ? 'Brahma Muhurtha Active Now' : 'Dawn Alignment Mode'}
                </span>
              </div>
              <div className="text-[11px] text-stone-300 mt-0.5">
                {status.isActive
                  ? `${status.timeRemainingMinutes} mins remaining in sacred peak`
                  : `Next window starts ${status.nextStartTimeStr}`}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="text-xs text-emerald-200/80 font-medium flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-300" />
                Calibrate Sunrise
              </div>
              <div className="flex items-center gap-2 mt-1">
                <select
                  value={sunriseHour}
                  onChange={(e) => setSunriseHour(Number(e.target.value))}
                  className="bg-black/30 text-white text-xs rounded-lg px-2 py-1 border border-white/20 focus:outline-emerald-400"
                  aria-label="Sunrise Hour"
                >
                  <option value={5}>05:00 AM</option>
                  <option value={6}>06:00 AM</option>
                  <option value={7}>07:00 AM</option>
                </select>
                <select
                  value={sunriseMinute}
                  onChange={(e) => setSunriseMinute(Number(e.target.value))}
                  className="bg-black/30 text-white text-xs rounded-lg px-2 py-1 border border-white/20 focus:outline-emerald-400"
                  aria-label="Sunrise Minute"
                >
                  <option value={0}>:00</option>
                  <option value={15}>:15</option>
                  <option value={30}>:30</option>
                  <option value={45}>:45</option>
                </select>
              </div>
              <div className="text-[11px] text-stone-300 mt-1">Adjust to your local timezone</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Insights: Ancient Vedic Wisdom vs Modern Neuroscience */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vedic Wisdom */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/10 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            🕉️
          </div>
          <h3 className="text-xl font-bold text-emerald-950 font-heading">
            Vedic Significance &amp; Pranic Surge
          </h3>
          <ul className="space-y-3 text-stone-600 text-sm leading-relaxed">
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-600 font-bold mt-0.5">•</span>
              <span>
                <strong>Sattva Guna Dominance:</strong> Nature is at absolute equilibrium. The three gunas shift so that
                purity, harmony, and peace (Sattva) dominate over agitation (Rajas) and lethargy (Tamas).
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-600 font-bold mt-0.5">•</span>
              <span>
                <strong>Vata Prana &amp; Nadis:</strong> The subtle energy channels (Ida and Pingala) achieve spontaneous
                balance, naturally opening the central Sushumna Nadi for profound meditative absorption.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-600 font-bold mt-0.5">•</span>
              <span>
                <strong>Pristine Atmospheric Ozone:</strong> Nascent atmospheric oxygen and pristine cosmic prana are at
                maximum purity before industrial and vehicular commotion begins.
              </span>
            </li>
          </ul>
        </div>

        {/* Modern Neuroscience */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/10 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
            <Brain className="w-5 h-5 text-teal-700" />
          </div>
          <h3 className="text-xl font-bold text-emerald-950 font-heading">
            Neurobiology &amp; Brainwave Priming
          </h3>
          <ul className="space-y-3 text-stone-600 text-sm leading-relaxed">
            <li className="flex items-start gap-2.5">
              <span className="text-teal-600 font-bold mt-0.5">•</span>
              <span>
                <strong>Theta &amp; Alpha State:</strong> As demonstrated by Dr. Joe Dispenza and neuroscientists, the brain
                transitions from delta sleep into hypnagogic theta (4–8 Hz). The critical analytical mind is pliable.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-teal-600 font-bold mt-0.5">•</span>
              <span>
                <strong>Pineal Melatonin-to-Serotonin Alchemy:</strong> The pineal gland orchestrates the endocrine shift,
                releasing biochemical precursors that enhance mood, deep intuition, and neuroplastic rewiring.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-teal-600 font-bold mt-0.5">•</span>
              <span>
                <strong>Pre-Cortisol Calm:</strong> Awakening before the sudden cortisol spike enables intentional mental
                imprinting, protecting the amygdala from reactionary stress loops.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Interactive Pranic Dawn Breath Pacer with Audio Announcement & Mild BG */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/10 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Vedic Pranayama Pacer (4-4-4-4 Sama Vritti)
            </div>
            <h4 className="text-xl sm:text-2xl font-bold font-heading text-emerald-950">
              Center Your Mind in Dawn Stillness
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl leading-relaxed">
              Box breathing harmonizes sympathetic and parasympathetic nervous systems.
              Vocal guidance announces <em>Inhale, Hold, Exhale, Pause</em> in synchrony with a mild 432 Hz dawn acoustic soundscape.
            </p>
          </div>

          {/* Voice Gender & Audio Guidance Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Female / Male Voice Selector */}
            <div className="flex items-center gap-1 bg-emerald-50/80 p-1 rounded-2xl border border-emerald-200">
              <button
                type="button"
                onClick={() => handleVoiceChange('female')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  voiceGender === 'female'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-700 hover:text-emerald-900'
                }`}
                aria-label="Select Female Voice for Breath Announcements"
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
                aria-label="Select Male Voice for Breath Announcements"
              >
                👨 Male Voice
              </button>
            </div>

            {/* Audio Guidance Announcement Toggle */}
            <button
              type="button"
              onClick={() => setIsAudioAnnounce(!isAudioAnnounce)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isAudioAnnounce
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-stone-100 text-stone-500 border-stone-200'
              }`}
              aria-label={isAudioAnnounce ? 'Mute Breath Announcements' : 'Unmute Breath Announcements'}
            >
              {isAudioAnnounce ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span>Voice Guided</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                  <span>Silent Mode</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Breath Visualizer & Play Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-stone-50 p-6 rounded-2xl border border-emerald-200/80">
          <div className="flex items-center gap-6">
            {/* Animated Dynamic Breath Orb */}
            <div
              className={`relative w-28 h-28 rounded-full flex flex-col items-center justify-center border-2 transition-all duration-1000 ${
                !isBreathingActive
                  ? 'bg-white border-stone-300 text-stone-400 shadow-xs'
                  : breathPhase === 'Inhale'
                  ? 'bg-gradient-to-tr from-emerald-200 to-teal-100 border-emerald-500 text-emerald-950 scale-110 shadow-lg ring-4 ring-emerald-400/30'
                  : breathPhase === 'Hold'
                  ? 'bg-gradient-to-tr from-teal-200 to-cyan-100 border-teal-500 text-teal-950 scale-110 shadow-lg ring-4 ring-teal-400/30'
                  : breathPhase === 'Exhale'
                  ? 'bg-gradient-to-tr from-amber-100 to-emerald-100 border-amber-400 text-amber-950 scale-95 shadow-md'
                  : 'bg-gradient-to-tr from-stone-100 to-stone-200 border-stone-400 text-stone-800 scale-90'
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider">
                {isBreathingActive ? breathPhase : 'Prana'}
              </span>
              <span className="text-[11px] font-mono mt-0.5 font-semibold opacity-80">
                {isBreathingActive ? '4 seconds' : 'Ready'}
              </span>
            </div>

            {/* Phase Guidance Description */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-700">
                  {isBreathingActive ? `Phase: ${breathPhase}` : '4-4-4-4 Cycle'}
                </span>
                {isBreathingActive && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded-full animate-pulse">
                    <Music className="w-3 h-3 text-teal-600" /> Mild 432 Hz BG Active
                  </span>
                )}
              </div>
              <h5 className="text-base sm:text-lg font-bold font-heading text-emerald-950 mt-1">
                {!isBreathingActive
                  ? 'Begin Conscious Box Breathing'
                  : breathPhase === 'Inhale'
                  ? 'Inhale deep prana through nostrils (4s)'
                  : breathPhase === 'Hold'
                  ? 'Retain breath softly at heart center (4s)'
                  : breathPhase === 'Exhale'
                  ? 'Exhale fully, releasing all tension (4s)'
                  : 'Pause in serene zero-point stillness (4s)'}
              </h5>
              <p className="text-xs text-stone-500">
                {isBreathingActive
                  ? isAudioAnnounce
                    ? `Announcing "${breathPhase}" with mild acoustic background`
                    : 'Silent breath pacer active'
                  : 'Click start to initiate voice announcements and mild background audio'}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className={`px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer ${
                isBreathingActive
                  ? 'bg-rose-700 hover:bg-rose-800 text-white'
                  : 'bg-emerald-800 hover:bg-emerald-900 text-white hover:scale-102'
              }`}
              aria-label={isBreathingActive ? 'Pause Breath Guidance' : 'Start Audio-Guided Breath'}
            >
              {isBreathingActive ? 'Pause Breath' : 'Start Audio-Guided Breath'}
            </button>
          </div>
        </div>
      </div>

      {/* The Positive Note to Start the Day */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50/60 to-stone-50 rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-base font-bold text-emerald-950 font-heading">
                Sacred Dawn Affirmation &amp; Positive Note
              </h4>
              <p className="text-xs text-stone-500">Recite aloud to anchor your subconscious frequency</p>
            </div>
          </div>

          <button
            onClick={handleSpeakNote}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300/80 text-xs font-semibold shadow-xs transition-all cursor-pointer"
            aria-label={isSpeaking ? 'Stop Dictating Note' : 'Dictate Positive Note Aloud'}
          >
            <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-emerald-600 animate-pulse' : 'text-stone-500'}`} />
            <span>{isSpeaking ? 'Speaking Affirmation...' : 'Listen to Dictation'}</span>
          </button>
        </div>

        <blockquote className="text-emerald-950 font-serif-magic text-base sm:text-xl italic leading-relaxed pl-4 border-l-4 border-emerald-600 py-1 bg-white/60 rounded-r-2xl p-4">
          &ldquo;{morningIntentionNote}&rdquo;
        </blockquote>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-emerald-200/70">
          <label className="flex items-center gap-3 cursor-pointer text-xs sm:text-sm text-stone-700">
            <input
              type="checkbox"
              checked={pledgeAccepted}
              onChange={(e) => setPledgeAccepted(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300"
            />
            <span>I consciously anchor this sacred dawn intention for my day ahead</span>
          </label>

          <button
            onClick={onComplete}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm shadow-md transition-all cursor-pointer hover:shadow-lg group"
          >
            <span>Proceed to 7 Chakras Cleansing</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
