import axios from "axios";
import { BACKEND_URL } from "./config";
import { requestInterceptor } from "./interceptors/request";
import { responseInterceptor } from "./interceptors/response";

export const axiosInstance = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: { "Content-Type": "application/json" }
});

axiosInstance.interceptors.request.use(requestInterceptor);
axiosInstance.interceptors.response.use(
  responseInterceptor.onFulfilled,
  responseInterceptor.onRejected
);
