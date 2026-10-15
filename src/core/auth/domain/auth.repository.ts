import type { ILoginReq, ILoginRes } from "./login";

export interface IAuthRepository {
  login(data: ILoginReq): Promise<ILoginRes>;
  logout(refreshToken: string): Promise<{ message: string }>;
}
