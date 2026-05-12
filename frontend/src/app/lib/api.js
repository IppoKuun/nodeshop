import axios from "axios";
import { API_BASE_URL } from "./api-base-url";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

const getRequestUrl = (config = {}) => {
  const baseURL = config.baseURL || API_BASE_URL;
  const url = config.url || "";

  try {
    return new URL(url, `${baseURL}/`).toString();
  } catch {
    return `${baseURL}${url}`;
  }
};

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
    const diagnostic = {
      message: msg,
      status,
      code: err.code,
      method: err.config?.method?.toUpperCase(),
      url: getRequestUrl(err.config),
      hasResponse: Boolean(err.response),
      data,
    };

    if (typeof window !== "undefined") {
      console.error("[api] request failed", diagnostic);
    }

    return Promise.reject({ msg, status, data, code: err.code, url: diagnostic.url });
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
