import { type TrackedVehicles, type Online } from '~/types/regent-tracking/tracked-vehicles';

export default function useDeviceTraceabilityReport() {
	const size: Ref<number> = ref(10);
	const page: Ref<number> = ref(0);
	const { fetchingClientVehicles, errorFetchingClientVehicles, getClientDevices } =
		useRegentDeviceTracking();
	const searchString: Ref<string | null> = ref(null);

	const totalPages: ComputedRef<number> = computed(() => {
		if (!getClientDevices.value) {
			return 0;
		} else return Math.ceil(getClientDevices.value.length / size.value);
	});

	const computedStatistics: ComputedRef<{
		total_online: number;
		total_offline: number;
		new_installations: number;
		expires_soon: number;
		total_devices: number;
		dist: {
			online_dist: number;
			offline_dist: number;
		};
	}> = computed(() => {
		if (!getClientDevices.value) {
			return {
				total_online: 0,
				total_offline: 0,
				new_installations: 0,
				expires_soon: 0,
				total_devices: 0,
				dist: {
					online_dist: 0,
					offline_dist: 0,
				},
			};
		} else {
			const stats = getClientDevices.value.reduce(
				(acc, v) => ({
					total_online:
						acc.total_online + (['ack', 'engine', 'online'].includes(v.online) ? 1 : 0),
					total_offline: acc.total_offline + (v.online == 'offline' ? 1 : 0),
					new_installations:
						acc.new_installations + (isLastMonth(v.device_data.created_at) ? 1 : 0),
					expires_soon:
						acc.expires_soon +
						(!v.device_data.expiration_date
							? 0
							: expiresWithin30Days(v.device_data.expiration_date)
								? 1
								: 0),
					total_devices: acc.total_devices + 1,
					dist: {
						online_dist: 0,
						offline_dist: 0,
					},
				}),
				{
					total_online: 0,
					total_offline: 0,
					new_installations: 0,
					expires_soon: 0,
					total_devices: 0,
					dist: {
						online_dist: 0,
						offline_dist: 0,
					},
				},
			);

			stats.dist = {
				online_dist: deriveDistribution(stats.total_online, stats.total_offline),
				offline_dist: deriveDistribution(stats.total_offline, stats.total_online),
			};
			return stats;
		}
	});

	const computedVehicles: ComputedRef<TrackedVehicles[] | null> = computed(() => {
		if (!getClientDevices.value) {
			return null;
		}

		let filteredVehicles = getClientDevices.value;

		// Filter by search string
		if (searchString.value) {
			const lowerCaseSearch = searchString.value.toLowerCase();
			filteredVehicles = filteredVehicles.filter(
				(v) =>
					// Check for a match in name, which is assumed to always exist
					(v.name && v.name.toLowerCase().includes(lowerCaseSearch)) ||
					// Use optional chaining for regNo to safely check if it exists before filtering
					v.driver_data.name?.toLowerCase().includes(lowerCaseSearch),
			);
		}

		// Paginate the filtered results
		const startIndex = page.value * size.value;
		const endIndex = (page.value + 1) * size.value;
		const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex) as TrackedVehicles[];

		return paginatedVehicles.length ? paginatedVehicles : null;
	});

	function isLastMonth(dateStr: string | Date): boolean {
		const date = new Date(dateStr);
		const lastMonth = new Date();
		lastMonth.setMonth(lastMonth.getMonth() - 1);
		return (
			date.getMonth() === lastMonth.getMonth() &&
			date.getFullYear() === lastMonth.getFullYear()
		);
	}

	function expiresWithin30Days(dateStr: string | Date): boolean {
		const expiryDate = new Date(dateStr);
		const today = new Date();
		const thirtyDaysFromNow = new Date();
		thirtyDaysFromNow.setDate(today.getDate() + 30);
		return expiryDate >= today && expiryDate <= thirtyDaysFromNow;
	}

	function deriveDistribution(a: number, b: number): number {
		const total = a + b;
		return Number(((a * 100) / total).toFixed(2));
	}

	return {
		page,
		size,
		searchString,
		computedVehicles,
		fetchingClientVehicles,
		errorFetchingClientVehicles,
		totalPages,
		computedStatistics,
	};
}
