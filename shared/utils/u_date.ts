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
  const [datePart, timePart] = input.split(" ");
  const [y, m, d] = datePart!.split("-").map(Number);
  const [hh, mm, ss] = timePart!.split(":").map(Number);

  return new Date(y as number, (m as number) - 1, d, hh, mm, ss);
}

export function calculateDateRange(timeframe: FilterTimelines): {
  startDate: string;
  endDate: string;
} {
  const today = new Date();
  const formatISODate = (date: Date): string => {
    return date.toISOString().split("T")[0]!; // yyyy-MM-dd format
  };

  switch (timeframe) {
    case "today":
      return {
        startDate: formatISODate(today),
        endDate: formatISODate(today),
      };

    case "this_week": {
      // Find the most recent Sunday (start of week)
      const daysSinceSunday = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - daysSinceSunday);

      return {
        startDate: formatISODate(startOfWeek),
        endDate: formatISODate(today),
      };
    }

    case "last_thirty_days": {
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 29); // 29 days ago + today = 30 days total

      return {
        startDate: formatISODate(startDate),
        endDate: formatISODate(today),
      };
    }

    case "last_three_months": {
      const startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 3);

      return {
        startDate: formatISODate(startDate),
        endDate: formatISODate(today),
      };
    }

    case "last_six_months": {
      const startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 6);

      return {
        startDate: formatISODate(startDate),
        endDate: formatISODate(today),
      };
    }

    default:
      throw new Error(`Unsupported timeframe: ${timeframe}`);
  }
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
