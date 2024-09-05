const useSystemLocale = () => {
	const { locale, setLocale } = useI18n();
	const language: Ref<string> = ref('English');
	const availableLanguages: Ref<string[]> = ref(['English', 'French']);

	watch(language, (newLanguage) => {
		if (newLanguage === 'English') {
			setLocale('en');
		} else if (newLanguage === 'French') {
			setLocale('fr');
		}
	});

	return {
		language,
		availableLanguages,
	};
};

export default useSystemLocale;
