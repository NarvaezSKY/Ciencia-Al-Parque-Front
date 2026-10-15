import { create } from "zustand";
import { getSnapshotUseCase } from "@/core/estadisticas/application";
import { estadisticasRepository } from "@/core/estadisticas/infrastructure/estadisticas.repository";
import { statsSocket } from "@/core/estadisticas/infrastructure/stats.socket";
import type { IEstadisticasSnapshot } from "@/core/estadisticas/domain/snapshot";
import type { ISorteoResultado } from "@/core/sorteos/domain/realizar";
import { getApiErrorMessage } from "@/utils/apiError";

let handlersRegistrados = false;

interface EstadisticasState {
  snapshot: IEstadisticasSnapshot | null;
  conectado: boolean;
  ultimoGanador: ISorteoResultado | null;
  isLoading: boolean;
  error: string | null;
  fetchSnapshot: () => Promise<void>;
  iniciarTiempoReal: () => void;
  detenerTiempoReal: () => void;
}

export const useEstadisticasStore = create<EstadisticasState>((set) => ({
  snapshot: null,
  conectado: false,
  ultimoGanador: null,
  isLoading: false,
  error: null,

  fetchSnapshot: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await getSnapshotUseCase(estadisticasRepository)();
      set({ snapshot: result, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: getApiErrorMessage(err, "No se pudieron cargar las estadísticas")
      });
      throw err;
    }
  },

  iniciarTiempoReal: () => {
    if (!sessionStorage.getItem("token")) return;

    if (!handlersRegistrados) {
      handlersRegistrados = true;

      statsSocket.on("connect", () => set({ conectado: true }));
      statsSocket.on("disconnect", () => set({ conectado: false }));
      statsSocket.on("stats:snapshot", (data: IEstadisticasSnapshot) =>
        set({ snapshot: data, conectado: true })
      );
      statsSocket.on("stats:update", (data: IEstadisticasSnapshot) =>
        set({ snapshot: data })
      );
      statsSocket.on("sorteo:ganador", (data: ISorteoResultado) =>
        set({ ultimoGanador: data })
      );
      statsSocket.on("connect_error", () => set({ conectado: false }));
    }

    if (!statsSocket.connected) {
      statsSocket.connect();
    }
  },

  detenerTiempoReal: () => {
    if (statsSocket.connected) {
      statsSocket.disconnect();
    }
    set({ conectado: false });
  }
}));
