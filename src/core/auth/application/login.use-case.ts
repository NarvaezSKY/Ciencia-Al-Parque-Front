import type { IAuthRepository } from "../domain/auth.repository";

export const loginUseCase = (repository: IAuthRepository) => repository.login;
