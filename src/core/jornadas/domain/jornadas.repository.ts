import type { IJornadaActualRes } from "./actual";
import type { IJornadaConRegistrosRes } from "./con-registros";

export interface IJornadasRepository {
  getActual(): Promise<IJornadaActualRes>;
  getConRegistros(): Promise<IJornadaConRegistrosRes[]>;
}
