import type { IAuthRepository } from "../domain/auth.repository";

export const logoutUseCase = (repository: IAuthRepository) =>
  repository.logout;
