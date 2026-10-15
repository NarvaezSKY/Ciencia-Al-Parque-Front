import type { ISorteosRepository } from "../domain/sorteos.repository";

export const realizarSorteoUseCase = (repository: ISorteosRepository) =>
  repository.realizar;
