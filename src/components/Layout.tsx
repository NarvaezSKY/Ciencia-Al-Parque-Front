import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? "bg-white text-indigo-700 shadow-sm"
      : "text-indigo-100 hover:bg-white/10"
  }`;

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    toast.success("Cerraste sesión");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-indigo-700 text-white">
        <nav className="mx-auto max-w-6xl px-4 py-3 flex flex-wrap items-center gap-2">
          <span className="font-bold text-lg mr-4">Ciencia al Parque</span>
          <NavLink to="/" className={linkClasses} end>
            Inicio
          </NavLink>
          <NavLink to="/asistencias" className={linkClasses}>
            Asistencias
          </NavLink>
          {user?.rol === "ADMIN" && (
            <NavLink to="/sorteos" className={linkClasses}>
              Sorteos
            </NavLink>
          )}

          <div className="ml-auto flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden sm:inline text-sm text-indigo-100">
                  {user.email}
                </span>
                <Button
                  size="sm"
                  variant="tertiary"
                  onPress={() => void onLogout()}
                >
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="tertiary"
                onPress={() => navigate("/login")}
              >
                Ingresar
              </Button>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        Ciencia al Parque · Registro de asistencias, sorteos y estadísticas en
        tiempo real
      </footer>
    </div>
  );
}
