import { type StandardSuccessResponse, type StandardErrorResponse } from '~/types/proxy-types';

interface VehicleValue {
	name: string;
	value: number;
}
export default function () {
	const { params: routeParams } = useRoute();
	const { getValuationAuthToken } = useAuth();
	const activeImage: Ref<number> = ref(0);
	const imageStretched: Ref<boolean> = ref(true);

	const {
		pending: fetchingValuationReport,
		error: errorFetchingValuationReport,
		execute: refetchValuationReport,
		data: valuationReport,
	} = useApiData<any>(
		'valuation-report',
		computed(() => `/api/vehicle-valuation/get-valuation-report`),
		{
			// lazy: true,
			server: false,
			query: {
				api_key: getValuationAuthToken.value,
				valuation_id: routeParams.valuation_id,
			},
			transform: (response) => {
				// The response.data is correctly typed as TrackedVehicles[] here.
				return (response as StandardSuccessResponse<any>).data;
			},
		},
	);

	const availableValues: ComputedRef<VehicleValue[]> = computed(() => {
		const v: VehicleValue[] = [];
		const report = unref(valuationReport);
		
		if (report) {
			const vehicleValue = report.awardedValues;
			if (vehicleValue.marketValue != null) {
				v.push({ value: vehicleValue.marketValue, name: 'Market Value' });
			}

			if (vehicleValue.assessedValue != null) {
				v.push({ value: vehicleValue.assessedValue, name: 'Assessed Value' });
			}

			if (vehicleValue.forcedSaleValue != null) {
				v.push({
					value: vehicleValue.forcedSaleValue,
					name: 'Forced Sale Value',
				});
			}

			if (vehicleValue.windscreenValue != null) {
				v.push({
					value: vehicleValue.windscreenValue,
					name: 'Windscreen Value',
				});
			}

			if (vehicleValue.windscreenDealersPriceValue != null) {
				v.push({
					value: vehicleValue.windscreenDealersPriceValue,
					name: 'W/Screen D.P. Value',
				});
			}

			if (vehicleValue.radioValue != null) {
				v.push({ value: vehicleValue.radioValue, name: 'Radio Value' });
			}

			if (vehicleValue.infotainmentValue != null) {
				v.push({
					value: vehicleValue.infotainmentValue,
					name: 'Infotainment Value',
				});
			}

			if (vehicleValue.twoWayRadioValue != null) {
				v.push({
					value: vehicleValue.twoWayRadioValue,
					name: 'Two-Way Radio Value',
				});
			}

			if (vehicleValue.dutyFree != null) {
				v.push({ value: vehicleValue.dutyFree, name: 'Duty Free Value' });
			}

			if (vehicleValue.dutyPaid != null) {
				v.push({ value: vehicleValue.dutyPaid, name: 'Duty Paid Value' });
			}
		}

		return v;
	});

	return {
		fetchingValuationReport,
		errorFetchingValuationReport,
		valuationReport,
		activeImage,
		imageStretched,
		availableValues,
		refetchValuationReport,
	};
}
