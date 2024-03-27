import { parse, format } from "date-fns";

export default function useUtils() {
	function capitalizeFirstLetterOfEachWord(sentence: string): string {
		// Split the sentence into an array of words
		const words = sentence.split(" ");

		// Capitalize the first letter of each word
		const capitalizedWords = words.map((word) => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		});

		// Join the words back together into a sentence
		return capitalizedWords.join(" ");
	}

	function capitalizeFirstLetter(word: string): string {
		// Check if the word is not empty
		if (word && word.length > 0) {
			// Extract the first character and convert it to uppercase
			const firstLetter = word.charAt(0).toUpperCase();
			// Concatenate the rest of the string starting from the second character
			const restOfWord = word.slice(1);
			// Return the modified string
			return firstLetter + restOfWord;
		}
		// If the word is empty, return it as is
		return word;
	}

	function toTitleCase(word: string): string {
		// Split the string into an array of words
		var words = word.split(" ");

		// Iterate over each word in the array
		for (var i = 0; i < words.length; i++) {
			// Convert the first character of each word to uppercase and the rest to lowercase
			words[i] =
				words[i].charAt(0).toUpperCase() +
				words[i].slice(1).toLowerCase();
		}

		// Join the words back together into a single string
		return words.join(" ");
	}

	function formatCalendarDate(unfDate: string): string {
		// Parse the input date with the format dd/mm/yyyy
		const parsedDate = parse(unfDate, "dd/MM/yyyy", new Date());
		// Format the parsed date to dd-mm-yyyy
		const formattedDate = format(parsedDate, "dd-MM-yyyy");
		return formattedDate;
	}

	function formatExcelDate(unfDate: string): string {
		// Parse the input date with the format yyyy-mm-dd
		const parsedDate = parse(unfDate, "yyyy-MM-dd", new Date());
		// Format the parsed date to dd-mm-yyyy
		const formattedDate = format(parsedDate, "dd-MM-yyyy");
		return formattedDate;
	}

	return {
		capitalizeFirstLetterOfEachWord,
		capitalizeFirstLetter,
		toTitleCase,
		formatCalendarDate,
		formatExcelDate,
	};
}
