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

export function calculateTimePassed(timestamp: BigInt): { durationPassed: string; isNew: boolean } {
	// Convert BigInt timestamp to a regular number for calculations.
	const pastTime = Number(timestamp);
	const now = Date.now();
	const diffInMs = now - pastTime;

	// Define time constants in milliseconds.
	const minute = 60 * 1000;
	const hour = minute * 60;
	const day = hour * 24;
	const week = day * 7;
	const month = day * 30; // Approximation for a month
	const year = day * 365; // Approximation for a year

	let durationPassed = '';
	let isNew = diffInMs < week;

	if (diffInMs < minute) {
		durationPassed = 'just now';
	} else if (diffInMs < hour) {
		const minutes = Math.floor(diffInMs / minute);
		durationPassed = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
	} else if (diffInMs < day) {
		const hours = Math.floor(diffInMs / hour);
		durationPassed = `${hours} hour${hours > 1 ? 's' : ''} ago`;
	} else if (diffInMs < week) {
		const days = Math.floor(diffInMs / day);
		durationPassed = `${days} day${days > 1 ? 's' : ''} ago`;
	} else if (diffInMs < month) {
		const weeks = Math.floor(diffInMs / week);
		durationPassed = `${weeks} week${weeks > 1 ? 's' : ''} ago`;
	} else if (diffInMs < year) {
		const months = Math.floor(diffInMs / month);
		durationPassed = `${months} month${months > 1 ? 's' : ''} ago`;
	} else {
		const years = Math.floor(diffInMs / year);
		durationPassed = `${years} year${years > 1 ? 's' : ''} ago`;
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

export const screenFormatRAServiceName = (rawType: string): string => {
	let friendlyType: string = '';
	switch (rawType) {
		case 'towing':
			friendlyType = 'Towing';
			break;
		case 'fueldelivery':
			friendlyType = 'Fuel Delivery';
			break;
		case 'jumpstarting':
			friendlyType = 'Jumpstarting';
			break;
		case 'tyrechange':
			friendlyType = 'Tyre Change';
	}

	return friendlyType;
};
