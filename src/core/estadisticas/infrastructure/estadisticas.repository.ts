import { axiosInstance } from "@/config/instance";
import type { IEstadisticasRepository } from "../domain/estadisticas.repository";
import type { IEstadisticasSnapshot } from "../domain/snapshot";

export const estadisticasRepository: IEstadisticasRepository = {
  async getSnapshot(): Promise<IEstadisticasSnapshot> {
    try {
      const response = await axiosInstance.get<IEstadisticasSnapshot>(
        "/estadisticas"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
