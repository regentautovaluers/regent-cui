export function useRegentTrackingDeviceHistory() {
	const filterPeriod: Ref<'today' | 'this-week' | 'last-30-days ' | 'last-3-months' | 'custom'> =
		ref('this-week');

	function setFilterPeriod(
		period: 'today' | 'this-week' | 'last-30-days ' | 'last-3-months' | 'custom',
	) {
		filterPeriod.value = period;
	}

	return {
		filterPeriod,
		setFilterPeriod,
	};
}
