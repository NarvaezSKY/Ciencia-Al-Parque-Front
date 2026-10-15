export interface IRegistrarReq {
  documento: string;
  nombreCompleto?: string;
  edad?: number;
  genero?: string;
  telefono?: string;
  procedenciaTipo?: string;
  procedenciaDetalle?: string;
  lugarEvento?: string;
  calificacion?: number;
  destacado?: string;
  aceptaTratamientoDatos?: boolean;
}
