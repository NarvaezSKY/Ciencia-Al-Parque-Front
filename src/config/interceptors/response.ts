import type { AxiosError, AxiosResponse } from "axios";

export const responseInterceptor = {
  onFulfilled: (response: AxiosResponse): AxiosResponse => response,
  onRejected: (error: unknown): Promise<never> => {
    const axiosError = error as AxiosError;
    const status = axiosError?.response?.status;
    const url = String(axiosError?.config?.url ?? "");

    if (status === 401 && !url.includes("/auth/")) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("refreshToken");
      sessionStorage.removeItem("user");
    }

    return Promise.reject(error);
  }
};
