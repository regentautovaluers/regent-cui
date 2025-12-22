export default defineNuxtRouteMiddleware(async (to) => {
	const { bypassRegentTrackingLogin } = useRegentTrackingAuth();

	if (to.path.includes('/regent-track')) {
		if (bypassRegentTrackingLogin()) {
			return;
		} else {
			return navigateTo({ name: 'regent-track-auth' });
		}
	}
});
