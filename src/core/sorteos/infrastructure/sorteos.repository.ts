import { axiosInstance } from "@/config/instance";
import type { ISorteosRepository } from "../domain/sorteos.repository";
import type { ISorteoHistorial } from "../domain/historial";
import type { IRealizarReq, ISorteoResultado } from "../domain/realizar";

export const sorteosRepository: ISorteosRepository = {
  async realizar(data: IRealizarReq): Promise<ISorteoResultado> {
    try {
      const response = await axiosInstance.post<ISorteoResultado>(
        "/sorteos",
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async listar(): Promise<ISorteoHistorial[]> {
    try {
      const response = await axiosInstance.get<ISorteoHistorial[]>("/sorteos");
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
