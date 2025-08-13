import {
	getCollateralVerificationTokenInfo,
	setCollateralVerificationTokenInfo,
} from '~/stores/collateral-verifications-tokens-store';
import type { CollateralVerificationsTokens, CollateralVerificationsCheckType } from '~/types';
import * as tokenCharges from '~/config/collateral-verification-config';

function useCollateralVerificationTokensManagement() {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();

	const { status: fetchCollateralVerificationTokensStatus } = useFetch(
		`/api/v1/client-info/${getPrincipal.value.corpId}`,
		{
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
		},
	);

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
		getCollateralVerificationTokenInfo,
		shouldAllowSearch,
	};
}

function useCollateralVerificationsHistoryManagement() {}

export { useCollateralVerificationTokensManagement, useCollateralVerificationsHistoryManagement };
