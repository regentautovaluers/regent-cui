import { type StandardSuccessResponse, type StandardErrorResponse } from '~/types/proxy-types';
import { type AsyncDataOptions } from '#app';

// Define the API response type as the union of success and error responses
export type ApiResponse<T> = StandardSuccessResponse<T> | StandardErrorResponse;

/**
 * A composable for making standardized API calls.
 *
 * It uses $fetch and handles content-type headers automatically.
 *
 * @returns An object with methods for common HTTP verbs.
 */
export const useStandardizedApi = () => {
	/**
	 * Handles the core API call logic, returning the full ApiResponse.
	 *
	 * @param endpoint The API endpoint URL.
	 * @param options The options for the fetch request.
	 * @returns A promise that resolves to an ApiResponse<T> (either success or error).
	 */
	const handleApiCall = async <T = unknown>(
		endpoint: string,
		options: Parameters<typeof $fetch>[1] = {},
	): Promise<ApiResponse<T>> => {
		const response = await $fetch<ApiResponse<T>>(endpoint, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				...options.headers,
			},
		});

		// The response is already typed as ApiResponse<T>, so we can just return it.
		return response;
	};

	// Convenience methods for common HTTP verbs
	const get = <T = unknown>(endpoint: string, query?: Record<string, any>) =>
		handleApiCall<T>(endpoint, { method: 'GET', query });

	const post = <T = unknown>(endpoint: string, body?: any) =>
		handleApiCall<T>(endpoint, { method: 'POST', body });

	const put = <T = unknown>(endpoint: string, body?: any) =>
		handleApiCall<T>(endpoint, { method: 'PUT', body });

	const del = <T = unknown>(endpoint: string) => handleApiCall<T>(endpoint, { method: 'DELETE' });

	const patch = <T = unknown>(endpoint: string, body?: any) =>
		handleApiCall<T>(endpoint, { method: 'PATCH', body });

	return {
		handleApiCall,
		get,
		post,
		put,
		delete: del,
		patch,
	};
};

// ---

/**
 * An enhanced composable that wraps the API calls with useAsyncData for caching and error handling.
 *
 * @param key A unique key for useAsyncData to enable caching.
 * @param endpoint The API endpoint URL.
 * @param options The options for the fetch request, including query, method, body, and transform.
 * @returns The useAsyncData return object with data, pending, and error states.
 */
export const useApiData = <T = unknown>(
	key: string,
	endpoint: string,
	options: Omit<AsyncDataOptions<ApiResponse<T>>, 'transform'> & {
		query?: Record<string, any>;
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: any;
		transform?: (data: ApiResponse<T>) => T;
	} = {},
) => {
	const { query, method = 'GET', body, transform, ...asyncDataOptions } = options;

	const api = useStandardizedApi();

	return useAsyncData<ApiResponse<T>, StandardErrorResponse>(
		key,
		() =>
			api.handleApiCall<T>(endpoint, {
				method,
				query,
				body,
			}),
		{
			...asyncDataOptions,
			transform: transform as AsyncDataOptions<ApiResponse<T>>['transform'],
		},
	);
};
