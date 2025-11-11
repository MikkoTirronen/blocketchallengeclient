// src/utils/axiosClient.ts
import axios, { AxiosError, type AxiosInstance  } from "axios";
import { jwtDecode } from "jwt-decode";

let accessToken: string | null = null;
let setAccessToken: ((token: string | null) => void) | null = null;
let setUser: ((user: any) => void) | null = null;

export const setAuthHandlers = (
  newSetUser: (user: any) => void,
  newSetToken: (token: string | null) => void
) => {
  setUser = newSetUser;
  setAccessToken = newSetToken;
};

// Helper: decode + check expiration
function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

export const setAccessTokenValue = (token: string | null) => {
  accessToken = token;
};

async function refreshToken(): Promise<string | null> {
  try {
    const res = await axios.post(
      "http://localhost:5033/api/auth/refresh",
      {},
      { withCredentials: true }
    );
    if (res.status === 200 && res.data.token) {
      accessToken = res.data.token;
      setAccessToken?.(res.data.token);
      const decoded = jwtDecode(res.data.token);
      setUser?.(decoded);
      return res.data.token;
    }
  } catch (err) {
    console.error("Failed to refresh token:", err);
  }
  return null;
}

// Create Axios instance
export const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:5033/api",
  withCredentials: true,
});

// --- Request Interceptor ---
api.interceptors.request.use(async (config) => {
  if (accessToken && isTokenExpired(accessToken)) {
    const refreshed = await refreshToken();
    if (!refreshed) throw new Error("Session expired.");
  }
  if (config.headers && accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});



// --- Response Interceptor (auto retry on 401) ---
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const refreshed = await refreshToken();
      if (refreshed && error.config) {
        (error.config as any).headers.Authorization = `Bearer ${refreshed}`;
        return api.request(error.config);
      }
    }
    return Promise.reject(error);
  }
);
