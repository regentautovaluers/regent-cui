import type { AVAMembershipType } from '~/types/ava-roadside-assistance/memebership-types';

const useAVAMembershipTypes = () => {
	const nuxtApp = useNuxtApp();

	const {
		pending: fetchingMembershipTypes,
		error: errorFetchingMembershipTypes,
		data: membershipTypes,
	} = useApiData<AVAMembershipType[], AVAMembershipType[]>(
		'AVA-membership-types',
		computed(() => '/api/roadside-assistance/get-membership-types'),
		{
			server: false,
			method: 'GET',
			getCachedData(key) {
				return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
			},
			transform: (response) => {
				return response.data;
			},
			onResponseError: (_e) => {
				useToast('Failed to load memberships! Try Again', {
					type: 'error',
					title: 'Unable to load memberships!',
				});
			},
		},
	);

	return {
		membershipTypes,
		fetchingMembershipTypes,
		errorFetchingMembershipTypes,
	};
};

export default useAVAMembershipTypes;
