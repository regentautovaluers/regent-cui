import type { H3Event } from "h3";

// Utility function to throw properly formatted errors from API endpoints
export const createProxyError = (
  statusCode: number,
  message: string,
  type?: ProxyError["type"],
  data?: Record<string, unknown>,
): ProxyError => {
  const error = new Error(message) as ProxyError;
  error.statusCode = statusCode;
  error.statusMessage = message;
  error.type = type;
  error.data = data;
  return error;
};

export const makeProxyRequest = async <T = unknown>(
  endpoint: string,
  event: H3Event,
  options: ProxyRequestOptions = {},
): Promise<T> => {
  // add any custom headers to the request
  const {
    method = "GET",
    body = undefined,
    timeout = 30000,
    responseType = undefined,
  } = options;
  const allowForSuffix: readonly string[] = [
    "/corporate-account/login",
    "/api/login",
  ];

  const { COLV_BASE_URL, COLV_KEY_PASSKEY, VALUATION_BASE_URL } =
    useRuntimeConfig();

  // develop the headers
  let headers: Record<string, string> = {};
  if (!allowForSuffix.some((item) => endpoint.includes(item))) {
    {
      const cookies = parseCookies(event);
      const data: LoginResponse = await inflatePrincipal(cookies);

      if (endpoint.startsWith(COLV_BASE_URL)) {
        headers["X-API-Key"] = generateCollateralVerificationXApiKey(
          data.corpId,
          COLV_KEY_PASSKEY,
        );
        headers["X-Client-ID"] = generateCollateralVerificationCIDHeader();
      }

      if (endpoint.startsWith(VALUATION_BASE_URL)) {
        headers["Authorization"] = `Bearer ${cookies.valuation_auth_token}`;
      }
    }
  }

  return await $fetch<T>(endpoint, {
    method,
    headers,
    body: body as any,
    timeout,
    responseType,
  });
};

export function sendSuccessResponse<T>(data: T) {
  const response: StandardSuccessResponse = {
    data,
    success: true,
    metadata: {
      message: "Request handled successfully!",
      timestamp: new Date().toISOString(),
      source: "api",
    },
  };
  return response;
}

const getErrorType = (error: ProxyError): string => {
  if (error.type) return error.type;
  if (
    error.cause &&
    typeof error.cause === "object" &&
    (error.cause as any).code === "NETWORK_ERROR"
  )
    return "network_error";
  if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500)
    return "validation_error";
  if (error.statusCode && error.statusCode >= 500) return "remote_api_error";
  return "internal_error";
};

export function sendErrorResponse(error: any) {
  // Determine appropriate status code
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  let errorCode = "INTERNAL_ERROR";
  const errorType = getErrorType(error);

  switch (errorType) {
    case "network_error":
      statusCode = 503;
      errorMessage = "Remote service unavailable";
      errorCode = "SERVICE_UNAVAILABLE";
      break;

    case "remote_api_error":
      statusCode = error.statusCode || 502;
      errorMessage = error.statusMessage || "Remote API error";
      errorCode = "REMOTE_API_ERROR";
      break;

    case "validation_error":
      statusCode = error.statusCode || 400;
      errorMessage =
        error.statusMessage || error.message || "Validation failed";
      errorCode = "VALIDATION_ERROR";
      break;

    case "authentication_error":
      statusCode = error.statusCode || 401;
      errorMessage =
        error.statusMessage || error.message || "Authentication failed";
      errorCode = "AUTHENTICATION_ERROR";
      break;

    case "authorization_error":
      statusCode = error.statusCode || 403;
      errorMessage =
        error.statusMessage || error.message || "Authorization failed";
      errorCode = "AUTHORIZATION_ERROR";
      break;

    case "internal_error":
    default:
      statusCode = error.statusCode || 500;
      errorMessage = error.statusMessage || "Internal server error";
      errorCode = "INTERNAL_ERROR";
      break;
  }

  const response: StandardErrorResponse = {
    statusCode,
    metadata: {
      message: errorMessage,
      code: errorCode,
      timestamp: new Date().toISOString(),
      type: errorType,
    },
    success: false,
  };

  throw createError({
    status: response.statusCode,
    data: response,
    stack: "",
  });
}
