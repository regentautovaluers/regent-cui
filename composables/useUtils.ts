import { parse, format } from "date-fns";

export default function useUtils() {
	function capitalizeFirstLetterOfEachWord(sentence: string): string {
		const words = sentence.split(" ");

		const capitalizedWords = words.map((word) => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		});

		return capitalizedWords.join(" ");
	}

	function capitalizeFirstLetter(word: string): string {
		if (word && word.length > 0) {
			const firstLetter = word.charAt(0).toUpperCase();
			const restOfWord = word.slice(1);
			return firstLetter + restOfWord;
		}
		return word;
	}

	function toTitleCase(word: string): string {
		var words = word.split(" ");

		for (var i = 0; i < words.length; i++) {
			words[i] =
				words[i].charAt(0).toUpperCase() +
				words[i].slice(1).toLowerCase();
		}

		return words.join(" ");
	}

	function lowerCaseEachLetter(word: string): string {
		return word.toLowerCase();
	}

	function formatExcelDate(unfDate: string): string {
		const parsedDate = parse(unfDate, "dd/MM/yyyy", new Date());
		const formattedDate = format(parsedDate, "yyyy-MM-dd");
		return formattedDate;
	}

	function formatServerProvidedDate(servDate: string) {
		const date = new Date(servDate);
		const formattedDate = format(date, "yyyy-MM-dd");

		return formattedDate;
	}

	function formatServerProvidedDateTime(servDateTime: string): string {
		// Parse the date string to a Date object
		const date = new Date(servDateTime);
		const formattedDateTime = format(date, "PPp");

		return formattedDateTime;
	}

	return {
		capitalizeFirstLetterOfEachWord,
		capitalizeFirstLetter,
		toTitleCase,
		lowerCaseEachLetter,
		formatExcelDate,
		formatServerProvidedDate,
		formatServerProvidedDateTime,
	};
}
