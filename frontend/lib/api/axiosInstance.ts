import axios, { AxiosError } from "axios";
import { ApiError } from "./types";

const IS_SERVER = typeof window === "undefined";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

api.interceptors.request.use(
  (config) => {
    if (!IS_SERVER) {
      const token = localStorage.getItem("token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: Error) => Promise.reject(handleNetworkError(error)),
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    return Promise.reject(handleNetworkError(error));
  },
);

function handleNetworkError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const backendData = error.response?.data as Record<string, unknown> | undefined;

    return {
      message: String(backendData?.message || backendData?.detail || error.message),
      status: error.response?.status,
      errors: backendData as Record<string, string> | undefined,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: "An unexpected network error occurred" };
}
