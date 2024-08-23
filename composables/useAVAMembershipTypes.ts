import { getMembershipTypes, setMembershipTypes } from '~/stores/membership-types-store';

const useAVAMembershipTypes = () => {
	const runtimeConfig = useRuntimeConfig();
	const controller = new AbortController();
	const signal = controller.signal;

	useFetch('/api/v1/control-unit/membershiptypes', {
		baseURL: runtimeConfig.public.AVA_BASE_URL,
		method: 'GET',
		signal,
		onRequest() {
			if (getMembershipTypes.value.length > 0) {
				// abort the fetch request if data exists
				controller.abort('Membership types data exists! Aborting request');
			}
		},
		onResponse({ response }) {
			if (response.status !== 200) {
				// openToast('Failed to load  membership types. Reload page!', 'danger');
			}

			setMembershipTypes(response._data);
		},
	}) as any;

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
		getMembershipTypes,
		cleanupMembershipBenefits,
	};
};

export default useAVAMembershipTypes;
