import type { IRegistrarReq, IRegistrarRes } from "./registrar";
import type { IVerificarReq, IVerificarRes } from "./verificar";

export interface IAsistenciasRepository {
  verificar(data: IVerificarReq): Promise<IVerificarRes>;
  registrar(data: IRegistrarReq): Promise<IRegistrarRes>;
}
