import type { IAsistenciasRepository } from "../domain/asistencias.repository";

export const registrarUseCase = (repository: IAsistenciasRepository) =>
  repository.registrar;
