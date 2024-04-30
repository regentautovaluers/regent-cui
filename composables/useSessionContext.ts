import { useStorage } from "@vueuse/core";

export default function () {
	const { nullOutPrincipalDetails } = usePrincipal();

	// we store auth token in cookie of Remember me is selected
	const rememberableAuthToken = useCookie("corp_auth_token", {
		watch: true,
		httpOnly: false,
		domain: "localhost",
		path: "/",
	});

	// we store auth token in session storage if Remember me is unselected
	const forgetableAuthToken =
		typeof window !== "undefined"
			? useStorage("corp_auth_token", "", sessionStorage)
			: null;

	function handleSessionTokensSetup(rememberMe: boolean): void {
		// set the auth token based on the 'remember me' choice
		if (rememberMe) {
			rememberableAuthToken.value = "test-auth-token";
		} else {
			forgetableAuthToken!.value = "test-auth-token";
		}
	}

	async function handleUnsetSessionTokens(): Promise<void> {
		// null out stored tokens wherever they are stored
		forgetableAuthToken!.value = null;
		rememberableAuthToken.value = null;

		// null out the principal in the local storage
		await nullOutPrincipalDetails();
	}

	return {
		handleSessionTokensSetup,
		handleUnsetSessionTokens,
	};
}
