import type { CookieRef } from '#app';
import { Loader } from '@googlemaps/js-api-loader';
import { type TrackedDevice, type TrackerInstallationCertificate } from '~/types';
import * as Excel from 'exceljs';
import * as FileSaver from 'file-saver';

const outputExcel = async (data: TrackerInstallationCertificate[], outputFile: string) => {
	const workbook = new Excel.Workbook();
	const worksheet = workbook.addWorksheet(
		new Date().toLocaleDateString().replaceAll('/', '-') + ' Traceability Report',
	);
	worksheet.columns = [
		{
			header: 'Client Name',
			key: 'clientName',
			width: 30,
		},
		{
			header: 'Phone Number',
			key: 'clientNo',
			width: 20,
		},
		{
			header: 'Vehicle Registration',
			key: 'regno',
			width: 10,
		},
		{
			header: 'Installation Date',
			key: 'installationDate',
			width: 15,
		},
		{
			header: 'Renewal Date',
			key: 'renewalDate',
			width: 15,
		},
		{
			header: 'Status Update',
			key: 'renewalDate',
			width: 50,
		},
	];

	worksheet.addRows(data);

	workbook.xlsx
		.writeBuffer()
		.then((buffer) => FileSaver.saveAs(new Blob([buffer]), `${Date.now()}report.xlsx`))
		.catch((err) => console.log('Error writing excel export', err));
};

export const useRegentTracking = () => {
	const regentTrackingAuthToken: CookieRef<string | null | undefined> = useCookie(
		'regent-tracking-auth-token',
	);
	const runtimeConfig = useRuntimeConfig();
	const email: Ref<string> = ref('');
	const password: Ref<string> = ref('');
	const loginAttemptLoading: Ref<boolean> = ref(false);

	const searchRegNo: Ref<string> = ref('');
	const activeTrackedDevice: Ref<TrackedDevice | null> = ref(null);
	const activeTrackedDeviceLocation: Ref<String> = ref('');

	const attemptLogin = async () => {
		loginAttemptLoading.value = true;
		try {
			await $fetch(`/api/login?email=${email.value}&password=${password.value}`, {
				baseURL: runtimeConfig.public.REGENT_TRACK_BASE_URL,
				method: 'POST',
				headers: {
					Accept: 'application/json',
				},

				onResponse({ response }) {
					if (response.ok) {
						const loginResponse = response._data;
						regentTrackingAuthToken.value = loginResponse.user_api_hash;

						useToast('Login Successful', {
							type: 'success',
							showIcon: true,
							showCloseButton: false,
							hideProgressBar: true,
						});
					}
				},
			});
		} catch (er) {
			console.log('Error encountered. Reason: ', er);
			useToast('Error. Try Again!', {
				type: 'danger',
				showIcon: true,
				showCloseButton: false,
				hideProgressBar: true,
			});
		} finally {
			loginAttemptLoading.value = false;
		}
	};

	const {
		status: fetchTrackedVehiclesStatus,
		execute: fetchTrackedVehicles,
		data: trackedVehicles,
	} = useFetch('/api/get_devices', {
		query: {
			lang: 'en',
			user_api_hash: regentTrackingAuthToken,
		},
		key: 'tracked-vehicles',
		baseURL: runtimeConfig.public.REGENT_TRACK_BASE_URL,
		method: 'GET',
		headers: {
			Accept: 'application/json',
		},
		server: false,
		lazy: true,
		// immediate: false,
		transform(data: any) {
			if (data[0].items && Array.isArray(data[0].items) && (data[0].items as []).length > 0) {
				return data[0].items.map((item: any) => {
					return {
						id: item.id,
						pinColor: item.icon_color,
						trackerStatus: item.online,
						vehicleReg: item.name,
						lastPing: item.time,
						location: {
							lat: item.lat,
							lng: item.lng,
						},
						stopDuration: item.stop_duration,
						driver: {
							name: item.driver_data.name,
							phone: item.driver_data.phone,
							email: item.driver_data.email,
						},
						sensors: item.sensors,

						speed: item.speed,
						speedUnits: item.distance_unit_hour,
					} as TrackedDevice;
				});
			}
		},
		onResponseError() {
			useToast('Failed to retrieve tracked!.', {
				type: 'danger',
				showIcon: true,
				showCloseButton: false,
				hideProgressBar: true,
				transition: 'slide',
			});
		},
	});

	const vehicles: ComputedRef<any[]> = computed(() => {
		if (!searchRegNo.value) {
			return trackedVehicles.value;
		}
		return trackedVehicles.value.filter((vehicle: TrackedDevice) =>
			vehicle.vehicleReg.toLowerCase().includes(searchRegNo.value.toLowerCase()),
		);
	});

	watch(activeTrackedDevice, async () => {
		const loader = new Loader({
			apiKey: 'AIzaSyDMGtdKrUaAiV_xXpNv4Ktshpe-NbDUpjY',
			version: 'weekly',
		});

		activeTrackedDeviceLocation.value = 'Loading location...';
		const lat = activeTrackedDevice.value!.location.lat;
		const lng = activeTrackedDevice.value!.location.lng;
		const Geocoding = await loader.importLibrary('geocoding');

		const geocoder = new Geocoding.Geocoder();
		geocoder.geocode({ location: { lat, lng } }, (results, status) => {
			if (status === 'OK' && results) {
				if (results[0]) {
					activeTrackedDeviceLocation.value = results[0].formatted_address;
				} else {
					activeTrackedDeviceLocation.value = 'Geocoding failed!';
				}
			} else {
				activeTrackedDeviceLocation.value = 'Geocoding failed!';
			}
		});
	});

	return {
		email,
		password,
		loginAttemptLoading,
		regentTrackingAuthToken,
		fetchTrackedVehiclesStatus,
		vehicles,
		searchRegNo,
		activeTrackedDevice,
		activeTrackedDeviceLocation,
		fetchTrackedVehicles,
		attemptLogin,
	};
};

export const useTrackedDeviceCommandsAndHistory = () => {
	type DeviceCommand = {
		type: string;
		title: string;
	};

	type DeviceHistory = {
		lat: number;
		lng: number;
	};

	const regentTrackingAuthToken: CookieRef<string | null | undefined> = useCookie(
		'regent-tracking-auth-token',
	);
	const runtimeConfig = useRuntimeConfig();

	// device commands
	const selectedCommand: Ref<{ type: string; title: string } | null> = ref(null);
	const triggerDeviceCommandLoading: Ref<boolean> = ref(false);
	const getDeviceCommandsLoading: Ref<boolean> = ref(false);
	const enabledDeviceCommands: Ref<DeviceCommand[]> = ref([]);

	// device history
	const getDeviceHistoryLoading: Ref<boolean> = ref(false);
	const startTimestamp: Ref<string> = ref('');
	const endTimestamp: Ref<string> = ref('');
	const deviceHistory: Ref<DeviceHistory[]> = ref([]);

	const getEnabledDeviceCommands = async (deviceId: number) => {
		getDeviceCommandsLoading.value = true;
		try {
			await $fetch(
				`/api/get_device_commands?lang=en&user_api_hash=${regentTrackingAuthToken.value}&device_id=${deviceId}`,
				{
					baseURL: runtimeConfig.public.REGENT_TRACK_BASE_URL,
					method: 'GET',
					headers: {
						Accept: 'application/json',
					},
					onResponse({ response }) {
						const responseData = response._data;

						if (response.ok) {
							enabledDeviceCommands.value = responseData.filter(
								(item: DeviceCommand) =>
									item.type !== 'custom' && !item.type.includes('template'),
							) as DeviceCommand[];
						}
					},
				},
			);
		} catch (er) {
			console.log('Error encountered. Reason: ', er);
			useToast('Error. Try Again!', {
				type: 'danger',
				showIcon: true,
				showCloseButton: false,
				hideProgressBar: true,
			});
		} finally {
			getDeviceCommandsLoading.value = false;
		}
	};

	const getDeviceHistory = async (deviceId: number) => {
		// sample input 2025-05-23T18:03

		const startDate = startTimestamp.value.split('T')[0];
		const startTime = startTimestamp.value.split('T')[1];
		const endDate = endTimestamp.value.split('T')[0];
		const endTime = endTimestamp.value.split('T')[1];

		getDeviceHistoryLoading.value = true;
		try {
			await $fetch(
				`/api/get_history?lang=en&user_api_hash=${regentTrackingAuthToken.value}&device_id=${deviceId}&from_date=${startDate}&from_time=${startTime}&to_date=${endDate}&to_time=${endTime}`,
				{
					baseURL: runtimeConfig.public.REGENT_TRACK_BASE_URL,
					method: 'GET',
					headers: {
						Accept: 'application/json',
					},
					onResponse({ response }) {
						const responseData = response._data;

						if (response.ok) {
							deviceHistory.value = responseData.items.flatMap((outerItem: any) =>
								outerItem.items.map((item: any) => ({
									lat: item.lat,
									lng: item.lng,
								})),
							) as DeviceHistory[];

							useToast('Success!', {
								type: 'success',
								showIcon: true,
								showCloseButton: false,
								hideProgressBar: true,
							});
						}
					},
				},
			);
		} catch (er) {
			console.log('Error encountered. Reason: ', er);
			useToast('Error. Try Again!', {
				type: 'danger',
				showIcon: true,
				showCloseButton: false,
				hideProgressBar: true,
			});
		} finally {
			getDeviceHistoryLoading.value = false;
		}
	};

	const triggerDeviceCommand = async (deviceId: number) => {
		triggerDeviceCommandLoading.value = true;
		try {
			await $fetch(
				`/api/send_gprs_command?lang=en&user_api_hash=${regentTrackingAuthToken.value}&type=${selectedCommand.value?.type}&message=${selectedCommand.value?.title}&device_id=${deviceId}`,
				{
					baseURL: runtimeConfig.public.REGENT_TRACK_BASE_URL,
					method: 'POST',
					headers: {
						Accept: 'application/json',
					},
					onResponse({ response }) {
						useToast('Success!', {
							type: 'success',
							showIcon: true,
							showCloseButton: false,
							hideProgressBar: true,
						});
					},
				},
			);
		} catch (er) {
			console.log('Error encountered. Reason: ', er);
			useToast('Error. Try Again!', {
				type: 'danger',
				showIcon: true,
				showCloseButton: false,
				hideProgressBar: true,
			});
		} finally {
			triggerDeviceCommandLoading.value = false;
		}
	};

	return {
		selectedCommand,
		enabledDeviceCommands,
		triggerDeviceCommandLoading,
		getDeviceCommandsLoading,
		startTimestamp,
		endTimestamp,
		getDeviceHistoryLoading,
		deviceHistory,
		triggerDeviceCommand,
		getEnabledDeviceCommands,
		getDeviceHistory,
	};
};

export const useTrackingTraceabilityReports = () => {
	const runtimeConfig = useRuntimeConfig();
	const searchRegNo: Ref<string> = ref('');
	const currentPage: Ref<number> = ref(0);
	const size: Ref<number> = ref(10);
	const totalPages: Ref<number> = ref(0);
	const downloadReports: Ref<boolean> = ref(false);
	const trackingCertificates: Ref<TrackerInstallationCertificate[]> = ref([]);

	const { status: fetchTrackingCertificatesStatus, execute: executeFetchTrackingCertificates } =
		useFetch<TrackerInstallationCertificate[]>('/tracking/api_certificates.php', {
			key: 'tracker-installation-certificates',
			baseURL: runtimeConfig.public.REGENT_TRACK_CERTS_BASE_URL,
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
			server: false,
			lazy: true,
			onResponse({ response }) {
				if (response.ok) {
					const data = response._data;
					trackingCertificates.value = data.data;
					currentPage.value = data.draw;

					// TODO: Add missing total pages
				}
			},
		});

	const exportToExcel = async () => {
		downloadReports.value = true;
		try {
			await $fetch('/tracking/api_certificates.php', {
				baseURL: runtimeConfig.public.REGENT_TRACK_BASE_URL,
				method: 'GET',
				headers: {
					Accept: 'application/json',
				},
				onResponse({ response }) {
					if (response.ok) {
						const responseData = response._data as TrackerInstallationCertificate[];

						outputExcel(responseData, 'certificates.xlsx');
					}
				},
			});
		} catch (er) {
			console.log('Error encountered. Reason: ', er);
			useToast('Error. Try Again!', {
				type: 'danger',
				showIcon: true,
				showCloseButton: false,
				hideProgressBar: true,
			});
		} finally {
			downloadReports.value = false;
		}
	};

	return {
		searchRegNo,
		fetchTrackingCertificatesStatus,
		size,
		currentPage,
		trackingCertificates,
		totalPages,
		downloadReports,
		executeFetchTrackingCertificates,
		exportToExcel,
	};
};
