import { type TrackedVehicles } from '~/types/regent-tracking/tracked-vehicles';
import { getDeviceReports } from '~/stores/regent-tracking-traceability-reports';
import { type ForReport } from '~/types/regent-tracking/tracked-vehicles';

export function useDeviceTraceabilityReport() {
	const size: Ref<number> = ref(10);
	const page: Ref<number> = ref(0);
	const { fetchingClientVehicles, errorFetchingClientVehicles, getClientDevices } =
		useRegentDeviceTracking();
	const searchString: Ref<string | null> = ref(null);
	const onlyOnWatchlist: Ref<boolean> = ref(false);
	const { getBlob } = useStandardizedApi();
	const loadingReportExport: Ref<boolean> = ref(false);
	const { getPrincipal } = useAuth();

	watch([onlyOnWatchlist, searchString], () => {
		// Only reset if the current page is NOT already 0
		if (page.value !== 0) {
			page.value = 0;
		}
	});

	const computedStatistics: ComputedRef<{
		total_online: number;
		total_offline: number;
		total_expired: number;
		new_installations: number;
		expires_soon: number;
		total_devices: number;
		total_on_watchlist: number;
		dist: {
			online_dist: number;
			offline_dist: number;
		};
	}> = computed(() => {
		if (!getClientDevices.value) {
			return {
				total_online: 0,
				total_offline: 0,
				total_expired: 0,
				new_installations: 0,
				expires_soon: 0,
				total_devices: 0,
				total_on_watchlist: 0,
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
					total_expired: acc.total_expired + (v.online == 'expired' ? 1 : 0),
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
					total_on_watchlist: acc.total_on_watchlist + (v.on_watchlist ? 1 : 0),
					dist: {
						online_dist: 0,
						offline_dist: 0,
					},
				}),
				{
					total_online: 0,
					total_offline: 0,
					total_expired: 0,
					new_installations: 0,
					expires_soon: 0,
					total_devices: 0,
					total_on_watchlist: 0,
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

	const computedVehicles: ComputedRef<{
		vehicles: TrackedVehicles[] | null;
		totalPages: number;
	}> = computed(() => {
		const filtered = getFilteredVehicles();
		const start = page.value * size.value;
		return {
			vehicles: !filtered.length
				? null
				: (filtered.slice(start, start + size.value) as TrackedVehicles[]),
			totalPages: Math.ceil(filtered.length / size.value) || 1,
		};
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

	function getFilteredVehicles() {
		if (!getClientDevices.value) return [];

		const vehicles = getClientDevices.value;
		const search = searchString.value ? searchString.value.toLowerCase() : '';

		return vehicles.filter((v) => {
			// 1. Watchlist Filter
			const passesWatchlistFilter = !onlyOnWatchlist.value || v.on_watchlist;

			// 2. Search Filter
			const passesSearchFilter =
				!search ||
				v.name?.toLowerCase().includes(search) ||
				v.driver_data.name?.toLowerCase().includes(search);

			// A vehicle must pass BOTH filters to be included
			return passesWatchlistFilter && passesSearchFilter;
		});
	}

	async function reportToExcel(): Promise<void> {
		try {
			loadingReportExport.value = true;
			let requestBody: {
				offlineVehicles: number;
				onlineVehicles: number;
				expiredVehicles: number;
				totalVehicles: number;
				corporateName: string;
				entries: ForReport[];
			} = {
				offlineVehicles: computedStatistics.value.total_offline,
				onlineVehicles: computedStatistics.value.total_online,
				expiredVehicles: computedStatistics.value.total_expired,
				totalVehicles: computedStatistics.value.total_devices,
				corporateName: getPrincipal.value?.corpName as string,
				entries: getClientDevices.value?.map((e) => {
					return {
						name: e.name,
						comment: e.comment,
						online: e.online,
						tail: e.tail,
						lat: e.lat,
						lng: e.lng,
						stop_duration_sec: e.stop_duration_sec,
						moved_timestamp: e.moved_timestamp,
						total_distance: e.total_distance,
						protocol: e.protocol,
						driver: { phone: e.driver_data.phone, name: e.driver_data.name },
						device_data: {
							expiration_date: e.device_data.expiration_date,
							created_at: e.device_data.created_at,
						},
						traccar: {
							moved_at: e.device_data.traccar.moved_at,
							stoped_at: e.device_data.traccar.stoped_at,
							move_begin_at: e.device_data.traccar.move_begin_at,
							stop_begin_at: e.device_data.traccar.stop_begin_at,
							parked_end_at: e.device_data.traccar.parked_end_at,
							engine_on_at: e.device_data.traccar.engine_on_at,
							engine_off_at: e.device_data.traccar.engine_off_at,
							engine_changed_at: e.device_data.traccar.engine_changed_at,
							updated_at: e.device_data.traccar.updated_at,
							course: e.device_data.traccar.course,
							speed: e.device_data.traccar.speed,
						},
						wrapped_status: deriveProperTrackerStatus(
							e.online,
							e.device_data.expiration_date,
						).proper_status,
					};
				}),
			};

			console.log(requestBody.entries[0]);
			const blob = await getBlob('/api/regent-tracking/export-excel-report', {
				method: 'POST',
				body: requestBody,
			});

			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', 'export.xlsx');
			document.body.appendChild(link);
			link.click();
			link.parentNode?.removeChild(link);
			window.URL.revokeObjectURL(url); // Clean up memory
		} catch (ex) {
			console.log(ex);
			useToast('Export failed! Try Again!', {
				type: 'error',
				title: 'Error',
			});
		} finally {
			loadingReportExport.value = false;
		}
	}

	return {
		page,
		size,
		searchString,
		computedVehicles,
		fetchingClientVehicles,
		errorFetchingClientVehicles,
		onlyOnWatchlist,
		computedStatistics,
		getDeviceReports,
		getClientDevices,
		loadingReportExport,
		reportToExcel,
	};
}

export function useTraceabilityReportComments() {
	const newComment: Ref<string | null> = ref(null);
	const { post } = useStandardizedApi();
	const addNewCommentLoading: Ref<boolean> = ref(false);

	async function addNewComment(id: number) {
		try {
			addNewCommentLoading.value = true;
			let response = await post<any>('/api/regent-tracking/add-device-comment', {
				id,
				comment: newComment.value,
				corp_client: getPrincipal?.value?.corpName ?? 'Unknown',
			});

			if (response.success) {
				useToast('Comment Added Successfully. Kindly Reload!', {
					type: 'success',
					title: 'Success',
				});
			}
		} catch (ex) {
			useToast('Failed to add comment! Try Again!', {
				type: 'error',
				title: 'Error',
			});
		} finally {
			addNewCommentLoading.value = false;
		}
	}
	return {
		newComment,
		addNewCommentLoading,
		addNewComment,
	};
}
