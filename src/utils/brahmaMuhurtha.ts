import { BrahmaMuhurthaStatus } from '../types';

/**
 * Calculates Brahma Muhurtha timing.
 * Traditionally in Vedic science:
 * 1 Muhurtha = 48 minutes.
 * Brahma Muhurtha is the penultimate muhurtha before sunrise (starts 2 muhurthas / 96 mins before sunrise,
 * ends 1 muhurtha / 48 mins before sunrise).
 * Some traditions extend it until sunrise. We provide the 96 min pre-sunrise window (approx 03:45 AM - 05:30 AM).
 */
export function calculateBrahmaMuhurtha(
  currentTime: Date = new Date(),
  sunriseHour: number = 6,
  sunriseMinute: number = 0
): BrahmaMuhurthaStatus {
  const current = new Date(currentTime);
  
  // Create sunrise time for today
  const todaySunrise = new Date(current);
  todaySunrise.setHours(sunriseHour, sunriseMinute, 0, 0);

  // Start of Brahma Muhurtha: 96 minutes before sunrise
  const bmStartToday = new Date(todaySunrise.getTime() - 96 * 60 * 1000);
  // End of Brahma Muhurtha: 48 minutes before sunrise (or at sunrise)
  const bmEndToday = new Date(todaySunrise.getTime() - 48 * 60 * 1000);

  // If current time is after today's sunrise, next Brahma Muhurtha is tomorrow
  let targetStart = bmStartToday;
  let targetEnd = bmEndToday;

  if (current.getTime() > bmEndToday.getTime()) {
    // Tomorrow's window
    const tomorrowSunrise = new Date(todaySunrise.getTime() + 24 * 60 * 60 * 1000);
    targetStart = new Date(tomorrowSunrise.getTime() - 96 * 60 * 1000);
    targetEnd = new Date(tomorrowSunrise.getTime() - 48 * 60 * 1000);
  }

  const isActive = current.getTime() >= bmStartToday.getTime() && current.getTime() <= bmEndToday.getTime();

  const formatTime = (d: Date): string => {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  let minutesDiff = 0;
  if (isActive) {
    minutesDiff = Math.max(0, Math.round((bmEndToday.getTime() - current.getTime()) / (60 * 1000)));
  } else {
    minutesDiff = Math.max(0, Math.round((targetStart.getTime() - current.getTime()) / (60 * 1000)));
  }

  return {
    isActive,
    startTimeStr: formatTime(bmStartToday),
    endTimeStr: formatTime(bmEndToday),
    sunriseTimeStr: formatTime(todaySunrise),
    timeRemainingMinutes: minutesDiff,
    nextStartTimeStr: formatTime(targetStart),
    vibrationalQuality: isActive
      ? 'The cosmic vortex is open: Melatonin synthesis converts to Serotonin, Sattvic purity is peak, and pineal intuition is at maximum clarity.'
      : 'Calm dawn atmosphere: The mind is receptive and ready to absorb divine gratitude before daily sensory stimulation begins.'
  };
}
