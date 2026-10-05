import schedule from '@/data/blog-schedule.json';

// Daily drip-publishing for blog articles.
// Edit src/data/blog-schedule.json to change when an article goes live — nothing else needed.
// Articles that are not listed there are always live.

function zoneOffsetMs(utcMs: number, timeZone: string): number {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
      .formatToParts(new Date(utcMs))
      .map((p) => [p.type, p.value])
  );
  const asUtc = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  return asUtc - Math.floor(utcMs / 1000) * 1000;
}

/** Converts a wall-clock date + time in a named time zone (e.g. Morocco) to an absolute UTC instant. */
export function zonedTimeToUtcMs(date: string, time: string, timeZone: string): number {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  let ms = guess - zoneOffsetMs(guess, timeZone);
  ms = guess - zoneOffsetMs(ms, timeZone); // second pass handles clock changes (e.g. Ramadan)
  return ms;
}

/** The instant (ms since epoch) an article goes live, or null if it is always live. */
export function getPublishAt(slug: string): number | null {
  const value = (schedule.posts as Record<string, string>)[slug];
  if (!value) return null;
  if (value.length > 10) {
    const ms = Date.parse(value);
    return Number.isNaN(ms) ? null : ms;
  }
  return zonedTimeToUtcMs(value, schedule.time, schedule.timeZone);
}

export function isSlugPublished(slug: string, now: number = Date.now()): boolean {
  const at = getPublishAt(slug);
  return at === null || at <= now;
}
