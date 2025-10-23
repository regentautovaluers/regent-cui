import { type TrackedVehicles } from '~/types/regent-tracking/tracked-vehicles';
import { type TraceabilityReport } from '~/types/regent-tracking/trace-report';
import SecurityUtil from '~/utils/security-util';
import { getDeviceReports } from '~/stores/regent-tracking-traceability-reports';
import type { StandardSuccessResponse } from '~/types/proxy-types';
import { type ForReport } from '~/types/regent-tracking/tracked-vehicles';

export function useDeviceTraceabilityReport() {
	const size: Ref<number> = ref(10);
	const page: Ref<number> = ref(0);
	const { fetchingClientVehicles, errorFetchingClientVehicles, getClientDevices } =
		useRegentDeviceTracking();
	const searchString: Ref<string | null> = ref(null);
	const loadingTraceabilityComments: Ref<boolean> = ref(false);
	const onlyOnWatchlist: Ref<boolean> = ref(false);
	const { getBlob, get } = useStandardizedApi();
	const loadingReportExport: Ref<boolean> = ref(false);
	const { getPrincipal } = useAuth();

	watch([onlyOnWatchlist, searchString], () => {
		// Only reset if the current page is NOT already 0
		if (page.value !== 0) {
			page.value = 0;
		}
	});

	watch(
		getClientDevices,
		async (newValue) => {
			// if there are vehicles fetch their reports
			if (newValue) {
				try {
					let results = await loadTraceabilityComments(
						newValue.map((v) => {
							return v.id;
						}),
					);
					// set the comments once -> less costly option
					results.results.forEach((r) => {
						let entry = newValue.find((e) => e.id == r.tracker_id) as TrackedVehicles;

						// trace whether vehicle is on watchlist
						if (r.comments.length > 0) {
							const latest_comment = r.comments[0];
							entry.on_watchlist = latest_comment.watchlist == 'Y' ? true : false;
						} else {
							entry.on_watchlist = false;
						}
						entry.comment = r.comments;
					});
				} catch (_err) {
					console.error('Failed to load report comments');
				} finally {
					loadingTraceabilityComments.value = false;
				}
			}
		},
		{ immediate: true },
	);

	const computedStatistics: ComputedRef<{
		total_online: number;
		total_offline: number;
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
				expiredVehicles: computedStatistics.value.expires_soon,
				totalVehicles: computedStatistics.value.total_devices,
				corporateName: getPrincipal.value?.corpName as string,
				entries: getClientDevices.value?.map((e) => {
					return {
						name: e.name,
						comment: e.comment,
						online: e.online,
						driver: { phone: e.driver_data.phone, name: e.device_data.name },
						device_data: {
							expiration_date: e.device_data.expiration_date,
							created_at: e.device_data.created_at,
						},
					};
				}),
			};
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

	async function loadTraceabilityComments(device_ids: number[]): Promise<TraceabilityReport> {
		let base64Encoded = SecurityUtil.encodeBase64(device_ids.join(','));
		let response = await get<TraceabilityReport>(
			`/api/regent-tracking/load-trace-reports?tracker_id=${base64Encoded}&limit=${device_ids.length}`,
		);

		if (!response.success) {
			useToast('Failed to load comments! Try Again!', {
				type: 'error',
				title: 'Error',
			});
			throw new Error('Failed to fetch comments!');
		}

		return (response as StandardSuccessResponse<TraceabilityReport>).data;
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
		loadingTraceabilityComments,
		loadingReportExport,
		reportToExcel,
	};
}

export function useTraceabilityReportComments() {
	const newComment: Ref<string | null> = ref(null);
	const { post } = useStandardizedApi();

	async function addNewComment(id: number) {
		let response = await post<any>('/api/regent-tracking/add-device-comment', {
			id,
			comment: newComment.value,
		});

		if (!response.success) {
			useToast('Failed to add comment! Try Again!', {
				type: 'error',
				title: 'Error',
			});
			throw new Error('Failed to add  comment!');
		}
	}
	return {
		newComment,
		addNewComment,
	};
}
