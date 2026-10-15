import type { ISorteosRepository } from "../domain/sorteos.repository";

export const listarSorteosUseCase = (repository: ISorteosRepository) =>
  repository.listar;
