import type { CookieRef } from "#app";
import { useStorage, type RemovableRef } from "@vueuse/core";
import type { LoggedInPrincipal } from "~/types/types";

const useAuth = () => {
	const email: Ref<string> = ref("");
	const password: Ref<string> = ref("");
	const loginAttemptLoading: Ref<boolean> = ref(false);
	const loginAttemptMessage: Ref<string> = ref("");
	const loginSuccess: Ref<boolean | null> = ref(null);
	const runtimeConfig = useRuntimeConfig();
	const authenticatedPrincipal: RemovableRef<LoggedInPrincipal> = useStorage(
		"authenticated-principal",
		{
			userId: "",
			username: "",
			email: "",
			phonenumber: "",
			roles: [],
			profilePicture: null,
			corpId: "",
			corpName: "",
			roleInOrganization: "",
		}
	);
	const authToken: CookieRef<string | null | undefined> =
		useCookie("auth-token");
	const csrfToken: CookieRef<string | null | undefined> =
		useCookie("csrf-token");
	const router = useRouter();

	const getPrincipal: ComputedRef<LoggedInPrincipal> = computed(() => {
		return authenticatedPrincipal.value;
	});

	const getAuthToken: ComputedRef<string | null | undefined> = computed(
		() => {
			return authToken.value;
		}
	);

	const getCsrfToken: ComputedRef<string | null | undefined> = computed(
		() => {
			return csrfToken.value;
		}
	);

	const attemptLogin = async () => {
		loginAttemptLoading.value = true;
		try {
			await $fetch("/api/v1/auth/corp-account/login", {
				baseURL: runtimeConfig.public.VALUATION_BASE_URL,
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: email.value,
					password: password.value,
				}),

				onResponse({ response }) {
					switch (response.status) {
						case 401: {
							loginSuccess.value = false;
							loginAttemptMessage.value =
								"Invalid credentials. Try again!";
							break;
						}

						case 200: {
							loginSuccess.value = true;
							loginAttemptMessage.value =
								"Success. Will redirect you shortly!";

							setCredentialsInBrowserStorage(response._data.data);
							router.push({ name: "dashboard-home" });
						}
					}
				},

				onRequestError({ error }) {
					loginSuccess.value = false;
					loginAttemptMessage.value =
						"Something went wrong! Try again!";
				},
			});
		} catch (er) {
			console.log("Error encountered. Reason: ", er);
		} finally {
			loginAttemptLoading.value = false;
		}
	};

	const isPrincipalAdmin = (): boolean => {
		let isAdmin = false;

		if (
			authenticatedPrincipal.value.roles.includes(
				"role_corp_admin".toUpperCase()
			)
		) {
			isAdmin = true;
		}

		return isAdmin;
	};

	const setCredentialsInBrowserStorage = (data: any) => {
		// set the principal
		const principal: LoggedInPrincipal = {
			userId: data.userId,
			username: data.username,
			email: data.email,
			phonenumber: data.phoneNumber,
			roles: data.userRoles,
			profilePicture: data.profilePicture,
			corpId: data.corpId,
			corpName: data.corpName,
			roleInOrganization: data.roleInOrganization,
		};

		authenticatedPrincipal.value = principal;

		// set the auth and csrf tokens
		authToken.value = data.jwtToken;
		csrfToken.value = data.xsrfToken;
	};

	const logout = () => {
		// unset the principal
		authenticatedPrincipal.value = {
			userId: "",
			username: "",
			email: "",
			phonenumber: "",
			roles: [],
			profilePicture: null,
			corpId: "",
			corpName: "",
			roleInOrganization: "",
		};

		// unset the auth token and csrf token
		authToken.value = "";
		csrfToken.value = "";

		// redirect to the login page
		router.push({ name: "authentication-page" });
	};

	return {
		email,
		password,
		loginAttemptLoading,
		loginAttemptMessage,
		loginSuccess,
		getPrincipal,
		getAuthToken,
		getCsrfToken,
		attemptLogin,
		isPrincipalAdmin,
		logout,
	};
};

export default useAuth;
