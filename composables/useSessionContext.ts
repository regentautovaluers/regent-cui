import { useStorage, type RemovableRef } from "@vueuse/core";

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
	const forgetableAuthToken: RemovableRef<null | string> | null =
		typeof window !== "undefined"
			? useStorage("corp_auth_token", null, sessionStorage)
			: null;

	function handleSessionTokensSetup(rememberMe: boolean): void {
		if (forgetableAuthToken) {
			if (rememberMe) {
				// set the auth token based on the 'remember me' choice
				rememberableAuthToken.value = "test-auth-token";
			} else {
				forgetableAuthToken!.value = "test-auth-token";
			}
		}
	}

	async function handleUnsetSessionTokens(): Promise<void> {
		// null out stored tokens wherever they are stored
		forgetableAuthToken!.value = null;
		rememberableAuthToken.value = null;

		// null out the principal in the local storage
		await nullOutPrincipalDetails();
	}

	function assertSessionExists(): boolean | undefined {
		if (forgetableAuthToken) {
			if (
				forgetableAuthToken?.value === null &&
				rememberableAuthToken.value === null
			) {
				return false;
			} else if (
				forgetableAuthToken?.value ||
				rememberableAuthToken.value
			) {
				return true;
			}
		}
	}

	return {
		handleSessionTokensSetup,
		handleUnsetSessionTokens,
		assertSessionExists,
	};
}
