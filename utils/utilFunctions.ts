import { parse, format } from "date-fns";

export const capitalizeFirstLetterOfEachWord = (sentence: string): string => {
	const words = sentence.split(" ");

	const capitalizedWords = words.map((word) => {
		return word.charAt(0).toUpperCase() + word.slice(1);
	});

	return capitalizedWords.join(" ");
};

export const capitalizeFirstLetter = (word: string): string => {
	if (word && word.length > 0) {
		const firstLetter = word.charAt(0).toUpperCase();
		const restOfWord = word.slice(1);
		return firstLetter + restOfWord;
	}
	return word;
};

export const toTitleCase = (word: string): string => {
	var words = word.split(" ");

	for (var i = 0; i < words.length; i++) {
		words[i] =
			words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
	}

	return words.join(" ");
};

export const lowerCaseEachLetter = (word: string): string => {
	return word.toLowerCase();
};

export const formatExcelDate = (unfDate: string): string => {
	try {
		const parsedDate = parse(unfDate, "dd/MM/yyyy", new Date());
		const formattedDate = format(parsedDate, "yyyy-MM-dd");
		return formattedDate;
	} catch (e) {
		return "N/A";
	}
};

export const formatServerProvidedDate = (servDate: string) => {
	try {
		const date = new Date(servDate);
		const formattedDate = format(date, "yyyy-MM-dd");
		return formattedDate;
	} catch (e) {
		return "N/A";
	}
};

export const formatToDateTimePair = (
	dateTimeString: string
): [string, string] => {
	const date = new Date(dateTimeString);
	const dateString = format(date, "dd.MM.yyyy");
	const timeString = format(date, "HH.mm");
	return [dateString, timeString];
};

export const formatServerProvidedDateTime = (servDateTime: string): string => {
	try {
		// Parse the date string to a Date object
		const date = new Date(servDateTime);
		const formattedDateTime = format(date, "PPp");
		return formattedDateTime;
	} catch (e) {
		return "N/A";
	}
};

export const makeServiceUserFriendly = (rawType: string): string => {
	let friendlyType: string = "";
	switch (rawType) {
		case "towing":
			friendlyType = "Towing";
			break;
		case "fueldelivery":
			friendlyType = "Fuel Delivery";
			break;
		case "jumpstarting":
			friendlyType = "Jumpstarting";
			break;
		case "tyrechange":
			friendlyType = "Tyre Change";
	}

	return friendlyType;
};
