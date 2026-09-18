import {
  parseISO,
  formatDistanceToNow,
  isPast,
  format,
  subDays,
  subMonths,
  subYears,
  startOfWeek,
} from "date-fns";

// Helper to add ordinal suffix (st, nd, rd, th)
function getOrdinal(day: number): string {
  if (day > 3 && day < 21) return `${day}th`; // 11th–20th
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

export function formatDateToWords(dateString: string | null): string {
  if (!dateString) return "";

  const date = parseISO(dateString);

  const dayOfWeek = format(date, "EEE"); // Mon, Tue, etc.
  const day = getOrdinal(Number(format(date, "d"))); // 13th, 21st, etc.
  const month = format(date, "MMM"); // March, August, etc.
  const year = format(date, "yy"); // 2026

  return `${dayOfWeek} ${day} ${month}, ${year}`;
}

export function isDateInThePast(dateString: string): boolean {
  const inputDate = new Date(dateString.replace(/-/g, "/"));

  return inputDate.getTime() < new Date().getTime();
}

/**
 * Returns a human-readable string representing the time elapsed since the given date.
 * Examples: "1 minute ago", "2 hours ago", "30 days ago", "6 months ago", "1 year ago"
 */
export function getTimeAgo(date: Date): string {
  return formatDistanceToNow(date, {
    addSuffix: true,
    includeSeconds: false, // Set to true if you want "less than a minute" details
  });
}

export function dateStringToDate(
  input: string /* format 'YYYY-MM-DD HH:mm:ss'*/,
) {
  const [datePart, timePart] = input.split(" ");
  const [y, m, d] = datePart!.split("-").map(Number);
  const [hh, mm, ss] = timePart!.split(":").map(Number);

  return new Date(y as number, (m as number) - 1, d, hh, mm, ss);
}

export function calculateDateRange(
  timeframe: ExtendedTimelineFilters,
): DateRangeForFilters {
  const today = new Date();
  const DATE_FORMAT = "yyyy-MM-dd";

  let startDate: Date;

  switch (timeframe) {
    case "today":
      startDate = today;
      break;

    case "this_week":
      // Gets the Sunday leading up to today
      startDate = startOfWeek(today, { weekStartsOn: 0 });
      break;

    case "last_thirty_days":
      startDate = subDays(today, 30);
      break;

    case "last_three_months":
      startDate = subMonths(today, 2);
      break;

    case "last_six_months":
      startDate = subMonths(today, 6);
      break;

    case "last_one_year":
      startDate = subYears(today, 1);
      break;

    default: {
      // const _exhaustiveCheck: never = timeframe;
      throw new Error("Unsupported timeframe!");
    }
  }

  return {
    startDate: format(startDate, DATE_FORMAT),
    endDate: format(today, DATE_FORMAT),
  };
}

export function calculateTimeDifferenceSeconds(
  end: string,
  start: string,
): number {
  const endTime = dateStringToDate(end).getTime();
  const startTime = dateStringToDate(start).getTime();
  if (isNaN(endTime) || isNaN(startTime)) return 0;
  return Math.floor((endTime - startTime) / 1000);
}

/**
 * Formats a total number of seconds back into a clean "HHh MMmin SSs" string.
 */
export function formatSecondsToDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) return "0s";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let result = "";
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0 || (hours > 0 && seconds > 0)) result += `${minutes}min `;
  result += `${seconds}s`;

  return result.trim();
}

/**
 * Accepts an example date string like '2021-02-01T00:00:00.000Z' and returns the date part only
 * e.g.2021-02-01
 */
export function extractDate(isoInput: string | Date | unknown): string {
  if (!isoInput) {
    return ""; // Handle null, undefined, or empty strings gracefully
  }

  // If it's already a Date object, use it; otherwise parse the string
  const dateObj =
    isoInput instanceof Date ? isoInput : parseISO(String(isoInput));

  return format(dateObj, "yyyy-MM-dd");
}

export function isDateInPast(dateString: string): boolean {
  const date = parseISO(dateString);
  return isPast(date);
}

export function expiresWithinXDays(
  dateStr: string | Date,
  days: number,
): boolean {
  const expiryDate = new Date(dateStr);
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + days);
  return expiryDate >= today && expiryDate <= thirtyDaysFromNow;
}

export function isLastMonth(dateStr: string | Date): boolean {
  const date = new Date(dateStr);
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  return (
    date.getMonth() === lastMonth.getMonth() &&
    date.getFullYear() === lastMonth.getFullYear()
  );
}
