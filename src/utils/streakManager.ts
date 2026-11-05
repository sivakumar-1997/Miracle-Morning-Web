import { DailyRecord, UserProfile } from '../types';

export const STORAGE_KEY_USER = 'morning_miracles_user';
export const STORAGE_KEY_RECORDS = 'morning_miracles_records';
export const STORAGE_KEY_BLESSINGS_PREFIX = 'morning_miracles_blessings_';

/**
 * Format date to YYYY-MM-DD
 */
export function formatDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Checks if two date strings in YYYY-MM-DD format are consecutive days
 */
export function isConsecutiveDay(prevDateStr: string, nextDateStr: string): boolean {
  if (!prevDateStr || !nextDateStr) return false;
  const prev = new Date(prevDateStr + 'T00:00:00');
  const next = new Date(nextDateStr + 'T00:00:00');
  const diffTime = next.getTime() - prev.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}

/**
 * Calculates current day number in the 28-day Magic cycle (1 to 28)
 */
export function calculateMagicDay(startDateStr: string, currentDateStr: string = formatDateKey()): number {
  if (!startDateStr) return 1;
  const start = new Date(startDateStr + 'T00:00:00');
  const current = new Date(currentDateStr + 'T00:00:00');
  const diffTime = current.getTime() - start.getTime();
  const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  // 28 days cycle: Day 1 to Day 28, then loops back to Day 1
  return (diffDays % 28) + 1;
}

/**
 * Update user streak when a day is completed
 */
export function updateStreakRecord(
  profile: UserProfile,
  completedDateStr: string = formatDateKey()
): { profile: UserProfile; streakIncreased: boolean } {
  const newProfile = { ...profile };

  if (profile.lastActiveDate === completedDateStr) {
    // Already counted for today
    return { profile: newProfile, streakIncreased: false };
  }

  let newStreak = 1;
  if (profile.lastActiveDate && isConsecutiveDay(profile.lastActiveDate, completedDateStr)) {
    newStreak = profile.currentStreak + 1;
  } else if (!profile.lastActiveDate) {
    newStreak = 1;
  } else {
    // Streak was broken, restart at 1
    newStreak = 1;
  }

  newProfile.currentStreak = newStreak;
  newProfile.longestStreak = Math.max(newProfile.longestStreak, newStreak);
  newProfile.lastActiveDate = completedDateStr;
  newProfile.totalDaysCompleted += 1;
  newProfile.magicDayNumber = calculateMagicDay(newProfile.startDate, completedDateStr);

  return { profile: newProfile, streakIncreased: true };
}

/**
 * Default guest profile
 */
export function getInitialProfile(): UserProfile {
  const today = formatDateKey();
  return {
    id: 'guest_' + Math.random().toString(36).substring(2, 9),
    email: 'seeker@morningmiracles.app',
    displayName: 'Conscious Seeker',
    currentStreak: 1,
    longestStreak: 1,
    lastActiveDate: '',
    startDate: today,
    totalDaysCompleted: 0,
    magicDayNumber: 1
  };
}

/**
 * Load user profile from localStorage with fallback
 */
export function loadStoredProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (raw) {
      const parsed = JSON.parse(raw);
      // recalculate magic day based on start date
      parsed.magicDayNumber = calculateMagicDay(parsed.startDate || formatDateKey());
      return parsed;
    }
  } catch {
    // fallback
  }
  const initial = getInitialProfile();
  saveStoredProfile(initial);
  return initial;
}

/**
 * Save user profile to localStorage
 */
export function saveStoredProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile to localStorage', e);
  }
}
