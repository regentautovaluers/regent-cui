import { type StandardResponse } from '~/types/proxy-types';

export function useRegentTrackingDeviceUtils() {
	const { post } = useStandardizedApi();
	const startDeviceCommandLoading: Ref<boolean> = ref(false);
	const stopDeviceCommandLoading: Ref<boolean> = ref(false);

	async function triggerDeviceCommand(
		commandType: 'start' | 'stop',
		deviceId: number,
		message: string,
		type: string,
	) {
		const url = `/api/regent-tracking/publish-command?api_hash=$2y$10$VG5xofVqWW6B1gu2zLDFYezsoLkyUonucCKZyR5tAFqb7XV5Tx2yi&type=${type}&message=${message}&device_id=${deviceId}`;
		try {
			if (commandType == 'start') {
				startDeviceCommandLoading.value = true;
			} else if (commandType == 'stop') {
				stopDeviceCommandLoading.value = true;
			}

			const response = await post<StandardResponse>(url);
			if (response.success) {
				useToast('Success!', {
					type: 'success',
					showIcon: true,
					showCloseButton: false,
					hideProgressBar: true,
				});
			}
		} catch (err: any) {
			useToast('Error. Try Again!', {
				type: 'danger',
				showIcon: true,
				showCloseButton: false,
				hideProgressBar: true,
			});
		} finally {
			if (commandType == 'start') {
				startDeviceCommandLoading.value = false;
			} else if (commandType == 'stop') {
				stopDeviceCommandLoading.value = false;
			}
		}
	}

	return {
		startDeviceCommandLoading,
		stopDeviceCommandLoading,
		triggerDeviceCommand,
	};
}
