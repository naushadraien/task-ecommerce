import { envs } from "@/config/envs";
import { useAuthStore } from "@/store/auth-store";
import { showToast } from "@/utils/show-toast";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import {
  getItemFromLocalStorage,
  setItemToLocalStorage,
} from "../local-storage";
import {
  handleAuthenticationError,
  shouldRefreshToken,
} from "./axios-error-handler";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/local-storage";

// Extend AxiosResponse to include the 'ok' property
declare module "axios" {
  export interface AxiosResponse {
    ok?: boolean;
  }

  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

// Token refresh state management
type RefreshSubscriber = (token: string) => void;
let isRefreshing = false;
let refreshSubscribers: RefreshSubscriber[] = [];

const addRefreshSubscriber = (callback: RefreshSubscriber): void => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (token: string): void => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Create Axios instance with base URL
const axiosInstance: AxiosInstance = axios.create({
  baseURL: envs.BACKEND_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

// Clear Axios configuration
export const clearAxiosConfig = (): void => {
  delete axiosInstance.defaults.headers.common["Authorization"];
};

// Token refresh function
export const refreshToken = async ({
  originalRequest,
}: {
  originalRequest: InternalAxiosRequestConfig;
}): Promise<AxiosResponse> => {
  isRefreshing = true;

  try {
    // Get refresh token from localStorage
    const refreshToken = getItemFromLocalStorage<string>("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    // Call refresh token API
    const response = await axios.post(
      `${envs.BACKEND_URL}/auth/refresh`,
      { refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    // Update tokens in localStorage
    setItemToLocalStorage<string>(ACCESS_TOKEN, accessToken);
    if (newRefreshToken) {
      setItemToLocalStorage<string>(REFRESH_TOKEN, newRefreshToken);
    }

    // Update auth store
    const authStore = useAuthStore.getState();
    authStore.setAuth({
      user: authStore.user,
      token: accessToken,
      isAuthenticated: true,
    });

    // Update headers with new token
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${accessToken}`;

    // Process queued requests
    onRefreshed(accessToken);
    isRefreshing = false;

    // Update original request with new token
    originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
    return axiosInstance(originalRequest);
  } catch (error) {
    // Handle refresh failure
    showToast("Session expired. Please log in again.", undefined, "error");

    // Reset state
    isRefreshing = false;
    refreshSubscribers = [];

    // Handle authentication error
    handleAuthenticationError();

    return Promise.reject(error);
  }
};

// Request interceptor
axiosInstance.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    try {
      // Get token from localStorage
      const token = getItemFromLocalStorage(ACCESS_TOKEN);

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    response.ok = response.status >= 200 && response.status < 300;
    return response;
  },
  async (error: AxiosError): Promise<any> => {
    const originalRequest = error.config as InternalAxiosRequestConfig;

    // Handle token refresh for 401 errors
    if (shouldRefreshToken(error) && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Wait for token refresh if it's already in progress
        return new Promise((resolve) => {
          addRefreshSubscriber((token: string) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      return refreshToken({ originalRequest });
    }

    return Promise.reject(error);
  }
);

// Set Authorization header
export const setAuthorizationHeader = (token: string = ""): void => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

// Set base URL
export const setAxiosInstanceBaseURL = (baseURL: string): void => {
  axiosInstance.defaults.baseURL = baseURL;
};

// Initialize axios with stored token
export const initializeAxios = (): void => {
  const token = getItemFromLocalStorage<string>(ACCESS_TOKEN);
  if (token) {
    setAuthorizationHeader(token);
  }
};

export default axiosInstance;
