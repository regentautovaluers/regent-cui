export default defineNuxtRouteMiddleware((to, from) => {
	// if the user is trying to navigate from dashboard to a route outside the dashboard
	// and they are already logged in, disable the navigation
	console.log("route middleware running");
});
