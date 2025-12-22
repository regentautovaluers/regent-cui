export default defineNuxtRouteMiddleware(async (to) => {
	const { bypassRegentTrackingLogin } = useRegentTrackingAuth();

	if (to.name == 'insurance-telematics-all-vehicles' || to.name == 'regent-tracking-home') {
		if (bypassRegentTrackingLogin()) {
			return;
		} else {
			return navigateTo({ name: 'regent-track-auth' });
		}
	}
});
