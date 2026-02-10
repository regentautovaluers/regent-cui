import { defineStore } from 'pinia';
import type { ValuationPrinicpal } from '~/types/app-security/app-principal-types';

export const useValuationPrincipalStore = defineStore('valuation-principal-store', {
	state: () => ({
		principal: null as ValuationPrinicpal | null,
		loadPrincipalLoading: false as boolean,
	}),

	getters: {
		isAuthenticated: (state) => !!state.principal,
		isAdmin: (state) => state.principal?.userRoles.includes('ROLE_CORP_ADMIN') ?? false,
		isBroker: (state) => state.principal?.corpOrganization.broker ?? false,
	},

	actions: {
		setPrincipal(t: ValuationPrinicpal) {
			this.principal = t;
		},
		cleanPrincipal() {
			this.principal = null;
		},

		// toggleLoadingPrincipalState() {
		// 	console.log('before state toggled: ', this.loadPrincipalLoading);
		// 	this.loadPrincipalLoading = !this.loadPrincipalLoading;
		// 	console.log('after state toggled: ', this.loadPrincipalLoading);
		// },
	},
});
