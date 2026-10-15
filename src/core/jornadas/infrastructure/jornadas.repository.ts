import { axiosInstance } from "@/config/instance";
import type { IJornadasRepository } from "../domain/jornadas.repository";
import type { IJornadaActualRes } from "../domain/actual";
import type { IJornadaConRegistrosRes } from "../domain/con-registros";

export const jornadasRepository: IJornadasRepository = {
  async getActual(): Promise<IJornadaActualRes> {
    try {
      const response = await axiosInstance.get<IJornadaActualRes>(
        "/jornadas/actual"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getConRegistros(): Promise<IJornadaConRegistrosRes[]> {
    try {
      const response = await axiosInstance.get<IJornadaConRegistrosRes[]>(
        "/jornadas",
        { params: { conRegistros: "true" } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
