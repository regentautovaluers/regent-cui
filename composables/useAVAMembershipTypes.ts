const useAVAMembershipTypes = () => {
	const runtimeConfig = useRuntimeConfig();
	const nuxtApp = useNuxtApp();

	const { status: fetchmembershipTypesStatus, data: membershipTypes } = useFetch(
		'/api/v1/control-unit/membershiptypes',
		{
			key: 'AVA-membership-types',
			baseURL: runtimeConfig.public.AVA_BASE_URL,
			method: 'GET',
			getCachedData(key) {
				return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
			},
		},
	) as any;

	const cleanupMembershipBenefits = (inputString: string): any[] => {
		let array = JSON.parse(inputString);
		let cleanedArray: any[] = array.map((item: string) => {
			let cleanedItem = item.replace(/\\/g, '');
			cleanedItem = cleanedItem.charAt(0).toUpperCase() + cleanedItem.slice(1);
			return cleanedItem;
		});

		return cleanedArray;
	};

	return {
		membershipTypes,
		fetchmembershipTypesStatus,
		cleanupMembershipBenefits,
	};
};

export default useAVAMembershipTypes;
