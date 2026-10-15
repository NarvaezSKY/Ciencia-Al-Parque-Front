import type { AxiosError } from "axios";
import type { ApiErrorBody } from "@/types";

export const getErrorBody = (error: unknown): ApiErrorBody | null => {
  const axiosError = error as AxiosError<ApiErrorBody>;
  return axiosError?.response?.data ?? null;
};

export const getApiErrorMessage = (error: unknown, fallback: string): string =>
  getErrorBody(error)?.message ?? fallback;
