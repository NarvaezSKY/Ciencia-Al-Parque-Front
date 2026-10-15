import type { IRealizarReq, ISorteoResultado } from "./realizar";
import type { ISorteoHistorial } from "./historial";

export interface ISorteosRepository {
  realizar(data: IRealizarReq): Promise<ISorteoResultado>;
  listar(): Promise<ISorteoHistorial[]>;
}
