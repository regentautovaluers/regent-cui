import {
	getCollateralVerificationTokenInfo,
	setCollateralVerificationTokenInfo,
} from '~/stores/collateral-verifications-tokens-store';
import type { CollateralVerificationsTokens, CollateralVerificationsCheckType } from '~/types';
import * as tokenCharges from '~/config/collateral-verification-config';

function useCollateralVerificationTokensManagement() {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();

	// for when topping up tokens

	const initiateTopUpRequestLoading: Ref<boolean> = ref(false);

	const {
		status: fetchCollateralVerificationTokensStatus,
		execute: executeFetchCollateralVerificationTokenStatus,
	} = useFetch(`/api/v1/client-info/${getPrincipal()?.corpOrganization.corpId}`, {
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
				type: 'error',
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

	async function topUpTokens(amount: number, phoneNumber: string, invoiceNumber?: string) {
		try {
			initiateTopUpRequestLoading.value = true;

			await $fetch('/api/v1/payments/initiate-payment', {
				baseURL: runtimeConfig.public.FRAUD_DETECTION_BASE_URL,
				method: 'POST',
				body: JSON.stringify({
					branchID: 'BR-IPRS-K18AU25',
					amount: amount,
					phoneNumber: phoneNumber,
					accountReference: 'IPRS',
					transactionDesc: 'TOP-UP',
					serviceID: invoiceNumber ?? 'TOP-UP',
				}),
				onResponse({ response }) {
					if (response.ok) {
						useToast('Initiated succesfully!', {
							type: 'success',
						});
					}
				},
			});
		} catch (err) {
			console.log('Failed to initiate top up!', err);
			useToast('Failed. Try Again!', {
				type: 'error',
			});
		} finally {
			initiateTopUpRequestLoading.value = false;
		}
	}

	const searchDistribution: ComputedRef<{ searchType: string; totalSearches: number }[]> =
		computed(() => {
			let entries = [
				{
					searchType: 'National ID',
					totalSearches:
						getCollateralVerificationTokenInfo.value?.verifyNationalIdSearches ?? 0,
				},
			];

			return entries;
		});

	return {
		fetchCollateralVerificationTokensStatus,
		executeFetchCollateralVerificationTokenStatus,
		getCollateralVerificationTokenInfo,
		shouldAllowSearch,
		topUpTokens,
		initiateTopUpRequestLoading,
		searchDistribution,
	};
}

function useCollateralVerificationInvoiceManagement() {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();
	const collateralVerificationInvoices: ComputedRef<any[]> = computed(
		() => collateralVerificationInvoiceList.value?.invoices ?? [],
	);
	const totalPages: ComputedRef<number> = computed(
		() => collateralVerificationInvoiceList.value?.totalPages ?? 0,
	);
	const page: Ref<number> = ref(0);
	const pageSize: number = 10;
	const paymentStatus: Ref<'paid' | 'unpaid' | 'partial' | 'stale' | 'void' | null> = ref(null);
	const startDate: Ref<string | null> = ref(null);
	const endDate: Ref<string | null> = ref(null);

	// downloading invoice
	const invoiceDownloadLoading: Ref<boolean> = ref(false);
	const downloadedInvoice: Ref<string | null> = ref(null);
	const fileName: Ref<string | null> = ref(null);

	const {
		status: fetchCollateralVerificationInvoiceListStatus,
		execute: executeFetchCollateralVerificationInvoiceList,
		error: fetchCollateralVerificationInvoiceListError,
		data: collateralVerificationInvoiceList,
	} = useFetch(
		() => {
			let requestURL = `/api/v1/invoices/${getPrincipal()?.corpOrganization.corpId}?page=${page.value}&size=${pageSize}`;

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

	async function downloadInvoice(invoiceId: string) {
		invoiceDownloadLoading.value = true;
		try {
			// Fetch the PDF file as a binary blob.
			const response = await fetch(
				`${runtimeConfig.public.FRAUD_DETECTION_BASE_URL}/api/v1/invoices/by-id/${invoiceId}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/pdf',
					},
				},
			);

			// Check if the request was successful.
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			// Attempt to get the filename from the Content-Disposition header.
			const contentDisposition = response.headers.get('Content-Disposition');
			if (contentDisposition) {
				// Use a regular expression to find the filename.
				const filenameMatch = /filename="(.+?)"/.exec(contentDisposition);
				if (filenameMatch && filenameMatch.length > 1) {
					fileName.value = filenameMatch[1];
				}
			}

			// Get the response data as a Blob.
			const pdfBlob = await response.blob();
			downloadedInvoice.value = URL.createObjectURL(pdfBlob);
			useToast('Download successful!', {
				type: 'success',
			});
		} catch (error) {
			console.log('An error occured: ', error);
			useToast('Failed. Try Again!', {
				type: 'error',
			});
		} finally {
			invoiceDownloadLoading.value = false;
		}
	}

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
		downloadedInvoice,
		fileName,
		invoiceDownloadLoading,
		executeFetchCollateralVerificationInvoiceList,
		clearFilters,
		downloadInvoice,
	};
}

function useCollateralVerificationsHistoryManagement() {
	const { getPrincipal } = useAuth();
	const runtimeConfig = useRuntimeConfig();
	const history: ComputedRef<any[]> = computed(() => historyData.value?.history);

	const { status: fetchCollateralVerificationHistoryStatus, data: historyData } = useFetch(
		`/api/v1/client-history/${getPrincipal()?.corpOrganization.corpId}?page=0&size=5`,
		{
			key: 'collateral-verifications-history',
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
						history: response?.data.map((data: any) => ({
							searchType: data.searchType,
							date: data.createdAt,
						})),
					};
				}
			},
		},
	);

	return {
		history,
		fetchCollateralVerificationHistoryStatus,
	};
}

export {
	useCollateralVerificationTokensManagement,
	useCollateralVerificationsHistoryManagement,
	useCollateralVerificationInvoiceManagement,
};
