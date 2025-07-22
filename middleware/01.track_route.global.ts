import type { CookieRef } from '#app';

export default defineNuxtRouteMiddleware((to) => {
	// skip middleware on the server
	if (import.meta.server) return;

	const currentPageRoute: CookieRef<string | null | undefined> = useCookie('current-page-route');
	currentPageRoute.value = to.fullPath;
});
