import { useStorage } from "@vueuse/core";

export const usePrincipal = defineStore("PrincipalStore", () => {
	const principal = useStorage("principal", {});

	const getDetails: Ref<any> = computed(() => principal.value);

	async function setDetails(userDetails: Object): Promise<void> {
		principal.value = userDetails;
	}

	async function nullOutDetails(): Promise<void> {
		principal.value = null;
	}

	return {
		getDetails,
		setDetails,
		nullOutDetails,
	};
});
