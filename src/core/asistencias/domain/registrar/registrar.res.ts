import type { ParticipanteRes, Turno } from "@/types";

export interface IRegistrarRes {
  id: string;
  clave: string;
  fecha: string;
  turno: Turno;
  primeraVez: boolean;
  mensaje: string;
  participante: ParticipanteRes;
}
