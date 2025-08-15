import {
	getCollateralVerificationTokenInfo,
	setCollateralVerificationTokenInfo,
} from '~/stores/collateral-verifications-tokens-store';
import type { CollateralVerificationsTokens, CollateralVerificationsCheckType } from '~/types';
import * as tokenCharges from '~/config/collateral-verification-config';

function useCollateralVerificationTokensManagement() {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();

	const {
		status: fetchCollateralVerificationTokensStatus,
		execute: executeFetchCollateralVerificationTokenStatus,
	} = useFetch(`/api/v1/client-info/${getPrincipal.value.corpId}`, {
		key: 'collateral-verifications-tokens-metadata',
		baseURL: runtimeConfig.public.FRAUD_DETECTION_BASE_URL,
		method: 'GET',
		server: false,
		lazy: true,
		onResponse({ response }) {
			if (response.ok) {
				const data = response._data.data as CollateralVerificationsTokens;
				setCollateralVerificationTokenInfo(data);
				return;
			}

			useToast('Token Pre-Check Failed!', {
				type: 'danger',
				showIcon: true,
				showCloseButton: false,
				hideProgressBar: true,
			});
		},
	});

	function shouldAllowSearch(type: CollateralVerificationsCheckType): boolean {
		const tokensBalance = getCollateralVerificationTokenInfo.value?.balance;
		if (!tokensBalance) {
			return false;
		}

		if (getCollateralVerificationTokenInfo.value?.billingType == 'prepaid') {
			switch (type) {
				case 'alien-id':
					return tokensBalance >= tokenCharges.ALIEN_ID_TOKEN_CHARGE;
				case 'bank-account':
					return tokensBalance >= tokenCharges.BANK_ACCOUNT_TOKEN_CHARGE;
				case 'business':
					return tokensBalance >= tokenCharges.BUSINESS_VERIFIACTION_TOKEN_CHARGE;
				case 'driving-license':
					return tokensBalance >= tokenCharges.DRIVING_LICENSE_TOKEN_CHARGE;
				case 'kra-pin':
					return tokensBalance >= tokenCharges.KRA_PIN_TOKEN_CHARGE;
				case 'loan-collateral':
					return tokensBalance >= tokenCharges.COLLATERAL_CHECK_TOKEN_CHARGE;
				case 'vehicle-reg':
					return tokensBalance >= tokenCharges.VEHICLE_PLATE_TOKEN_CHARGE;
				case 'national-id':
					return tokensBalance >= tokenCharges.NATIONAL_ID_TOKEN_CHARGE;
				default:
					return false;
			}
		} else {
			return true;
		}
	}

	return {
		fetchCollateralVerificationTokensStatus,
		executeFetchCollateralVerificationTokenStatus,
		getCollateralVerificationTokenInfo,
		shouldAllowSearch,
	};
}

function useCollateralVerificationInvoiceManagement() {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();
	const collateralVerificationInvoices: ComputedRef<any[]> = computed(
		() => collateralVerificationInvoiceList.value?.invoices,
	);
	const totalPages: ComputedRef<number> = computed(
		() => collateralVerificationInvoiceList.value?.totalPages,
	);
	const page: Ref<number> = ref(0);
	const pageSize: number = 10;
	const paymentStatus: Ref<'paid' | 'unpaid' | 'partial' | 'stale' | 'void' | null> = ref(null);
	const startDate: Ref<string | null> = ref(null);
	const endDate: Ref<string | null> = ref(null);

	const {
		status: fetchCollateralVerificationInvoiceListStatus,
		execute: executeFetchCollateralVerificationInvoiceList,
		error: fetchCollateralVerificationInvoiceListError,
		data: collateralVerificationInvoiceList,
	} = useFetch(
		() => {
			let requestURL = `/api/v1/invoices/${getPrincipal.value.corpId}?page=${page.value}&size=${pageSize}`;

			if (startDate.value !== null) {
				requestURL = requestURL + `&startDate=${startDate.value}`;
			}

			if (endDate.value !== null) {
				requestURL = requestURL + `&endDate=${endDate.value}`;
			}

			if (paymentStatus.value !== null) {
				requestURL = requestURL + `&paymentStatus=${paymentStatus.value}`;
			}

			return requestURL;
		},
		{
			key: 'collateral-verifications-invoices',
			baseURL: runtimeConfig.public.FRAUD_DETECTION_BASE_URL,
			method: 'GET',
			server: false,
			lazy: true,
			transform(response: any) {
				if (
					response?.data &&
					Array.isArray(response.data) &&
					(response.data as []).length > 0
				) {
					return {
						invoices: response.data,
						totalPages: response.pagination?.pages || 0,
					};
				} else {
					return {
						valuations: [],
						totalPages: 0,
					};
				}
			},
			watch: [page],
		},
	);

	function clearFilters(): void {
		startDate.value = null;
		endDate.value = null;
		paymentStatus.value = null;

		// ecxecute the request
		executeFetchCollateralVerificationInvoiceList();
	}

	return {
		page,
		paymentStatus,
		startDate,
		endDate,
		totalPages,
		collateralVerificationInvoices,
		fetchCollateralVerificationInvoiceListStatus,
		fetchCollateralVerificationInvoiceListError,
		executeFetchCollateralVerificationInvoiceList,
		clearFilters,
	};
}

function useCollateralVerificationsHistoryManagement() {}

export {
	useCollateralVerificationTokensManagement,
	useCollateralVerificationsHistoryManagement,
	useCollateralVerificationInvoiceManagement,
};
