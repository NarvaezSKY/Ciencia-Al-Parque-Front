import type { IEstadisticasRepository } from "../domain/estadisticas.repository";

export const getSnapshotUseCase = (repository: IEstadisticasRepository) =>
  repository.getSnapshot;
