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
	const { put } = useStandardizedApi();
	const { getPrincipal } = useAuth();

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

	async function updatePassword() {
		const principal = getPrincipal();
		passwordChangeAttemptLoading.value = true;
		try {
			let response = await put<any>('/api/app-security/update-valuation-principal', {
				userId: principal?.userId,
				username: `${principal?.username.split(' ')[0]} ${principal?.username.split(' ')[1]}`,
				email: principal?.email,
				password: unref(newPassword2),
				phoneNumber: principal?.phoneNumber,
				roleInOrganization: principal?.roleInOrganization,
				corpBranchId: principal?.branchId,
				isAccountEnabled: true,
				userRoles: principal?.userRoles,
			});

			if (response.success) {
				useToast('Password updated successfully! Will re-route', {
					type: 'success',
					title: 'Success',
				});

				return navigateTo({ name: 'exterior-home' }, { replace: true });
			}
		} catch (error) {
			console.log('An error occured: ', error);
			useToast('Failed. Try Again!', {
				type: 'error',
			});
		} finally {
			passwordChangeAttemptLoading.value = false;
		}
	}

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
