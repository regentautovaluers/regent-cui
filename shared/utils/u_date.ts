import { parseISO, format, formatDistanceToNow } from "date-fns";

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
  console.log(input)
  const [datePart, timePart] = input.split(" ");
  const [y, m, d] = datePart!.split("-").map(Number);
  const [hh, mm, ss] = timePart!.split(":").map(Number);

  return new Date(y as number, (m as number) - 1, d, hh, mm, ss);
}
