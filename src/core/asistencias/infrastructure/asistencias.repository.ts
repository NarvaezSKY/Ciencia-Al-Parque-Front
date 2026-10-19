import { axiosInstance } from "@/config/instance";
import type { IAsistenciasRepository } from "../domain/asistencias.repository";
import type { IRegistrarReq, IRegistrarRes } from "../domain/registrar";
import type { IVerificarReq, IVerificarRes } from "../domain/verificar";

export const asistenciasRepository: IAsistenciasRepository = {
  async verificar(data: IVerificarReq): Promise<IVerificarRes> {
    try {
      const response = await axiosInstance.post<IVerificarRes>(
        "/asistencias/verificar",
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async registrar(data: IRegistrarReq): Promise<IRegistrarRes> {
    try {
      const response = await axiosInstance.post<
        IRegistrarRes & { asistencia?: IRegistrarRes }
      >("/asistencias", data);
      return response.data.asistencia ?? response.data;
    } catch (error) {
      throw error;
    }
  }
};
