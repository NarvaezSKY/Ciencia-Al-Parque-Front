import { axiosInstance } from "@/config/instance";
import type { IAuthRepository } from "../domain/auth.repository";
import type { ILoginReq, ILoginRes } from "../domain/login";

export const authRepository: IAuthRepository = {
  async login(data: ILoginReq): Promise<ILoginRes> {
    try {
      const response = await axiosInstance.post<ILoginRes>("/auth/login", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async logout(refreshToken: string): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.post<{ message: string }>(
        "/auth/logout",
        { refreshToken }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
