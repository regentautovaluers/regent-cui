import { getMembershipTypes, setMembershipTypes } from '~/stores/membership-types-store';

const useAVAMembershipTypes = () => {
	const runtimeConfig = useRuntimeConfig();
	const controller = new AbortController();
	const signal = controller.signal;

	const { status: fetchmembershipTypesStatus } = useFetch(
		'/api/v1/control-unit/membershiptypes',
		{
			key: 'AVA-membership-types',
			baseURL: runtimeConfig.public.AVA_BASE_URL,
			method: 'GET',
			server: false,
			lazy: true,
			signal,
			onRequest() {
				if (getMembershipTypes.value.length > 0) {
					// abort the fetch request if data exists
					controller.abort('Membership types data exists! Aborting request');
				}
			},
			onResponse({ response }) {
				if (response.status === 200) {
					setMembershipTypes(response._data);
				}
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
		fetchmembershipTypesStatus,
		getMembershipTypes,
		cleanupMembershipBenefits,
	};
};

export default useAVAMembershipTypes;
