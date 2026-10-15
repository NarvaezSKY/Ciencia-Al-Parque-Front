import { create } from "zustand";
import { loginUseCase, logoutUseCase } from "@/core/auth/application";
import { authRepository } from "@/core/auth/infrastructure/auth.repository";
import type { Usuario } from "@/types";
import { getApiErrorMessage } from "@/utils/apiError";

const readUser = (): Usuario | null => {
  const raw = sessionStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Usuario;
  } catch {
    return null;
  }
};

interface AuthState {
  user: Usuario | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: readUser(),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const result = await loginUseCase(authRepository)({ email, password });
      sessionStorage.setItem("token", result.accessToken);
      sessionStorage.setItem("refreshToken", result.refreshToken);
      sessionStorage.setItem("user", JSON.stringify(result.user));
      set({ isLoading: false, user: result.user });
    } catch (err) {
      set({
        isLoading: false,
        error: getApiErrorMessage(err, "Error al iniciar sesión")
      });
      throw err;
    }
  },

  logout: async () => {
    const refreshToken = sessionStorage.getItem("refreshToken");
    try {
      if (refreshToken) {
        await logoutUseCase(authRepository)(refreshToken);
      }
    } catch {
      // la sesión local se cierra aunque falle la invalidación remota
    }
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("user");
    set({ user: null, error: null });
  }
}));
