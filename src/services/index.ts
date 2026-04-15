import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const source = axios.CancelToken.source();

api.interceptors.request.use(
  (config) => {
    if (!navigator.onLine) {
      return Promise.reject(new Error("You are currently offline."));
    }

    const auth_token =
      localStorage.getItem("Flow-Auth-Token") ||
      (localStorage.getItem("persist:root") &&
        JSON.parse(JSON.parse(localStorage.getItem("persist:root") || "{}").auth || "{}")
          ?.token);

    if (auth_token) {
      config.headers["Authorization"] = `Bearer ${auth_token}`;
    }
    config.cancelToken = source.token;
    return config;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  }
);

export const cancelRequest = (message: string) => source.cancel(message);

export default api;
