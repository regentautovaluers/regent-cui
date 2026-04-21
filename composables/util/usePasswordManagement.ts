const usePasswordManagement = () => {
	// for password reset
	const newPassword1: Ref<string> = ref('');
	const newPassword2: Ref<string> = ref('');
	const passwordChangeAttemptLoading: Ref<boolean> = ref(false);

	// new password checks
	const hasUppercase = /[A-Z]/;
	const hasLowercase = /[a-z]/;
	const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/;
	const checksToPass = [
		'At least 8 characters',
		"At least one symbol e.g. '-', '$', '@",
		'At least one uppercase letter',
		'At least one lowercase letter',
	];

	const passesValidationRules: ComputedRef<boolean[]> = computed(() => {
		const value = unref(newPassword1) || '';
		return [
			value.length >= 8,
			hasSymbol.test(value),
			hasUppercase.test(value),
			hasLowercase.test(value),
		];
	});

	const disableNewPassword2: ComputedRef<boolean> = computed(() => {
		const value = unref(passesValidationRules);
		return value.includes(false);
	});

	async function updatePassword() {}

	return {
		newPassword1,
		newPassword2,
		passwordChangeAttemptLoading,
		passesValidationRules,
		checksToPass,
		disableNewPassword2,
		updatePassword,
	};
};

export default usePasswordManagement;
