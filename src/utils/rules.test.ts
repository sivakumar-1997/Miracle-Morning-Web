import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateBrahmaMuhurtha } from './brahmaMuhurtha';
import { calculateMagicDay, isConsecutiveDay, updateStreakRecord, getInitialProfile } from './streakManager';

test('calculateBrahmaMuhurtha calculates windows properly', () => {
  // Mock time at 04:30 AM with sunrise at 06:00 AM
  const mockDate = new Date('2026-11-04T04:30:00');
  const status = calculateBrahmaMuhurtha(mockDate, 6, 0);

  // Sunrise 6:00 -> start 4:24 AM (96 mins before), end 5:12 AM (48 mins before)
  // At 4:30 AM, it should be active!
  assert.equal(status.isActive, true);
  assert.ok(status.timeRemainingMinutes > 0);
  assert.ok(status.vibrationalQuality.length > 10);
});

test('calculateBrahmaMuhurtha returns inactive outside window', () => {
  // Mock time at 10:00 AM with sunrise at 06:00 AM
  const mockDate = new Date('2026-11-04T10:00:00');
  const status = calculateBrahmaMuhurtha(mockDate, 6, 0);
  assert.equal(status.isActive, false);
});

test('isConsecutiveDay detects consecutive days', () => {
  assert.equal(isConsecutiveDay('2026-11-03', '2026-11-04'), true);
  assert.equal(isConsecutiveDay('2026-10-31', '2026-11-01'), true);
  assert.equal(isConsecutiveDay('2026-11-01', '2026-11-04'), false);
  assert.equal(isConsecutiveDay('2026-11-04', '2026-11-04'), false);
});

test('calculateMagicDay cycles through 28 days and loops', () => {
  const start = '2026-01-01';
  assert.equal(calculateMagicDay(start, '2026-01-01'), 1);
  assert.equal(calculateMagicDay(start, '2026-01-05'), 5);
  assert.equal(calculateMagicDay(start, '2026-01-28'), 28);
  // Day 29 should refresh/loop to Day 1
  assert.equal(calculateMagicDay(start, '2026-01-29'), 1);
  // Day 30 should be Day 2
  assert.equal(calculateMagicDay(start, '2026-01-30'), 2);
});

test('updateStreakRecord increments streak on consecutive days', () => {
  const initial = getInitialProfile();
  initial.lastActiveDate = '2026-11-03';
  initial.currentStreak = 5;
  initial.longestStreak = 5;

  const { profile, streakIncreased } = updateStreakRecord(initial, '2026-11-04');
  assert.equal(streakIncreased, true);
  assert.equal(profile.currentStreak, 6);
  assert.equal(profile.longestStreak, 6);
  assert.equal(profile.lastActiveDate, '2026-11-04');
});
