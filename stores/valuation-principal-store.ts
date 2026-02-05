import { defineStore } from 'pinia';
import type { ValuationPrinicpal } from '~/types/app-security/app-principal-types';

export const useValuationPrincipalStore = defineStore('valuation-principal-store', () => {
	const principal: Ref<ValuationPrinicpal | null> = ref(null);
	const isGetValuationPrincipalLoading: Ref<boolean> = ref(false);

	function getPrincipal(): ValuationPrinicpal | null {
		return principal.value;
	}

	function setPrincipal(t: ValuationPrinicpal) {
		principal.value = t;
	}

	function cleanPrincipal() {
		principal.value = null;
	}

	function toggleLoadingValuationPrincipalState() {
		isGetValuationPrincipalLoading.value = !isGetValuationPrincipalLoading.value;
	}

	function getLoadingValuationPrincipalState(): boolean {
		return isGetValuationPrincipalLoading.value;
	}

	return {
		getPrincipal,
		setPrincipal,
		cleanPrincipal,
		toggleLoadingValuationPrincipalState,
		getLoadingValuationPrincipalState,
	};
});
