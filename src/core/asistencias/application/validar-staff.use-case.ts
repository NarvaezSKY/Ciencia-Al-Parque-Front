import type { IAsistenciasRepository } from "../domain/asistencias.repository";

export const validarStaffUseCase = (repository: IAsistenciasRepository) =>
  repository.validarClaveStaff;
