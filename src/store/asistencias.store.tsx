import { create } from "zustand";
import {
  registrarUseCase,
  validarStaffUseCase,
  verificarUseCase
} from "@/core/asistencias/application";
import { asistenciasRepository } from "@/core/asistencias/infrastructure/asistencias.repository";
import type { IRegistrarReq, IRegistrarRes } from "@/core/asistencias/domain/registrar";
import type { IValidarStaffRes } from "@/core/asistencias/domain/validar-staff";
import type { IVerificarRes } from "@/core/asistencias/domain/verificar";
import { getJornadaActualUseCase } from "@/core/jornadas/application";
import { jornadasRepository } from "@/core/jornadas/infrastructure/jornadas.repository";
import type { JornadaActual } from "@/types";
import { getApiErrorMessage } from "@/utils/apiError";

interface AsistenciasState {
  jornadaActual: JornadaActual | null;
  verificacion: IVerificarRes | null;
  documentoVerificado: string | null;
  resultado: IRegistrarRes | null;
  isLoading: boolean;
  isValidandoStaff: boolean;
  claveStaffValidada: boolean;
  error: string | null;
  cargarJornadaActual: () => Promise<void>;
  verificar: (documento: string) => Promise<IVerificarRes>;
  registrar: (data: IRegistrarReq) => Promise<IRegistrarRes>;
  validarClaveStaff: (password: string) => Promise<IValidarStaffRes>;
  invalidarClaveStaff: () => void;
  reiniciar: () => void;
}

export const useAsistenciasStore = create<AsistenciasState>((set) => ({
  jornadaActual: null,
  verificacion: null,
  documentoVerificado: null,
  resultado: null,
  isLoading: false,
  isValidandoStaff: false,
  claveStaffValidada: false,
  error: null,

  cargarJornadaActual: async () => {
    try {
      const jornada = await getJornadaActualUseCase(jornadasRepository)();
      set({ jornadaActual: jornada });
    } catch {
      set({ jornadaActual: null });
    }
  },

  verificar: async (documento) => {
    set({ isLoading: true, error: null, resultado: null });
    try {
      const result = await verificarUseCase(asistenciasRepository)({ documento });
      set({
        isLoading: false,
        verificacion: result,
        documentoVerificado: documento
      });
      return result;
    } catch (err) {
      set({
        isLoading: false,
        error: getApiErrorMessage(err, "No se pudo verificar el documento")
      });
      throw err;
    }
  },

  registrar: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const result = await registrarUseCase(asistenciasRepository)(data);
      set({ isLoading: false, resultado: result });
      return result;
    } catch (err) {
      set({
        isLoading: false,
        error: getApiErrorMessage(err, "Error al registrar la asistencia")
      });
      throw err;
    }
  },

  validarClaveStaff: async (password) => {
    set({ isValidandoStaff: true, error: null });
    try {
      const result = await validarStaffUseCase(asistenciasRepository)({
        password
      });
      set({
        isValidandoStaff: false,
        claveStaffValidada: Boolean(result.valido)
      });
      return result;
    } catch (err) {
      set({
        isValidandoStaff: false,
        claveStaffValidada: false,
        error: getApiErrorMessage(
          err,
          "No se pudo validar la contraseña de staff"
        )
      });
      throw err;
    }
  },

  invalidarClaveStaff: () => set({ claveStaffValidada: false }),

  reiniciar: () =>
    set({
      verificacion: null,
      documentoVerificado: null,
      resultado: null,
      isLoading: false,
      isValidandoStaff: false,
      claveStaffValidada: false,
      error: null
    })
}));
