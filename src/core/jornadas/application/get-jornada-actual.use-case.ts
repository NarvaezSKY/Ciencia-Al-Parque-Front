import type { IJornadasRepository } from "../domain/jornadas.repository";

export const getJornadaActualUseCase = (repository: IJornadasRepository) =>
  repository.getActual;
