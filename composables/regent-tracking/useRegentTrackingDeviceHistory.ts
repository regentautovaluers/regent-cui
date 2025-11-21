import { type DeviceHistory, type DayMovement } from '~/types/regent-tracking/device-history';
import { type StandardSuccessResponse, type StandardErrorResponse } from '~/types/proxy-types';
import { type AnalyzedLocation } from '~/types/regent-tracking/device-history';
import { getTrackedVehicle } from '~/stores/regent-tracking-devices-store';

export function useRegentTrackingDeviceHistory() {
	const { query } = useRoute();
	const filterPeriod: Ref<
		'today' | 'this-week' | 'last-30-days' | 'last-3-months' | 'last-6-months' | 'custom'
	> = ref('today');
	const positionOnMap: Ref<{
		lat: number;
		lng: number;
		event: 'start' | 'stop' | 'idle';
		time: string;
		location: string | null;
	} | null> = ref(null);
	const polylineCoords: Ref<{ lat: number; lng: number }[] | null> = ref(null);
	const { name: routeName } = useRoute();
	const fromDate: Ref<string | null> = ref(null);
	const toDate: Ref<string | null> = ref(null);
	const { authToken } = useRegentTrackingAuth();
	const { get } = useStandardizedApi();

	function setPolylineCoords(input: { lat: number; lng: number }[]) {
		polylineCoords.value = input;
	}

	function setFilterPeriod(
		period: 'today' | 'this-week' | 'last-30-days' | 'last-3-months' | 'custom',
	) {
		filterPeriod.value = period;
		executeFetchDeviceHistory();
	}

	function setPositionOnMap(
		position: {
			lat: number;
			lng: number;
			event: 'start' | 'stop' | 'idle';
			time: string;
			location: string | null;
		} | null,
	) {
		positionOnMap.value = position;
	}

	function calculateDateRange(
		timeframe:
			| 'today'
			| 'this-week'
			| 'last-30-days'
			| 'last-3-months'
			| 'last-6-months'
			| 'custom',
	): {
		startDate: string;
		endDate: string;
	} {
		const today = new Date();
		const formatDate = (date: Date): string => {
			return date.toISOString().split('T')[0]; // yyyy-MM-dd format
		};

		switch (timeframe) {
			case 'today':
				return {
					startDate: formatDate(today),
					endDate: formatDate(today),
				};

			case 'this-week': {
				// Find the most recent Sunday (start of week)
				const daysSinceSunday = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
				const startOfWeek = new Date(today);
				startOfWeek.setDate(today.getDate() - daysSinceSunday);

				return {
					startDate: formatDate(startOfWeek),
					endDate: formatDate(today),
				};
			}

			case 'last-30-days': {
				const startDate = new Date(today);
				startDate.setDate(today.getDate() - 29); // 29 days ago + today = 30 days total

				return {
					startDate: formatDate(startDate),
					endDate: formatDate(today),
				};
			}

			case 'last-3-months': {
				const startDate = new Date(today);
				startDate.setMonth(today.getMonth() - 3);

				return {
					startDate: formatDate(startDate),
					endDate: formatDate(today),
				};
			}

			case 'last-6-months': {
				const startDate = new Date(today);
				startDate.setMonth(today.getMonth() - 6);

				return {
					startDate: formatDate(startDate),
					endDate: formatDate(today),
				};
			}

			default:
				throw new Error(`Unsupported timeframe: ${timeframe}`);
		}
	}

	const computedURL: ComputedRef<string> = computed(() => {
		let requestUrl = `/api/regent-tracking/device-history?api_hash=${authToken.value}&device_id=${routeName == 'regent-tracking-vehicle-history' ? query.device_id : getTrackedVehicle.value?.id}&from_time=00:00:00&to_time=23:59:59`;

		if (filterPeriod.value == 'custom') {
			requestUrl = requestUrl + `&from_date=${fromDate.value}&to_date=${toDate.value}`;
		} else {
			let dateRange = calculateDateRange(filterPeriod.value);
			requestUrl =
				requestUrl + `&from_date=${dateRange.startDate}&to_date=${dateRange.endDate}`;
		}

		return requestUrl;
	});

	const {
		data: deviceHistory,
		pending: fetchingDeviceHistory,
		error: errorFetchingDeviceHistory,
		execute: executeFetchDeviceHistory,
		clear: clearDeviceHistory,
	} = useApiData<DeviceHistory, DeviceHistory>(
		`device-history-${routeName == 'regent-tracking-vehicle-history' ? query.device_id : getTrackedVehicle.value?.id}`,
		computedURL,
		{
			method: 'GET',
			server: false,
			immediate: routeName == 'regent-tracking-vehicle-history' ? true : false,
			transform: (response) => {
				// Check if the API call was successful
				if (response.success) {
					// The response.data is correctly typed as DeviceHistory here.
					return (response as StandardSuccessResponse<DeviceHistory>).data;
				}

				// If it failed, throw the error
				throw new Error(
					(response as StandardErrorResponse).metadata.message || 'Unknown error',
				);
			},
		},
	);

	const nestingAreas: ComputedRef<AnalyzedLocation[]> = computed(() => {
		if (deviceHistory.value) {
			let result = analyzeNestingAreas(deviceHistory.value);
			result = calculateLocationTimeFractions(result);

			return result;
		}

		return [];
	});

	const deviceMovement = computed<DayMovement[]>(() => {
		if (!deviceHistory.value || !Array.isArray(deviceHistory.value.items)) {
			return [];
		}

		return analyzeVehicleTripHistory(deviceHistory.value);
	});

	const combinedDeviceMovement: ComputedRef<{ lat: number; lng: number }[] | null> = computed(
		() =>
			deviceMovement.value.length == 0
				? null
				: deviceMovement.value.flatMap((e) => e.pingHistory),
	);

	async function fetchMultipleDeviceHistory(
		deviceIds: number[],
		period: 'today' | 'this-week' | 'last-30-days' | 'last-3-months' | 'last-6-months',
	): Promise<DeviceHistory[]> {
		let requests = deviceIds.map((id) => {
			let requestUrl = `/api/regent-tracking/device-history?api_hash=${authToken.value}&device_id=${id}&from_time=00:00:00&to_time=23:59:59`;

			let dateRange = calculateDateRange(period);
			requestUrl =
				requestUrl + `&from_date=${dateRange.startDate}&to_date=${dateRange.endDate}`;

			return get<DeviceHistory>(requestUrl);
		});
		const responses = await Promise.allSettled(requests);

		return responses
			.filter(
				(
					result,
				): result is PromiseFulfilledResult<StandardSuccessResponse<DeviceHistory>> => {
					// First check if promise fulfilled
					if (result.status !== 'fulfilled') {
						return false;
					}

					// Then check if response is a success response
					return result.value.success === true && 'data' in result.value;
				},
			)
			.map((result) => result.value.data);
	}

	return {
		filterPeriod,
		deviceHistory,
		fetchingDeviceHistory,
		errorFetchingDeviceHistory,
		nestingAreas,
		deviceMovement,
		positionOnMap,
		polylineCoords,
		fromDate,
		toDate,
		combinedDeviceMovement,
		setFilterPeriod,
		setPositionOnMap,
		setPolylineCoords,
		executeFetchDeviceHistory,
		clearDeviceHistory,
		fetchMultipleDeviceHistory,
	};
}
