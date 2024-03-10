import { ofetch } from "ofetch";

export default defineNuxtPlugin((_nuxtApp) => {
    const authToken = useCookie('AUTH-TOKEN');
	const csrfToken = useCookie('CSRF-TOKEN');
    const allowedNonCSRFMethods: readonly String[] = ["GET", "HEAD", "TRACE", "OPTIONS"];
    const { openToast } = useToast();

    globalThis.$fetch = ofetch.create({
        async onRequest({ request, options }) {
            let headers = {};

            if(!allowedNonCSRFMethods.includes(options.method)) {
                headers['X-CSRF-TOKEN'] = csrfToken.value;
                options.credentials = "include";
            }

            if(!request.toString().includes("/auth")) {
                headers['Authorization'] = `Bearer ${authToken.value}`;
            }

            options.headers = {...options.headers, ...headers};
        },

        async onResponseError({ response }) {
            const responseBody = response._data;
            console.log("inside request interceptor: responseBody: ", responseBody);
            switch(responseBody.status) {
                case 401: {
                    openToast(responseBody.message, 'danger');
                    break;
                }

                case 500: {
                    openToast(responseBody.message, 'warning');
                    break
                }

                case 404: {
                    openToast(responseBody.message, 'warning');
                    break;
                }
            }
        }
    });
});