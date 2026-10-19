import type { Turno } from "@/types";

export const etiquetaTurno = (turno: Turno) =>
  turno === "MANANA" ? "Mañana" : "Tarde";
