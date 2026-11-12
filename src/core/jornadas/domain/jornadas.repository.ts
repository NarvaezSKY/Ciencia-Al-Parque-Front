import type { IJornadaConRegistrosRes } from "./con-registros";
import type { IJornadaEventoRes } from "./evento";

export interface IJornadasRepository {
  getEvento(): Promise<IJornadaEventoRes[]>;
  getConRegistros(): Promise<IJornadaConRegistrosRes[]>;
}
