export default defineNuxtRouteMiddleware((to, from) => {
	// skip middleware on the server
	if (import.meta.server) return;

	// const { isSessionValid } = useAuth();
	// if (!isSessionValid() && to.name !== 'exterior-home') {
    //     console.log("Not authenticated, redirecting to home");
	// 	return navigateTo('/');
	// }
    
    // console.log("proceeding with navigation")
});
