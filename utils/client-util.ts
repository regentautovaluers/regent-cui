import { parse, format } from 'date-fns';
import { ValuationStages } from '~/types';

export const stringToTitleCase = (sentence: string): string => {
	const words = sentence.split(' ');

	const capitalizedWords = words.map((word) => {
		return word.charAt(0).toUpperCase() + word.slice(1);
	});

	return capitalizedWords.join(' ');
};

export const stringToSentenceCase = (word: string): string => {
	if (word && word.length > 0) {
		const firstLetter = word.charAt(0).toUpperCase();
		const restOfWord = word.slice(1);
		return firstLetter + restOfWord;
	}
	return word;
};

export const stringToLowerCase = (word: string): string => {
	return word.toLowerCase();
};

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

export const refreshPage = () => {
	location.reload();
};

export const determineValuationStage = (
	stage: ValuationStages,
): { status: string; step: string } | null => {
	const stagesRepresentingOngoing: ValuationStages[] = [
		ValuationStages.AWAITING_ASSESSMENT,
		ValuationStages.VALUER_DRAFT,
		ValuationStages.PENDING,
		ValuationStages.AWAITING_MANAGER_APPROVAL,
		ValuationStages.AWAITING_QC_APPROVAL,
	];

	const stagesRepresentingCompleted: ValuationStages[] = [
		ValuationStages.INVOICING,
		ValuationStages.COMPLETED,
	];

	if (stagesRepresentingOngoing.includes(stage)) {
		return {
			status: 'Ongoing',
			step: (stage as number) + '/6',
		};
	}

	if (stagesRepresentingCompleted.includes(stage)) {
		return {
			status: 'Completed',
			step: '6/6',
		};
	}

	return null;
};
