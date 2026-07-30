// Enhanced error types for better categorization
export interface ProxyError extends Error {
  statusCode?: number;
  statusMessage?: string;
  data?: Record<string, unknown>;
  cause?: unknown;
  type?:
    | "network_error"
    | "remote_api_error"
    | "internal_error"
    | "validation_error";
}

export interface StandardResponse {
  success: boolean;
  metadata: {
    message: string;
    code?: string;
    timestamp: string;
    type?: string;
    source?: string;
  };
}

export interface StandardErrorResponse extends StandardResponse {
  statusCode: number;
}

export interface StandardSuccessResponse<T = unknown> extends StandardResponse {
  data: T;
}

export interface ProxyRequestOptions {
  method?: "GET" | "PUT" | "PATCH" | "POST" | "DELETE" | "OPTIONS" | "HEAD";
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
  responseType?: "blob" | "arrayBuffer";
}
