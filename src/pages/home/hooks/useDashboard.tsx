import { useEffect } from "react";
import { toast } from "sonner";
import { useEstadisticasStore } from "@/store/estadisticas.store";

export const useDashboard = () => {
  const {
    snapshot,
    conectado,
    ultimoGanador,
    isLoading,
    error,
    fetchSnapshot,
    iniciarTiempoReal,
    detenerTiempoReal
  } = useEstadisticasStore();

  useEffect(() => {
    fetchSnapshot().catch(() => undefined);
    iniciarTiempoReal();
    return () => detenerTiempoReal();
  }, [fetchSnapshot, iniciarTiempoReal, detenerTiempoReal]);

  useEffect(() => {
    if (ultimoGanador) {
      const ganador =
        ultimoGanador.ganador?.datos?.nombreCompleto ?? "un participante";
      toast.success(
        `Sorteo #${ultimoGanador.numeroSorteo} (${ultimoGanador.premio}): ganó ${ganador}`
      );
    }
  }, [ultimoGanador]);

  return { snapshot, conectado, isLoading, error };
};
