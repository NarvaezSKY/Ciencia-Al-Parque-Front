import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSorteosStore } from "@/store/sorteos.store";
import type { ISorteoResultado } from "@/core/sorteos/domain/realizar";
import { getErrorBody } from "@/utils/apiError";

const MENSAJES_SORTEO: Record<string, string> = {
  JORNADA_NOT_FOUND: "Una de las jornadas seleccionadas no existe",
  JORNADA_SIN_REGISTROS:
    "Alguna jornada seleccionada no tiene asistencias registradas",
  NO_ELEGIBLES: "No hay participantes elegibles: todos ya han ganado",
  SORTEO_CONFLICTO: "No se pudo completar el sorteo, intenta nuevamente"
};

const esperar = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

const DURACION_SORTEO_MS = 3200;

export const useSorteos = () => {
  const { jornadas, historial, isLoading, realizando, cargarDatos, realizar } =
    useSorteosStore();

  const [seleccion, setSeleccion] = useState<string[]>([]);
  const [premio, setPremio] = useState("");
  const [resultado, setResultado] = useState<ISorteoResultado | null>(null);
  const [sorteando, setSorteando] = useState(false);

  useEffect(() => {
    cargarDatos().catch(() => undefined);
  }, [cargarDatos]);

  const alternarJornada = (id: string) => {
    setSeleccion((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const reiniciar = () => {
    setSeleccion([]);
    setPremio("");
    setResultado(null);
  };

  const onRealizar = async () => {
    if (seleccion.length === 0) {
      toast.error("Selecciona al menos una jornada");
      return;
    }
    if (!premio.trim()) {
      toast.error("Ingresa el premio del sorteo");
      return;
    }

    setResultado(null);
    setSorteando(true);
    try {
      const [res] = await Promise.all([
        realizar({
          jornadaIds: seleccion,
          premio: premio.trim()
        }),
        esperar(DURACION_SORTEO_MS)
      ]);
      setResultado(res);
      toast.success(
        `Sorteo #${res.numeroSorteo} realizado: ganó ${
          res.ganador.datos.nombreCompleto
        }`
      );
      setSeleccion([]);
      setPremio("");
    } catch (err) {
      const body = getErrorBody(err);
      const mensaje =
        MENSAJES_SORTEO[body?.message ?? ""] ??
        body?.message ??
        "No se pudo realizar el sorteo";
      toast.error(mensaje);
    } finally {
      setSorteando(false);
    }
  };

  return {
    jornadas,
    historial,
    isLoading,
    realizando,
    sorteando,
    seleccion,
    setSeleccion,
    premio,
    setPremio,
    resultado,
    alternarJornada,
    reiniciar,
    onRealizar
  };
};
