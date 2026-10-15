import type { IEstadisticasSnapshot } from "./snapshot";

export interface IEstadisticasRepository {
  getSnapshot(): Promise<IEstadisticasSnapshot>;
}
