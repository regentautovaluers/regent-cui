import { ProxyError, ProxyRequestOptions } from '~/types/proxy-types';

// Utility function to throw properly formatted errors from API endpoints
export const createProxyError = (
	statusCode: number,
	message: string,
	type?: ProxyError['type'],
	data?: Record<string, unknown>,
): ProxyError => {
	const error = new Error(message) as ProxyError;
	error.statusCode = statusCode;
	error.statusMessage = message;
	error.type = type;
	error.data = data;
	return error;
};

// function to make API calls
export const makeProxyRequest = async <T = unknown>(
	endpoint: string,
	options: ProxyRequestOptions = {},
): Promise<T> => {
	const { method, body, headers, timeout = 30000 } = options;

	try {
		return await $fetch<T>(endpoint, {
			method,
			headers: headers,
			body: body ? JSON.stringify(body) : undefined,
			timeout,
		});
	} catch (error: any) {
		if (error.status) {
			const proxyError = new Error('Remote API error') as any;
			proxyError.statusCode = error.status;
			proxyError.type = error.status >= 500 ? 'remote_api_error' : 'validation_error';
			proxyError.data = { remoteStatus: error.status, endpoint };
			throw proxyError;
		}

		// Network errors
		if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT') {
			const networkError = new Error('Remote service unavailable') as any;
			networkError.type = 'network_error';
			networkError.data = { endpoint, errorCode: error.code };
			throw networkError;
		}

		// Re-throw other errors as-is
		throw error;
	}
};
