import { ofetch } from "ofetch";
import { useStorage } from "@vueuse/core";

export default defineNuxtPlugin((_nuxtApp) => {
	// TODO: Verify in the future that the || here does not produce a bug
	const authToken =
		useCookie("corp_auth_token") ||
		useStorage("corp_auth_token", "", sessionStorage);
	const { openToast } = useToast();

	globalThis.$fetch = ofetch.create({
		async onRequest({ options }) {
			let headers = {};
			headers["Authorization"] = `Bearer ${authToken.value}`;

			options.headers = { ...options.headers, ...headers };
		},

		/*
		async onResponseError({ response }) {
			const responseBody = response._data;
			console.log(
				"inside request interceptor: responseBody: ",
				responseBody
			);
			switch (responseBody.status) {
				case 401: {
					openToast(responseBody.message, "danger");
					break;
				}

				case 500: {
					openToast(responseBody.message, "warning");
					break;
				}

				case 404: {
					openToast(responseBody.message, "warning");
					break;
				}
			}
		},
        */
	});
});
