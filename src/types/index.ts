export interface ChakraInfo {
  id: string;
  number: number;
  name: string;
  sanskrit: string;
  frequency: number; // in Hz
  color: string;
  glowColor: string;
  bgLight: string;
  borderLight: string;
  location: string;
  element: string;
  mantra: string;
  affirmation: string;
  description: string;
  healingBenefit: string;
  yPercent: number; // position on human body silhouette (0 to 100%)
  xPercent: number;
}

export interface BlessingItem {
  id: string;
  topic: string;
  reason: string;
  completed: boolean;
}

export interface MagicDayPractice {
  day: number;
  title: string;
  theme: string;
  quote: string;
  morningPractice: string;
  eveningPractice: string;
  actionItems: string[];
  defaultBlessings: { topic: string; reason: string }[];
}

export interface BookReference {
  id: string;
  title: string;
  author: string;
  subtitle: string;
  category: 'Gratitude & Law of Attraction' | 'Mind & Neuroscience' | 'Water Alchemy & Vibration' | 'Sleep & Subconscious' | 'Longevity & Purpose';
  year: string;
  coverAccent: string;
  summary: string;
  coreConcepts: string[];
  morningTakeaway: string;
  eveningTakeaway: string;
  famousQuote: string;
}

export interface DailyRecord {
  date: string; // YYYY-MM-DD
  morningCompleted: boolean;
  eveningCompleted: boolean;
  chakrasCleanseMinutes: number;
  hoOponoponoCount: number;
  waterSipsCount: number;
  blessingsCount: number;
  magicRockReflection: string;
  notes?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  startDate: string;
  totalDaysCompleted: number;
  magicDayNumber: number; // 1 to 28
}

export interface BrahmaMuhurthaStatus {
  isActive: boolean;
  startTimeStr: string;
  endTimeStr: string;
  sunriseTimeStr: string;
  timeRemainingMinutes: number;
  nextStartTimeStr: string;
  vibrationalQuality: string;
}
