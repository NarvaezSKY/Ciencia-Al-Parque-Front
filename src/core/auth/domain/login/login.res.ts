import type { Usuario } from "@/types";

export interface ILoginRes {
  accessToken: string;
  refreshToken: string;
  user: Usuario;
}
