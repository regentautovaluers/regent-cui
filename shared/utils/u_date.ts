import { parseISO, format } from "date-fns";

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
