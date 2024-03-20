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

	return { capitalizeFirstLetterOfEachWord };
}
