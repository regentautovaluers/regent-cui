import { useStorage, type RemovableRef } from "@vueuse/core";

export const usePrincipal = defineStore("PrincipalStore", () => {
	const principal: RemovableRef<object> = useStorage("principal", {});

	const getDetails: Ref<any> = computed(() => principal.value);

	async function setDetails(userDetails: Object): Promise<void> {
		principal.value = userDetails;
	}

	async function nullOutPrincipalDetails(): Promise<void> {
		principal.value = null;
	}

	function assertPrincipalExists(): boolean {
		if (!principal.value) {
			return false; // false as in there is no principal
		} else {
			return true;
		}
	}

	return {
		getDetails,
		setDetails,
		nullOutPrincipalDetails,
		assertPrincipalExists,
	};
});
