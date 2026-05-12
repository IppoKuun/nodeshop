import axios from "axios";
import { API_BASE_URL } from "./api-base-url";

const isDev = process.env.NODE_ENV !== "production";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

console.log("[axios] baseURL =", api.defaults.baseURL);

// Interceptor Request
api.interceptors.request.use((config) => {
  config.headers = config.headers || {};

  const isFormData = config.data instanceof FormData;
  if (config.data && !isFormData && !config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    // Ignorer proprement les requêtes annulées
    if (err?.code === "ERR_CANCELED" || err?.name === "CanceledError") {
      return Promise.reject({ canceled: true });
    }

    const msg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Erreur réseau";

    const status = err.response?.status;
    const data = err.response?.data;

    if (isDev) {
      console.error("[AXIOS ERROR]", {
        status: err.response?.status,
        msg,
        data: err.response?.data,
        url: err.config?.url,
        method: err.config?.method,
        axios: err.toJSON ? err.toJSON() : err,
      });
    }

    return Promise.reject({ msg, status, data });
  }
);

const get = (url, config) => api.get(url, config);
const post = (url, data, config) => api.post(url, data, config);
const del = (url, config) => api.delete(url, config);
const patch = (url, data, config) => api.patch(url, data, config);

export default {
  get,
  post,
  delete: del,
  patch,
  raw: api,
};
