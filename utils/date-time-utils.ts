export function isDateInThePast(dateString: string): boolean {
	const inputDate = new Date(dateString.replace(/-/g, '/'));

	return inputDate.getTime() < new Date().getTime();
}

/**
 * Formats a total number of seconds back into a clean "HHh MMmin SSs" string.
 */
export function formatSecondsToDuration(totalSeconds: number): string {
	if (totalSeconds <= 0) return '0s';

	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	let result = '';
	if (hours > 0) result += `${hours}h `;
	if (minutes > 0 || (hours > 0 && seconds > 0)) result += `${minutes}min `;
	result += `${seconds}s`;

	return result.trim();
}

/**
 * Calculates the time difference in seconds between two ISO-like timestamps.
 */
export function calculateTimeDifferenceSeconds(end: string, start: string): number {
	const endTime = new Date(end).getTime();
	const startTime = new Date(start).getTime();
	if (isNaN(endTime) || isNaN(startTime)) return 0;
	return Math.floor((endTime - startTime) / 1000);
}
