export default defineNuxtPlugin(() => {
	const currentPageRoute = useCookie('current-page-route');
	const route = useRoute();

	// console.log(route.fullPath);
});
