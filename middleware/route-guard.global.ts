export default defineNuxtRouteMiddleware((to, from) => {
	/*
	const router = useRouter();
	const { assertSessionExists } = useSessionContext();
	const { assertPrincipalExists } = useAuth();
	const { openToast } = useToast();
	const unprotectedRouteNames: string[] = [
		"forgot-password",
		"auth-error",
		"authentication-page",
	];

	// when the user loads a page by manually typing the page url, the to.path/to.name and from.path/from.name are the same value.
	// in such a case, if they have a session(via remember me) and the principal still exists, then allow navigation
	// else take them to the login
	if (
		to.name === from.name &&
		to.name !== "authentication-page" &&
		!unprotectedRouteNames.includes(to.name as string)
	) {
		if (assertSessionExists() && assertPrincipalExists()) {
			return;
		} else {
			openToast("Untrusted session. Please login!", "danger");
			router.push({
				name: "authentication-page",
			});

			// if (typeof window !== "undefined") location.reload();
		}
	}

	// when the user starts the app and they already had a session(via remember me) and there exists the principal,
	// re-navigate them to the dashboard-home page
	if (to.name === from.name && to.name === "authentication-page") {
		if (assertSessionExists() && assertPrincipalExists()) {
			openToast(
				"Already Logged In. Redirecting to Dashboard Home!",
				"success"
			);

			router.push({
				name: "dashboard-home",
			});
		} else {
			return;
		}
	}

	// // if the user is in the /dashboard route and they try to navigate to any outside route without actually logging out,
	// // block the navigation
	// if (
	// 	(unprotectedRouteNames.includes(to.name as string) &&
	// 		assertSessionExists()) ||
	// 	assertPrincipalExists()
	// ) {
	// 	openToast("Invalid Operation. Please Logout!", "danger");
	// 	return abortNavigation();
	// }
	*/
});
