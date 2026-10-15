import type { IJornadasRepository } from "../domain/jornadas.repository";

export const getJornadasConRegistrosUseCase = (
  repository: IJornadasRepository
) => repository.getConRegistros;
