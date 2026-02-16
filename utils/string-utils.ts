import { marked } from 'marked';

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

export function generateRandomLengthedString(length: number = 12) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

export function renderMarkdown(mdtext: string) {
	if (!mdtext) return '';
	// 'marked.parse' converts the markdown string to HTML
	return marked.parse(mdtext);
}
