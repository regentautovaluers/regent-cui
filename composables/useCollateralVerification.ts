const useCollateralVerficiation = () => {
	const collateralCheckLoading = ref(false);
	const runtimeConfig = useRuntimeConfig();
	const responseData: Ref<any> = ref(null);

	const verifyCollateral = async (requestBody: {}, checkType: string) => {
		collateralCheckLoading.value = true;
		try {
			await $fetch(`/api/v1/verification/${checkType}`, {
				baseURL: runtimeConfig.public.FRAUD_DETECTION_BASE_URL,
				method: 'POST',
				body: JSON.stringify(requestBody),

				onResponse({ response }) {
					if (response.ok) {
						useToast('Success!', {
							type: 'success',
							showIcon: true,
							showCloseButton: false,
							hideProgressBar: true,
							transition: 'slide',
						});

						responseData.value = response._data.data;
					}
				},
			});
		} catch (err) {
			console.log('Failed to delete fraud record', err);
			useToast('Failed. Try Again!', {
				type: 'danger',
				showIcon: true,
				showCloseButton: false,
				hideProgressBar: true,
				transition: 'slide',
			});
		} finally {
			collateralCheckLoading.value = false;
		}
	};

	return {
		responseData,
		collateralCheckLoading,
		verifyCollateral,
	};
};

export default useCollateralVerficiation;
