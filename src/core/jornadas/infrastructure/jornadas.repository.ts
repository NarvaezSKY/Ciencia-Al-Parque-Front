import { axiosInstance } from "@/config/instance";
import type { IJornadasRepository } from "../domain/jornadas.repository";
import type { IJornadaConRegistrosRes } from "../domain/con-registros";
import type { IJornadaEventoRes } from "../domain/evento";

export const jornadasRepository: IJornadasRepository = {
  async getEvento(): Promise<IJornadaEventoRes[]> {
    try {
      const response = await axiosInstance.get<IJornadaEventoRes[]>(
        "/jornadas/evento"
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
