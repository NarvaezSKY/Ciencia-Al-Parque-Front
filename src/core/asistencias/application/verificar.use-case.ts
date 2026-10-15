import type { IAsistenciasRepository } from "../domain/asistencias.repository";

export const verificarUseCase = (repository: IAsistenciasRepository) =>
  repository.verificar;
