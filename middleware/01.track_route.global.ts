import type { CookieRef } from '#app';

export default defineNuxtRouteMiddleware(() => {
	// skip middleware on the server
	if (import.meta.server) return;

	const route = useRoute();
	const currentPageRoute: CookieRef<string | null | undefined> = useCookie('current-page-route');
	currentPageRoute.value = route.fullPath;
	return;
});
