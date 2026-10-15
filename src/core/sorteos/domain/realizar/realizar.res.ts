import type { ParticipanteRes, Turno } from "@/types";

export interface ISorteoResultado {
  id: string;
  numeroSorteo: number;
  premio: string;
  jornadas: { id: string; fecha: string; turno: Turno; clave: string }[];
  totalElegibles: number;
  ganador: { documento: string; datos: ParticipanteRes };
  createdAt: string;
}
