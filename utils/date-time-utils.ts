import { parse, format } from 'date-fns';

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

export function calculateTimePassed(timestamp: string): { durationPassed: string; isNew: boolean } {
	const pastTime = new Date(timestamp).getTime();
	const now = Date.now();
	const diffInMs = now - pastTime;

	// Time constants in milliseconds
	const MS_PER_SECOND = 1000;
	const MS_PER_MINUTE = 60 * MS_PER_SECOND;
	const MS_PER_HOUR = 60 * MS_PER_MINUTE;
	const MS_PER_DAY = 24 * MS_PER_HOUR;
	const MS_PER_WEEK = 7 * MS_PER_DAY;
	const MS_PER_MONTH = 30 * MS_PER_DAY; // Approximation
	const MS_PER_YEAR = 365 * MS_PER_DAY; // Approximation

	const isNew = diffInMs < MS_PER_WEEK;

	const pluralize = (count: number, unit: string) =>
		`${count} ${unit}${count > 1 ? 's' : ''} ago`;

	let durationPassed: string;

	if (diffInMs < MS_PER_MINUTE) {
		durationPassed = 'just now';
	} else if (diffInMs < MS_PER_HOUR) {
		durationPassed = pluralize(Math.floor(diffInMs / MS_PER_MINUTE), 'minute');
	} else if (diffInMs < MS_PER_DAY) {
		durationPassed = pluralize(Math.floor(diffInMs / MS_PER_HOUR), 'hour');
	} else if (diffInMs < MS_PER_WEEK) {
		durationPassed = pluralize(Math.floor(diffInMs / MS_PER_DAY), 'day');
	} else if (diffInMs < MS_PER_MONTH) {
		durationPassed = pluralize(Math.floor(diffInMs / MS_PER_WEEK), 'week');
	} else if (diffInMs < MS_PER_YEAR) {
		durationPassed = pluralize(Math.floor(diffInMs / MS_PER_MONTH), 'month');
	} else {
		durationPassed = pluralize(Math.floor(diffInMs / MS_PER_YEAR), 'year');
	}

	return { durationPassed, isNew };
}

export const formatExcelDate = (unfDate: string): string => {
	try {
		const parsedDate = parse(unfDate, 'dd/MM/yyyy', new Date());
		const formattedDate = format(parsedDate, 'yyyy-MM-dd');
		return formattedDate;
	} catch (e) {
		return 'N/A';
	}
};

export const formatServerProvidedDate = (servDate: string): string => {
	try {
		const date = new Date(servDate);
		const formattedDate = format(date, 'yyyy-MM-dd');
		return formattedDate;
	} catch (e) {
		return 'N/A';
	}
};

export const formatToDateTimePair = (dateTimeString: string): [string, string] => {
	const date = new Date(dateTimeString);
	const dateString = format(date, 'dd.MM.yyyy');
	const timeString = format(date, 'HH.mm');
	return [dateString, timeString];
};

export const formatServerProvidedDateTime = (servDateTime: string): string => {
	try {
		// Parse the date string to a Date object
		const date = new Date(servDateTime);
		const formattedDateTime = format(date, 'PPp');
		return formattedDateTime;
	} catch (e) {
		return 'N/A';
	}
};

export const formatExcelTemplateDate = (dateObj: Date): string => {
	return format(dateObj, 'yyyy-MM-dd');
};

export function deriveMinDate(t: number): string {
	const date = new Date();

	// Subtract 3 months from the current month
	date.setMonth(date.getMonth() - t);

	// Set to the first day of that month
	date.setDate(1);

	return date.toISOString().split('T')[0];
}

export function deriveMaxDate(): string {
	const date = new Date();
	return date.toISOString().split('T')[0];
}
