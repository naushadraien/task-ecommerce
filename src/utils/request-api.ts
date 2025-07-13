import { showToast } from "@/utils/show-toast";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import axiosInstance from "./axios/axios-instance";

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "set",
      eventName: string,
      parameters?: {
        event_category?: string;
        event_label?: string;
        value?: number;
        [key: string]: any;
      }
    ) => void;
  }
}

export type MethodType =
  | "get"
  | "post"
  | "delete"
  | "patch"
  | "put"
  | "head"
  | "options";

/**
 * API request configuration options with proper typing
 */
export type ApiRequestConfig<TData = any> = {
  url: string;
  method: MethodType;
  data?: TData;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  /**
   * Silent mode prevents toast notifications (default: false)
   */
  silent?: boolean;
  /**
   * Log request details to console (default: false in production)
   */
  debug?: boolean;
  /**
   * Request timeout in milliseconds (default: inherited from axiosInstance)
   */
  timeout?: number;
  /**
   * Custom error handler for specific requests
   */
  onError?: (error: Error) => void;
};

/**
 * Enhanced API response structure for better type safety
 */
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    [key: string]: any;
  };
}

/**
 * Industrial-grade API request wrapper for Next.js applications
 * with standardized error handling and toast notifications
 *
 * @param config - Request configuration
 * @returns Promise with response data
 */
async function requestAPI<TResponse = any, TRequest = any>(
  config: ApiRequestConfig<TRequest>
): Promise<TResponse> {
  // Only log in development mode unless explicitly enabled
  const shouldDebug =
    config.debug ||
    (process.env.NODE_ENV === "development" && config.debug !== false);

  if (shouldDebug) {
    console.group(
      `🌐 API Request: ${config.method.toUpperCase()} ${config.url}`
    );
    console.log("Headers:", config.headers || "Default headers");
    if (config.data) console.log("Payload:", config.data);
    if (config.params) console.log("Params:", config.params);
    console.groupEnd();
  }

  try {
    // Prepare request configuration
    const axiosConfig: AxiosRequestConfig = {
      url: config.url,
      method: config.method,
      data: config.data,
      params: config.params,
      headers: config.headers,
      timeout: config.timeout,
    };

    // Execute request
    const response: AxiosResponse = await axiosInstance(axiosConfig);

    // Log response in debug mode
    if (shouldDebug) {
      console.group(
        `✅ API Response: ${config.method.toUpperCase()} ${config.url}`
      );
      console.log("Status:", response.status);
      console.log("Data:", response.data);
      console.groupEnd();
    }

    // Extract and return data with consistent pattern
    return extractResponseData<TResponse>(response);
  } catch (error) {
    if (shouldDebug) {
      console.group(
        `❌ API Error: ${config.method.toUpperCase()} ${config.url}`
      );
      console.error("Error:", error);
      console.groupEnd();
    }

    return handleApiError(error as Error | AxiosError, config);
  }
}

/**
 * Helper function to extract response data consistently
 */
function extractResponseData<T>(response: AxiosResponse): T {
  // Standard API response shape: { data: { data: actualData } }
  if (response?.data?.data !== undefined) {
    return response.data.data;
  }
  // Alternative API response shape: { data: actualData }
  else if (response?.data !== undefined) {
    return response.data;
  }
  // Fallback for non-standard responses
  return response as unknown as T;
}

/**
 * Unified error handler for API requests
 */
function handleApiError(
  error: Error | AxiosError,
  config: ApiRequestConfig
): never {
  // Standard error message format
  let errorMessage = "An unexpected error occurred";
  let errorCode: number | undefined;

  if (isAxiosError(error)) {
    // Network errors (no response)
    if (!error.response) {
      errorMessage = "Network error: Unable to connect to server";

      // Report network errors to analytics (if needed)
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "network_error", {
          event_category: "api",
          event_label: config.url,
        });
      }
    }
    // Server responded with error status
    else {
      errorCode = error.response.status;

      // Extract error message from response
      errorMessage =
        (error.response.data as any)?.message ||
        (error.response.data as any)?.error ||
        error.message ||
        `HTTP Error ${errorCode}`;

      // Skip 401 errors as they're handled by axios interceptors
      if (errorCode === 401) {
        if (!config.silent) {
          showToast(errorMessage, undefined, "error");
        }
        throw error;
      }

      // Classify by status code
      if (errorCode >= 500) {
        errorMessage = `Server Error: ${errorMessage}`;
      } else if (errorCode >= 400 && errorCode !== 401) {
        errorMessage = `Request Error: ${errorMessage}`;
      }
    }
  } else {
    // Non-axios errors
    errorMessage = error.message || errorMessage;
  }

  // Create enriched error object
  const enrichedError = createEnrichedError(
    error,
    errorMessage,
    errorCode,
    config
  );

  // Call custom error handler if provided
  if (config.onError) {
    config.onError(enrichedError);
  }

  // Show toast unless silent mode is enabled
  if (!config.silent) {
    const { title, description } = parseErrorMessage(errorMessage);

    showToast(
      title,
      {
        description: description,
      },
      "error"
    );
  }

  throw enrichedError;
}

/**
 * Create enriched error object with additional context
 */
function createEnrichedError(
  originalError: Error | AxiosError,
  message: string,
  statusCode: number | undefined,
  config: ApiRequestConfig
): Error & {
  originalError: Error | AxiosError;
  endpoint: string;
  method: string;
  statusCode?: number;
} {
  const enrichedError = new Error(message);
  enrichedError.name = statusCode ? `ApiError(${statusCode})` : "ApiError";

  /**
   * Extend the error object with additional contextual information to improve debugging
   * This adds API-specific details that aren't available in standard Error objects:
   * - originalError: Preserves the complete error chain for tracing
   * - endpoint: The API endpoint that was called
   * - method: The HTTP method used in the request
   * - statusCode: The HTTP status code returned by the server
   */
  return Object.assign(enrichedError, {
    originalError,
    endpoint: config.url,
    method: config.method,
    statusCode,
  });
}

/**
 * Utility to check if an error is an axios error (type guard)
 */
function isAxiosError(error: any): error is AxiosError {
  return error && error.isAxiosError === true;
}

function parseErrorMessage(message: string): {
  title: string;
  description: string;
} {
  const hasColon = message.includes(":");

  if (hasColon) {
    const [title, ...descriptionParts] = message.split(":");
    return {
      title: title.toUpperCase(),
      description: descriptionParts.join(":").trim(),
    };
  }

  return {
    title: "ERROR",
    description: message,
  };
}

export default requestAPI;
