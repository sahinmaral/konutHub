import { clearUser } from '@/redux/reducers/appReducer';
import { store } from '@/redux/store';
import { refreshAccessToken } from '@/utils/tokenManager';
import axios, { AxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_API_BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

axiosInstance.interceptors.request.use(config => {
  const accessToken = store.getState().app.user?.accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  config.headers['Accept-Language'] = 'tr';
  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // The refresh call goes out on this same instance, so its own 401 must be passed
    // straight through. Sending it back around would await the refresh promise that is
    // itself waiting on this very request, deadlocking every 401 in the burst and leaving
    // the session neither refreshed nor cleared.
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isRefreshRequest(originalRequest)
    ) {
      return Promise.reject(error);
    }

    const { accessToken, refreshToken } = store.getState().app.user ?? {};
    if (!refreshToken) {
      store.dispatch(clearUser());
      return Promise.reject(error);
    }

    // Marked before awaiting so a request that still 401s with the fresh token is rejected
    // rather than sent back around for another refresh.
    originalRequest._retry = true;

    // A burst of requests sent just before expiry all come back 401 together. Once one of
    // them (or the SignalR factory) has refreshed, the rest only need the newer token —
    // refreshing again would rotate the credential for nothing.
    if (accessToken && readAuthorizationHeader(originalRequest) !== `Bearer ${accessToken}`) {
      return axiosInstance(withAuthorization(originalRequest, accessToken));
    }

    try {
      // Shared with the SignalR access-token factory: refreshAccessToken() de-duplicates
      // concurrent callers, so parallel 401s cause exactly one token exchange.
      const refreshedAccessToken = await refreshAccessToken();
      return axiosInstance(withAuthorization(originalRequest, refreshedAccessToken));
    } catch (refreshError) {
      // refreshAccessToken() clears the session itself when the server rejects the
      // credential; on a network failure it deliberately leaves the session alone.
      return Promise.reject(refreshError);
    }
  },
);

/** Matches the endpoint fetchRefreshToken() posts to, relative or absolute. */
function isRefreshRequest(config: AxiosRequestConfig): boolean {
  return config.url?.includes('/auth/refresh') ?? false;
}

/** Reads the header whether axios handed us an AxiosHeaders instance or a plain object. */
function readAuthorizationHeader(config: AxiosRequestConfig): string | undefined {
  const headers = config.headers as
    | { get?: (name: string) => unknown; Authorization?: unknown }
    | undefined;

  const value =
    typeof headers?.get === 'function' ? headers.get('Authorization') : headers?.Authorization;

  return typeof value === 'string' ? value : undefined;
}

function withAuthorization(config: AxiosRequestConfig, accessToken: string): AxiosRequestConfig {
  return { ...config, headers: { ...config.headers, Authorization: `Bearer ${accessToken}` } };
}

export default axiosInstance;
