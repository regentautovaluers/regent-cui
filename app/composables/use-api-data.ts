import {
  type StandardSuccessResponse,
  type StandardErrorResponse,
} from "~/../types/proxy-types";
import { useAsyncData } from "#app";
import type { AsyncDataOptions, AsyncData } from "#app";

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
  const handleApiCall = async <T = unknown>(
    endpoint: string,
    options: Parameters<typeof $fetch>[1] = {},
  ): Promise<ApiResponse<T>> => {
    return await $fetch<ApiResponse<T>>(endpoint, {
      ...options,
      headers: {
        "Content-Type": "",
        ...options.headers,
      },
    });
  };

  const get = <T = unknown>(endpoint: string, query?: Record<string, any>) =>
    handleApiCall<T>(endpoint, { method: "GET", query });

  const getBlob = async (
    endpoint: string,
    options: Parameters<typeof $fetch>[1] = {},
  ): Promise<Blob> => {
    return await $fetch<Blob>(endpoint, { ...options, responseType: "blob" });
  };

  const post = <T = unknown>(endpoint: string, body?: any) =>
    handleApiCall<T>(endpoint, { method: "POST", body });
  const put = <T = unknown>(endpoint: string, body?: any) =>
    handleApiCall<T>(endpoint, { method: "PUT", body });
  const del = <T = unknown>(endpoint: string) =>
    handleApiCall<T>(endpoint, { method: "DELETE" });
  const patch = <T = unknown>(endpoint: string, body?: any) =>
    handleApiCall<T>(endpoint, { method: "PATCH", body });

  return { handleApiCall, get, post, put, delete: del, patch, getBlob };
};

/**
 * Enhanced useApiData
 * T: The shape of the actual 'data' payload inside your standard success envelope.
 * R: The final returned type (defaults to T if no extra custom transform is applied).
 */
export const useApiData = <T = unknown, R = T>(
  key: string | null,
  endpoint: string | Ref<string> | ComputedRef<string>,
  options: Omit<AsyncDataOptions<T, R>, "transform"> & {
    query?: Record<string, any> | ComputedRef<Record<string, any>>; // Support reactive query object
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: string | FormData;
    transform?: (data: T) => R | Promise<R>; // Transform now directly receives the payload data!
    getCachedData?: (key: string) => R | undefined;
    onResponse?: (context: any) => void | Promise<void>;
    onResponseError?: (context: any) => void | Promise<void>;
  } = {},
) => {
  const {
    query,
    method = "GET",
    body,
    transform,
    ...asyncDataOptions
  } = options;

  const api = useStandardizedApi();

  // Generate a fallback key if null is provided
  const activeKey =
    key || `api-${unref(endpoint)}-${JSON.stringify(unref(query))}`;

  return useAsyncData<T, StandardErrorResponse, R>(
    activeKey,
    async () => {
      // Fetch using the outer layout type
      const response = await api.handleApiCall<T>(unref(endpoint), {
        method,
        query: unref(query), // Unref query in case it's reactive
        body,
        onResponse: options.onResponse,
        onResponseError: options.onResponseError,
      });

      if (!response.success) {
        throw response as StandardErrorResponse;
      }

      // Automatically unwrap the standard backend envelope right here
      return response.data;
    },
    {
      ...asyncDataOptions,
      // If a custom transform is provided, pass the unwrapped data to it.
      // Otherwise, pass it straight through.
      transform: transform as any,
    },
  );
};
