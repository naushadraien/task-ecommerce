import { useAuthStore } from "@/store/auth-store";
import { AxiosError } from "axios";
import { removeItemFromLocalStorage } from "../local-storage";
import { clearAxiosConfig } from "./axios-instance";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/local-storage";

export interface ErrorHandlerConfig {
  showToast?: boolean;
  redirectOnAuth?: boolean;
  customMessages?: {
    [key: number]: string;
  };
}

// Handle authentication-related errors
export const handleAuthenticationError = (): void => {
  // Clean up tokens
  removeItemFromLocalStorage(ACCESS_TOKEN);
  removeItemFromLocalStorage(REFRESH_TOKEN);

  // Clear auth store
  useAuthStore.getState().logOut();

  // Clear axios config
  clearAxiosConfig();

  // Redirect to login page
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
};

// Check if error is retryable
export const isRetryableError = (error: AxiosError): boolean => {
  const statusCode = error.response?.status;

  // Network errors are retryable
  if (error.code === "ECONNABORTED" || error.message === "Network Error") {
    return true;
  }

  // 5xx server errors are retryable
  if (statusCode && statusCode >= 500) {
    return true;
  }

  // 429 (rate limit) is retryable
  if (statusCode === 429) {
    return true;
  }

  return false;
};

// Check if error should trigger token refresh
export const shouldRefreshToken = (error: AxiosError): boolean => {
  const statusCode = error.response?.status;
  const errorData = error.response?.data as any;

  return (
    statusCode === 401 &&
    (errorData?.errorType === "token_expired" ||
      errorData?.message?.includes("expired"))
  );
};

// Extract error message from response
export const getErrorMessage = (error: AxiosError): string => {
  const errorData = error.response?.data as any;

  if (errorData?.message) {
    return errorData.message;
  }

  if (errorData?.error) {
    return errorData.error;
  }

  if (error.message) {
    return error.message;
  }

  return "An unexpected error occurred";
};
