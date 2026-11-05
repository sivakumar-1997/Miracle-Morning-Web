export interface WordOfDay {
  word: string;
  sanskrit: string;
  meaning: string;
  philosophicalWisdom: string;
  affirmation: string;
  contemplationPrompt: string;
}

export const WORDS_OF_DAY: WordOfDay[] = [
  {
    word: 'Serenity',
    sanskrit: 'Shanti (शान्ति)',
    meaning: 'Unshakeable internal stillness unaffected by worldly turbulence.',
    philosophicalWisdom: 'Serenity is not freedom from the storm, but the unshakeable peace within the storm. When your mind is quiet like a mountain lake, the reflection of divine truth becomes crystal clear.',
    affirmation: 'I am anchored in pristine stillness. No external event has the power to disrupt my peace without my consent.',
    contemplationPrompt: 'Where in your life can you replace hurried reaction with a deep, silent breath today?'
  },
  {
    word: 'Abundance',
    sanskrit: 'Purnatva (पूर्णत्व)',
    meaning: 'Total fullness, overflow, and consciousness of infinite universal supply.',
    philosophicalWisdom: 'Abundance is not what you acquire; it is what you tune into. The universe is endlessly generous. To receive abundance, you must first vibrate in gratitude for the abundance already present in every breath.',
    affirmation: 'I am an open channel through which infinite prosperity, vitality, and creative wealth flow continuously.',
    contemplationPrompt: 'Notice 3 subtle ways abundance has already shown up in your life this morning.'
  },
  {
    word: 'Coherence',
    sanskrit: 'Samanvaya (समन्वय)',
    meaning: 'Harmonic unity between heart, brain, and the quantum biofield.',
    philosophicalWisdom: 'When heart and brain beat in resonant rhythm, biological noise drops to zero. In this state of quantum coherence, your intentions manifest with lightning clarity and your body repairs itself.',
    affirmation: 'My heart and brain radiate synchronized coherence. I am aligned with the divine rhythm of creation.',
    contemplationPrompt: 'Place your hand on your heart right now and feel the gentle pulse that connects you to all of life.'
  },
  {
    word: 'Receptivity',
    sanskrit: 'Grahyata (ग्राह्यता)',
    meaning: 'The sacred feminine capacity to allow grace to enter without struggle.',
    philosophicalWisdom: 'We often exhaust ourselves trying to push rivers. True miracles happen when we drop resistance and become a clear, hollow flute through which the divine musician plays.',
    affirmation: 'I release all need to force outcomes. I open my hands and heart to receive divine blessings in unexpected ways.',
    contemplationPrompt: 'What heavy burden or problem can you surrender to the universe today?'
  },
  {
    word: 'Radiance',
    sanskrit: 'Tejas (तेजस्)',
    meaning: 'The inner spiritual glow born of pure awareness, discipline, and love.',
    philosophicalWisdom: 'Your radiance is your natural state when fear and judgment are swept away. Like the sun that shines without asking who deserves its rays, let your goodwill illuminate everyone you encounter.',
    affirmation: 'I radiate warmth, unconditional kindness, and divine joy wherever my footsteps take me today.',
    contemplationPrompt: 'How can you sprinkle warmth on a stranger or colleague today with your eyes or words?'
  },
  {
    word: 'Equanimity',
    sanskrit: 'Samatvam (समत्वम्)',
    meaning: 'Evenness of mind, supreme balance across pleasure and pain, praise and blame.',
    philosophicalWisdom: 'The Bhagavad Gita teaches: "Samatvam Yoga Uchyate" — Equanimity is Yoga. True spiritual mastery is remaining centered whether the world brings applause or criticism, rain or sunshine.',
    affirmation: 'I remain centered in my sovereign truth. I greet every circumstance with calm wisdom and dignified grace.',
    contemplationPrompt: 'When friction arises today, practice stepping back for 3 seconds into the role of the calm observer.'
  },
  {
    word: 'Gratitude',
    sanskrit: 'Kritajnata (कृतज्ञता)',
    meaning: 'The sacred alchemy that transforms what we have into more than enough.',
    philosophicalWisdom: 'Gratitude is not merely a social courtesy; it is the ultimate creative force in the cosmos. In the words of Rhonda Byrne and Dr. Joe Dispenza, gratitude is the emotional signature that the miracle has already taken place.',
    affirmation: 'Thank you, thank you, thank you. My entire life is a tapestry of miraculous grace.',
    contemplationPrompt: 'What ordinary blessing have you been taking for granted that deserves your heartfelt thanks right now?'
  }
];

export function getWordOfDay(dayNumber: number = 1): WordOfDay {
  const index = (dayNumber - 1) % WORDS_OF_DAY.length;
  return WORDS_OF_DAY[index];
}
