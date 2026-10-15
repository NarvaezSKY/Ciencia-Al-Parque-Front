import type { ParticipanteRes, Rol } from "@/types";

export interface ISorteoHistorial {
  _id: string;
  numeroSorteo: number;
  premio: string;
  jornadasParticipantes: string[];
  totalElegibles: number;
  ganadorDocumento: string;
  ganadorDatos: ParticipanteRes;
  realizadoPor?: { _id: string; email: string; rol: Rol };
  createdAt: string;
}
