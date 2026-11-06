import type { Turno } from "@/types";

export interface IEstadisticasSnapshot {
  jornadaActual: {
    clave: string;
    fecha: string;
    turno: Turno;
    total: number;
    primeraVez: number;
    recurrentes: number;
  };
  porJornada: { clave: string; total: number }[];
  porDia: { fecha: string; total: number }[];
  porEdad: { edad: number; total: number }[];
  porGenero: { genero: string; total: number }[];
  porLugar: { lugar: string; total: number }[];
  asistentesUnicos: number;
  totalAsistencias: number;
  nuevos: number;
  recurrentes: number;
  calificacionPromedio: number;
  calificacionVotos: number;
  ultimaHora: { hora: string; total: number }[];
  staff: {
    asistentesUnicos: number;
    totalAsistencias: number;
    porDia: { fecha: string; total: number }[];
    porJornada: { clave: string; fecha: string; turno: Turno; total: number }[];
    porParticipacion: { tipo: string; total: number }[];
  };
  actualizadoEn: string;
}
