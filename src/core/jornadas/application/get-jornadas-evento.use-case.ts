import type { IJornadasRepository } from "../domain/jornadas.repository";

export const getJornadasEventoUseCase = (repository: IJornadasRepository) =>
  repository.getEvento;
