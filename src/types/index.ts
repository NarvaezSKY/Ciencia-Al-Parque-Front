export type Rol = "ADMIN" | "PRESENTADOR";

export type Turno = "MANANA" | "TARDE";

export interface Usuario {
  id: string;
  email: string;
  rol: Rol;
  activo: boolean;
}

export interface ParticipanteRes {
  documento: string;
  nombreCompleto: string;
  edad: number;
  genero: string;
  telefono: string;
  rol: string;
  tipoStaff?: string;
  procedenciaTipo: string;
  municipio: string;
  lugarEvento: string;
  calificacion: number;
  destacado: string;
}

export interface JornadaEvento {
  id: string;
  municipio: string;
  fecha: string;
  turno: Turno;
  clave: string;
}

export interface JornadaConRegistros {
  id: string;
  municipio: string;
  fecha: string;
  turno: Turno;
  clave: string;
  totalAsistentes: number;
}

export interface ApiErrorBody {
  message?: string;
  code?: string;
  camposFaltantes?: string[];
  errors?: { path: string; message: string }[];
}
