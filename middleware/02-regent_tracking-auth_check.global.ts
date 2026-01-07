export default defineNuxtRouteMiddleware(async (to) => {
	const { bypassRegentTrackingLogin } = useRegentTrackingAuth();
	const toRouteName = to.name as string;
	const toRoutePath = to.path as string;

	if (toRoutePath.includes('/regent-track') && toRouteName != 'regent-track-auth') {
		if (bypassRegentTrackingLogin()) {
			return;
		} else {
			return navigateTo({ name: 'regent-track-auth' });
		}
	}
});
