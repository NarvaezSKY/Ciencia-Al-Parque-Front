import { create } from "zustand";
import { listarSorteosUseCase, realizarSorteoUseCase } from "@/core/sorteos/application";
import { sorteosRepository } from "@/core/sorteos/infrastructure/sorteos.repository";
import type { IRealizarReq, ISorteoResultado } from "@/core/sorteos/domain/realizar";
import type { ISorteoHistorial } from "@/core/sorteos/domain/historial";
import { getJornadasConRegistrosUseCase } from "@/core/jornadas/application";
import { jornadasRepository } from "@/core/jornadas/infrastructure/jornadas.repository";
import type { JornadaConRegistros } from "@/types";
import { getApiErrorMessage } from "@/utils/apiError";

interface SorteosState {
  jornadas: JornadaConRegistros[];
  historial: ISorteoHistorial[];
  isLoading: boolean;
  realizando: boolean;
  error: string | null;
  cargarDatos: () => Promise<void>;
  realizar: (data: IRealizarReq) => Promise<ISorteoResultado>;
}

export const useSorteosStore = create<SorteosState>((set) => ({
  jornadas: [],
  historial: [],
  isLoading: false,
  realizando: false,
  error: null,

  cargarDatos: async () => {
    set({ isLoading: true, error: null });
    try {
      const [jornadas, historial] = await Promise.all([
        getJornadasConRegistrosUseCase(jornadasRepository)(),
        listarSorteosUseCase(sorteosRepository)()
      ]);
      set({ jornadas, historial, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: getApiErrorMessage(err, "No se pudieron cargar los datos de sorteos")
      });
      throw err;
    }
  },

  realizar: async (data) => {
    set({ realizando: true, error: null });
    try {
      const resultado = await realizarSorteoUseCase(sorteosRepository)(data);
      const historial = await listarSorteosUseCase(sorteosRepository)();
      set({ realizando: false, historial });
      return resultado;
    } catch (err) {
      set({
        realizando: false,
        error: getApiErrorMessage(err, "No se pudo realizar el sorteo")
      });
      throw err;
    }
  }
}));
